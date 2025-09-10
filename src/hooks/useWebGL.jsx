import { useRef, useCallback, useEffect, useState, useLayoutEffect } from "react";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { GLView } from "expo-gl";
import { Image } from "react-native";

const CACHE_SIZE_LIMIT = 20; // Reduced from 30
const programCache = new WeakMap();

const useWebGL = ({
  glRef,
  imageUri,
  dimensions,
  shader,
  onError,
  mode = "display",
  onContextCreated,
}) => {
  const programRef = useRef(null);
  const bufferRef = useRef(null);
  const [isContextReady, setIsContextReady] = useState(false);
  const contextAttempts = useRef(0);
  const maxContextAttempts = 3;
  const previewCacheRef = useRef({});
  const cachedAssetRef = useRef(null);

  const vertexShaderSource = `
    precision highp float;
    uniform float uScaleX;
    uniform float uScaleY;
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      vec2 stdUv = vec2((position.x + 1.0) / 2.0, 1.0 - (position.y + 1.0) / 2.0);
      uv = vec2(
        0.5 + (stdUv.x - 0.5) / uScaleX,
        0.5 + (stdUv.y - 0.5) / uScaleY
      );
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  /* ---------- Helpers ---------- */
  const asNumber = (v) => {
    if (typeof v === "number" && isFinite(v)) return v;
    if (
      Array.isArray(v) &&
      v.length === 1 &&
      typeof v[0] === "number" &&
      isFinite(v[0])
    )
      return v[0];
    const coerced = Number(v);
    if (typeof coerced === "number" && isFinite(coerced)) return coerced;
    return null;
  };

  const safeUniform1f = (gl, loc, val) => {
    if (loc === null || loc === undefined) return;
    const n = asNumber(val);
    if (n === null) return;
    try {
      gl.uniform1f(loc, n);
    } catch (e) {}
  };
  const safeUniform1i = (gl, loc, val) => {
    if (loc === null || loc === undefined) return;
    const n = asNumber(val);
    if (n === null) return;
    try {
      gl.uniform1i(loc, Math.floor(n));
    } catch (e) {}
  };
  const safeViewport = (gl, x, y, w, h) => {
    const nx = asNumber(x),
      ny = asNumber(y),
      nw = asNumber(w),
      nh = asNumber(h);
    if (nx === null || ny === null || nw === null || nh === null) return;
    try {
      gl.viewport(nx, ny, nw, nh);
    } catch (e) {}
  };
  const safeClearColor = (gl, r, g, b, a) => {
    const nr = asNumber(r),
      ng = asNumber(g),
      nb = asNumber(b),
      na = asNumber(a);
    if (nr === null || ng === null || nb === null || na === null) return;
    try {
      gl.clearColor(nr, ng, nb, na);
    } catch (e) {}
  };
  const safeBindBufferAndAttrib = (gl, program, buffer) => {
    if (!buffer) return;
    const positionLocation = gl.getAttribLocation(program, "position");
    if (positionLocation === -1 || positionLocation === null) return;
    try {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    } catch (e) {}
  };

  const calculateAspectFitScale = (imageW, imageH, viewW, viewH) => {
    const iw = Math.max(1, asNumber(imageW) || 1);
    const ih = Math.max(1, asNumber(imageH) || 1);
    const vw = Math.max(1, asNumber(viewW) || 1);
    const vh = Math.max(1, asNumber(viewH) || 1);
    const imgAspect = iw / ih;
    const viewAspect = vw / vh;
    let uScaleX = 1.0,
      uScaleY = 1.0;
    if (imgAspect > viewAspect) {
      uScaleX = imgAspect / viewAspect;
      uScaleY = 1.0;
    } else if (imgAspect < viewAspect) {
      uScaleX = 1.0;
      uScaleY = viewAspect / imgAspect;
    }
    return { uScaleX, uScaleY };
  };

  /* ---------- Program cache ---------- */
  const createAndCacheProgram = useCallback((gl, fragmentSource) => {
    let glMap = programCache.get(gl);
    if (!glMap) {
      glMap = new Map();
      programCache.set(gl, glMap);
    }
    const key = fragmentSource || "__default__";
    const cached = glMap.get(key);
    if (cached) return cached;

    // compile vs
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShaderSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      const err = gl.getShaderInfoLog(vs);
      gl.deleteShader(vs);
      throw new Error(`Vertex shader compile failed: ${err}`);
    }

    const defaultFS = `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D tex;
      void main() { gl_FragColor = texture2D(tex, uv); }
    `;
    const fsSource = fragmentSource || defaultFS;
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      const err = gl.getShaderInfoLog(fs);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      throw new Error(`Fragment shader compile failed: ${err}`);
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const err = gl.getProgramInfoLog(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
      throw new Error(`Program link failed: ${err}`);
    }

    const compiled = { program, vs, fs };
    glMap.set(key, compiled);
    return compiled;
  }, []);

  /* ---------- Get natural size of image (asset or fallback to Image.getSize) ---------- */
  const getImageNaturalSize = async (uri) => {
    try {
      if (cachedAssetRef.current && cachedAssetRef.current.uri === uri && cachedAssetRef.current.asset) {
        const a = cachedAssetRef.current.asset;
        if (a.width && a.height) return { width: a.width, height: a.height };
      }
    } catch (e) {}

    try {
      const a = await Asset.fromURI(uri).downloadAsync();
      if (a.width && a.height) return { width: a.width, height: a.height };
    } catch (e) {}

    try {
      const size = await new Promise((res, rej) => {
        Image.getSize(uri, (w, h) => res({ width: w, height: h }), rej);
      });
      return size;
    } catch (e) {
      return { width: dimensions?.width || 1, height: dimensions?.height || 1 };
    }
  };

  /* ---------- onContextCreate ---------- */
  const onContextCreate = useCallback(
    async (gl) => {
      if (!imageUri || !dimensions?.width || !dimensions?.height) {
        onError?.("Missing image URI or dimensions");
        contextAttempts.current++;
        if (contextAttempts.current < maxContextAttempts) {
          setTimeout(() => onContextCreate(gl), 50);
        }
        return;
      }

      glRef.current = gl;

      try {
        const natural = await getImageNaturalSize(imageUri);
        let initialScale = { uScaleX: 1.0, uScaleY: 1.0 };
        if (mode === "display") {
          initialScale = calculateAspectFitScale(
            natural.width,
            natural.height,
            gl.drawingBufferWidth,
            gl.drawingBufferHeight
          );
        } else {
          const w = asNumber(dimensions.width),
            h = asNumber(dimensions.height);
          if (w && h) {
            gl.drawingBufferWidth = w;
            gl.drawingBufferHeight = h;
          }
        }

        const { program } = createAndCacheProgram(gl, shader);

        if (!cachedAssetRef.current || cachedAssetRef.current.uri !== imageUri) {
          const asset = await Asset.fromURI(imageUri).downloadAsync();
          cachedAssetRef.current = { uri: imageUri, asset };
        }

        if (!bufferRef.current) {
          const buf = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
          );
          bufferRef.current = buf;
        }

        const tex = gl.createTexture();
        try {
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          try {
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              cachedAssetRef.current.asset
            );
          } catch (e) {}
        } catch (e) {}

        if (mode === "display") {
          try {
            gl.useProgram(program);
            safeBindBufferAndAttrib(gl, program, bufferRef.current);
            const texLoc = gl.getUniformLocation(program, "tex");
            safeUniform1i(gl, texLoc, 0);
            const uScaleXLoc = gl.getUniformLocation(program, "uScaleX");
            const uScaleYLoc = gl.getUniformLocation(program, "uScaleY");
            safeUniform1f(gl, uScaleXLoc, initialScale.uScaleX);
            safeUniform1f(gl, uScaleYLoc, initialScale.uScaleY);
            safeViewport(
              gl,
              0,
              0,
              gl.drawingBufferWidth,
              gl.drawingBufferHeight
            );
            safeClearColor(gl, 0, 0, 0, 1);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.flush();
            gl.endFrameEXP();
          } catch (e) {}
          programRef.current = program;
        }

        if (!("initialTexture" in glRef.current)) glRef.current.initialTexture = tex;
        setIsContextReady(true);

        if (typeof onContextCreated === "function") {
          onContextCreated(gl);
        }
      } catch (err) {
        console.error("GL context creation error:", err);
        onError?.(err?.message || String(err));
        contextAttempts.current++;
        if (contextAttempts.current < maxContextAttempts) {
          setTimeout(() => onContextCreate(gl), 100);
        } else {
          setIsContextReady(false);
        }
      }
    },
    [
      imageUri,
      dimensions,
      shader,
      onError,
      mode,
      createAndCacheProgram,
      onContextCreated,
    ]
  );

  /* ---------- stat helper ---------- */
  const statUri = async (uri) => {
    if (!uri) return { exists: false };
    try {
      const attempts = [
        uri,
        uri.startsWith("file://") ? uri : `file://${uri}`,
        uri.replace(/^file:\/\//, ""),
      ];
      for (const a of attempts) {
        if (!a) continue;
        try {
          const info = await FileSystem.getInfoAsync(a);
          if (info.exists) return { exists: true, uri: a, info };
        } catch (e) {}
      }
      return { exists: false };
    } catch (e) {
      return { exists: false };
    }
  };

  /* ---------- wait helper ---------- */
  const waitForContextReady = async (timeout = 2000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (glRef.current && bufferRef.current) return;
      await new Promise((r) => setTimeout(r, 30));
    }
    throw new Error("Timeout waiting for GL context");
  };

  /* ---------- generateFilteredImage (final) ---------- */
  const generateFilteredImage = useCallback(
    async ({ imageUri: inputImageUri, filterShader, isPreview = false }) => {
      if (!inputImageUri) throw new Error("Missing image URI");
      if (!filterShader) return inputImageUri;

      try {
        if (!glRef.current || !bufferRef.current)
          await waitForContextReady(2000);
      } catch (e) {
        throw new Error("Generation context not ready");
      }
      const gl = glRef.current;
      if (!gl) throw new Error("GL context missing");

      try {
        if (!cachedAssetRef.current || cachedAssetRef.current.uri !== inputImageUri) {
          const asset = await Asset.fromURI(inputImageUri).downloadAsync();
          cachedAssetRef.current = { uri: inputImageUri, asset };
        }
        const natural =
          cachedAssetRef.current &&
          cachedAssetRef.current.asset &&
          cachedAssetRef.current.asset.width &&
          cachedAssetRef.current.asset.height
            ? {
                width: cachedAssetRef.current.asset.width,
                height: cachedAssetRef.current.asset.height,
              }
            : await getImageNaturalSize(inputImageUri);

        const { program } = createAndCacheProgram(gl, filterShader);

        const tex = gl.createTexture();
        try {
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          try {
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              cachedAssetRef.current.asset
            );
          } catch (e) {}
        } catch (e) {}

        gl.useProgram(program);
        safeBindBufferAndAttrib(gl, program, bufferRef.current);
        const tloc = gl.getUniformLocation(program, "tex");
        safeUniform1i(gl, tloc, 0);

        const scaleFinal = calculateAspectFitScale(
          natural.width,
          natural.height,
          gl.drawingBufferWidth,
          gl.drawingBufferHeight
        );
        const uX = gl.getUniformLocation(program, "uScaleX");
        const uY = gl.getUniformLocation(program, "uScaleY");
        safeUniform1f(gl, uX, scaleFinal.uScaleX);
        safeUniform1f(gl, uY, scaleFinal.uScaleY);

        safeViewport(gl, 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        safeClearColor(gl, 0, 0, 0, 1);

        try {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          gl.flush();
          gl.endFrameEXP();
          gl.finish();
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, null);
        } catch (e) {}

        let snapshot;
        let attempts = 0;
        const maxSnapshotAttempts = isPreview ? 2 : 3;
        while (attempts < maxSnapshotAttempts) {
          try {
            snapshot = await GLView.takeSnapshotAsync(gl, {
              format: "jpeg",
              quality: isPreview ? 0.5 : 0.85,
              rect: {
                x: 0,
                y: 0,
                width: gl.drawingBufferWidth,
                height: gl.drawingBufferHeight,
              },
            });
            const stat = await statUri(snapshot.uri);
            if (!stat.exists) throw new Error("Invalid snapshot");
            break;
          } catch (err) {
            attempts++;
            if (attempts >= maxSnapshotAttempts) throw err;
            await new Promise((r) => setTimeout(r, 120));
          }
        }

        const outUri = snapshot.uri.startsWith("file://")
          ? snapshot.uri
          : `file://${snapshot.uri}`;
        const outInfo = await FileSystem.getInfoAsync(outUri);
        if (!outInfo.exists || outInfo.size < 1000)
          throw new Error("Invalid output file");

        try {
          gl.deleteTexture(tex);
        } catch (_) {}
        return outUri;
      } catch (err) {
        console.error("generateFilteredImage failed:", err);
        throw err;
      }
    },
    [createAndCacheProgram]
  );

  /* ---------- generatePreviewImages (progressive, fixed stretch) ---------- */
  const generatePreviewImages = useCallback(
    async ({
      imageUri: inputImageUri,
      filters,
      dimensions: previewDims,
      visibleFilters,
      onPreviewGenerated,
    }) => {
      if (
        !inputImageUri ||
        !filters ||
        !previewDims?.width ||
        !previewDims?.height ||
        !visibleFilters?.length
      ) {
        throw new Error("Missing required params for preview generation");
      }

      try {
        if (!glRef.current || !bufferRef.current)
          await waitForContextReady(2000);
      } catch (e) {
        throw new Error("Preview context not ready");
      }
      const gl = glRef.current;
      if (!gl) throw new Error("GL context missing");

      const previewUris = {};

      if (!cachedAssetRef.current || cachedAssetRef.current.uri !== inputImageUri) {
        const asset = await Asset.fromURI(inputImageUri).downloadAsync();
        cachedAssetRef.current = { uri: inputImageUri, asset };
      }
      const natural =
        cachedAssetRef.current &&
        cachedAssetRef.current.asset &&
        cachedAssetRef.current.asset.width &&
        cachedAssetRef.current.asset.height
          ? { width: cachedAssetRef.current.asset.width, height: cachedAssetRef.current.asset.height }
          : await getImageNaturalSize(inputImageUri);

      gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current);

      for (const filterName of visibleFilters) {
        await new Promise((r) => requestAnimationFrame(r));

        const filterShader = filters[filterName];
        if (!filterShader) {
          previewUris[filterName] = inputImageUri;
          onPreviewGenerated?.(filterName, inputImageUri);
          continue;
        }

        const cacheKey = `${inputImageUri}-${filterName}`;
        if (previewCacheRef.current[cacheKey]) {
          try {
            const stat = await statUri(previewCacheRef.current[cacheKey]);
            if (stat.exists) {
              previewUris[filterName] = stat.uri;
              onPreviewGenerated?.(filterName, stat.uri);
              continue;
            } else {
              delete previewCacheRef.current[cacheKey];
            }
          } catch (e) {
            delete previewCacheRef.current[cacheKey];
          }
        }

        let attempts = 0;
        const maxAttempts = 2;
        let generated = null;
        while (attempts < maxAttempts && !generated) {
          try {
            const { program } = createAndCacheProgram(gl, filterShader);

            const tex = gl.createTexture();
            try {
              gl.bindTexture(gl.TEXTURE_2D, tex);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
              gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE
              );
              gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE
              );
              try {
                gl.texImage2D(
                  gl.TEXTURE_2D,
                  0,
                  gl.RGBA,
                  gl.RGBA,
                  gl.UNSIGNED_BYTE,
                  cachedAssetRef.current.asset
                );
              } catch (e) {}
            } catch (e) {}

            gl.useProgram(program);
            safeBindBufferAndAttrib(gl, program, bufferRef.current);
            const texLoc = gl.getUniformLocation(program, "tex");
            safeUniform1i(gl, texLoc, 0);

            const scalePreview = calculateAspectFitScale(
              natural.width,
              natural.height,
              previewDims.width,
              previewDims.height
            );
            const uX = gl.getUniformLocation(program, "uScaleX");
            const uY = gl.getUniformLocation(program, "uScaleY");
            safeUniform1f(gl, uX, scalePreview.uScaleX);
            safeUniform1f(gl, uY, scalePreview.uScaleY);

            safeViewport(gl, 0, 0, previewDims.width, previewDims.height);
            safeClearColor(gl, 0, 0, 0, 1);

            try {
              gl.activeTexture(gl.TEXTURE0);
              gl.bindTexture(gl.TEXTURE_2D, tex);
              gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
              gl.flush();
              gl.endFrameEXP();
              gl.finish();
              gl.activeTexture(gl.TEXTURE0);
              gl.bindTexture(gl.TEXTURE_2D, null);
            } catch (e) {}

            let snapshot = null;
            let sAttempts = 0;
            while (sAttempts < 2) {
              try {
                snapshot = await GLView.takeSnapshotAsync(gl, {
                  format: "jpeg",
                  quality: 0.45,
                  rect: {
                    x: 0,
                    y: 0,
                    width: previewDims.width,
                    height: previewDims.height,
                  },
                });
                const stat = await statUri(snapshot.uri);
                if (!stat.exists) throw new Error("Invalid snapshot");
                generated = stat.uri;
                break;
              } catch (err) {
                sAttempts++;
                if (sAttempts >= 2) throw err;
                await new Promise((r) => setTimeout(r, 60));
              }
            }

            if (!generated) throw new Error("Failed to generate snapshot");

            previewUris[filterName] = generated;
            previewCacheRef.current[cacheKey] = generated;
            onPreviewGenerated?.(filterName, generated);

            try {
              gl.deleteTexture(tex);
            } catch (_) {}
            break;
          } catch (err) {
            attempts++;
            if (attempts >= maxAttempts) {
              previewUris[filterName] = inputImageUri;
              previewCacheRef.current[cacheKey] = inputImageUri;
              onPreviewGenerated?.(filterName, inputImageUri);
              break;
            }
            await new Promise((r) => setTimeout(r, 40));
          }
        }

        await new Promise((r) => setTimeout(r, 6));
      }

      const keys = Object.keys(previewCacheRef.current);
      if (keys.length > CACHE_SIZE_LIMIT) {
        const oldest = keys.slice(0, keys.length - CACHE_SIZE_LIMIT);
        for (const k of oldest) {
          try {
            const uri = previewCacheRef.current[k];
            if (uri && uri.startsWith(FileSystem.documentDirectory)) {
              await FileSystem.deleteAsync(uri, { idempotent: true });
            }
          } catch (e) {}
          delete previewCacheRef.current[k];
        }
      }

      return previewUris;
    },
    [createAndCacheProgram, glRef]
  );

  /* ---------- display sync (Modified) ---------- */
  useEffect(() => {
    if (mode !== "display") return;
    const gl = glRef.current;
    if (
      !gl ||
      !imageUri ||
      !dimensions?.width ||
      !dimensions?.height ||
      !isContextReady
    )
      return;

    try {
      const { program } = createAndCacheProgram(gl, shader);
      programRef.current = program;

      gl.useProgram(program);
      safeBindBufferAndAttrib(gl, program, bufferRef.current);

      const texLoc = gl.getUniformLocation(program, "tex");
      safeUniform1i(gl, texLoc, 0);

      const naturalWidth =
        cachedAssetRef.current && cachedAssetRef.current.asset && cachedAssetRef.current.asset.width
          ? cachedAssetRef.current.asset.width
          : dimensions.width;
      const naturalHeight =
        cachedAssetRef.current && cachedAssetRef.current.asset && cachedAssetRef.current.asset.height
          ? cachedAssetRef.current.asset.height
          : dimensions.height;
      const scale = calculateAspectFitScale(
        naturalWidth,
        naturalHeight,
        gl.drawingBufferWidth,
        gl.drawingBufferHeight
      );
      const uX = gl.getUniformLocation(program, "uScaleX");
      const uY = gl.getUniformLocation(program, "uScaleY");
      safeUniform1f(gl, uX, scale.uScaleX);
      safeUniform1f(gl, uY, scale.uScaleY);

      safeViewport(gl, 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      safeClearColor(gl, 0, 0, 0, 1);

      try {
        if (glRef.current.initialTexture) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, glRef.current.initialTexture);
        }
        gl.clear(gl.COLOR_BUFFER_BIT); // Clear previous frame
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.flush();
        gl.endFrameEXP();
        gl.finish();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
      } catch (e) {
        console.error("Draw error:", e);
      }
    } catch (err) {
      onError?.(err?.message || String(err));
    }
  }, [
    shader,
    dimensions,
    imageUri,
    isContextReady,
    mode,
    createAndCacheProgram,
  ]);

  /* ---------- cleanup ---------- */
  useLayoutEffect(() => {
    return () => {
      const gl = glRef.current;
      if (gl) {
        gl.finish(); // Ensure all operations are complete before cleanup
        // Clean up all programs in cache for this gl
        const glMap = programCache.get(gl);
        if (glMap) {
          glMap.forEach(({ program, vs, fs }) => {
            try {
              gl.useProgram(null);
              gl.deleteProgram(program);
            } catch (_) {}
            try {
              gl.deleteShader(vs);
            } catch (_) {}
            try {
              gl.deleteShader(fs);
            } catch (_) {}
          });
          glMap.clear();
          programCache.delete(gl);
        }

        // Delete current program if exists
        if (programRef.current) {
          try {
            gl.useProgram(null);
            gl.deleteProgram(programRef.current);
          } catch (_) {}
        }

        // Delete initial texture if exists
        if (glRef.current.initialTexture) {
          try {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.deleteTexture(glRef.current.initialTexture);
          } catch (_) {}
        }

        // Delete buffer if exists
        if (bufferRef.current) {
          try {
            const positionLocation = gl.getAttribLocation(programRef.current || null, "position");
            if (positionLocation !== -1) {
              gl.disableVertexAttribArray(positionLocation);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.deleteBuffer(bufferRef.current);
          } catch (_) {}
        }

        // Destroy the GL context to free memory if valid
        if (typeof gl.exglCtxId === 'number') {
          GLView.destroyContextAsync(gl).catch((e) =>
            console.error("Context destroy error:", e)
          );
        }
      }

      // Clear cached asset
      cachedAssetRef.current = null;

      // If generation mode, clear previewCache to free file resources
      if (mode === "generation") {
        Object.values(previewCacheRef.current).forEach((uri) => {
          if (uri) {
            FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
          }
        });
        previewCacheRef.current = {};
      }

      setIsContextReady(false);
    };
  }, [mode, imageUri]);

  return {
    onContextCreate,
    isContextReady,
    generateFilteredImage,
    generatePreviewImages,
  };
};

export default useWebGL;