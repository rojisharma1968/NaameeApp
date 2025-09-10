export const FILTERS = {
  Normal: null,
  Andy: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      float grayscale = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(grayscale), c.rgb, 1.1) + 0.2;
      gl_FragColor = c;
    }
  `,
  Annie: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
        vec4 c = texture2D(tex, uv);
        c.rgb *= vec3(1.0, 1.005, 1.015);
        float grayscale = dot(c.rgb, vec3(0.299, 0.587, 0.114));
        c.rgb = mix(vec3(grayscale), c.rgb, 1.2) + 0.3;
        c.rgb = c.rgb / (c.rgb + 1.0);
        gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Bill: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.b *= 1.0025;
      c.r *= 0.999;
      float grayscale = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(grayscale), c.rgb, 1.1) * 1.6;
      gl_FragColor = c;
    }
  `,
  Cindy: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.b *= 1.05;
      c.r *= 0.98;
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.6) * 1.3;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  David: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(0.98, 1.0, 1.05);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.5) * 1.85 / (1.0 + 1.85);
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Egg: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.4);
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Ellen: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(0.93, 1.02, 1.1);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.3) * 1.3 / 1.8;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Guy: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(1.05, 1.02, 0.97);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.4) * 1.3 / 1.6;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Hedi: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(1.03, 1.01, 0.98);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 0.01) * 1.09;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Helmut: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(1.02, 1.005, 0.99);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 0.01) * 1.55 / 2.35;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Juergen: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb = vec3(
        c.r * 0.9 + c.g * 0.1 + c.b * 0.3,
        c.r * 0.7 + c.g * 0.3 + c.b * 0.1,
        c.r * 0.4 + c.g * 0.4 + c.b * 0.4
      );
      c.r *= 1.018;
      c.g *= 1.006;
      c.b *= 0.997;
      c.rgb *= 2.09 / 2.59;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Karl: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(0.88, 1.04, 1.15);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.8) * 1.9 / 2.2;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Linda: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(1.04, 1.01, 0.97);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 0.1);
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Mario: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(0.85, 1.05, 1.2);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.7) * 1.5 / 1.9;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Nick: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(0.94, 1.02, 1.08);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.09) * 1.5 / 2.1;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Petra: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(0.92, 1.03, 1.12);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 2.0) * 1.5 / 1.9;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Rt: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(0.96, 1.01, 1.06);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.4) * 1.4 / 1.9;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Tim: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(0.90, 1.03, 1.15);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.8) * 1.5 / 1.85;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Tommy: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.2) * 1.5 / 2.0;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Wong: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      c.rgb *= vec3(1.005, 1.001, 0.998);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.9) * 0.8 * 0.9 + 0.05;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
  Z: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;

    void main() {
      vec4 c = texture2D(tex, uv);
      float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(luminance), c.rgb, 1.55) * 1.2 / 1.9;
      gl_FragColor = vec4(c.rgb, c.a);
    }
  `,
};
