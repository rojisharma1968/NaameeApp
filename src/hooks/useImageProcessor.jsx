import { useState, useEffect } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { Image } from "react-native";

const processedCache = {};
const MAX_CACHE_SIZE = 5; // Reduced from 10 to limit memory

const useImageProcessor = (imageUri, context = "main") => {
  const [imageInfo, setImageInfo] = useState({
    dimensions: { width: 0, height: 0 },
    processedUri: null,
    status: "loading",
  });

  useEffect(() => {
    if (!imageUri) {
      setImageInfo({
        dimensions: { width: 0, height: 0 },
        processedUri: null,
        status: "error",
      });
      return;
    }

    let isMounted = true;

    const processImage = async () => {
      const cacheKey = `${imageUri}-${context}`;
      if (processedCache[cacheKey]) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(
            processedCache[cacheKey].processedUri
          );
          if (fileInfo.exists) {
            if (isMounted) setImageInfo(processedCache[cacheKey]);
            return;
          } else {
            delete processedCache[cacheKey];
          }
        } catch (e) {
          delete processedCache[cacheKey];
        }
      }

      try {
        // Use Image.getSize to get dimensions for remote/local images
        const { width, height } = await new Promise((resolve, reject) => {
          Image.getSize(
            imageUri,
            (w, h) => resolve({ width: w, height: h }),
            reject
          );
        });

        if (!isMounted) return;

        const maxSize = context === "preview" ? 180 : 1200; // slightly larger preview to be safe
        const quality = context === "preview" ? 0.45 : 0.8;

        let resizeWidth = width;
        let resizeHeight = height;
        if (width > height) {
          if (width > maxSize) {
            resizeWidth = maxSize;
            resizeHeight = Math.round((height / width) * maxSize);
          }
        } else {
          if (height > maxSize) {
            resizeHeight = maxSize;
            resizeWidth = Math.round((width / height) * maxSize);
          }
        }

        const manipulations = [
          {
            resize: {
              width: Math.round(resizeWidth),
              height: Math.round(resizeHeight),
            },
          },
        ];

        const processedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          manipulations,
          { format: ImageManipulator.SaveFormat.JPEG, compress: quality }
        );

        // processedImage.uri is usually a file:// path on device/simulator
        const fileInfo = await FileSystem.getInfoAsync(processedImage.uri);
        if (!fileInfo.exists) {
          throw new Error(
            `Processed file does not exist: ${processedImage.uri}`
          );
        }

        if (!isMounted) return;

        const info = {
          dimensions: {
            width: Math.round(resizeWidth),
            height: Math.round(resizeHeight),
          },
          processedUri: processedImage.uri,
          status: "ready",
        };

        processedCache[cacheKey] = info;

        // trim processedCache if needed
        const cacheKeys = Object.keys(processedCache);
        if (cacheKeys.length > MAX_CACHE_SIZE) {
          const oldestKeys = cacheKeys.slice(
            0,
            cacheKeys.length - MAX_CACHE_SIZE
          );
          for (const key of oldestKeys) {
            try {
              await FileSystem.deleteAsync(processedCache[key].processedUri, {
                idempotent: true,
              });
            } catch (error) {
              // ignore deletion errors
            }
            delete processedCache[key];
          }
        }

        setImageInfo(info);
      } catch (error) {
        console.error(`Image processing failed for ${context}:`, error);
        if (isMounted) {
          setImageInfo({
            dimensions: { width: 1, height: 1 },
            processedUri: null,
            status: "error",
          });
        }
      }
    };

    processImage();
    return () => {
      isMounted = false;
    };
  }, [imageUri, context]);

  return imageInfo;
};

export default useImageProcessor;