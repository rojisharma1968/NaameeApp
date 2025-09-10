import React, { useMemo, useRef, useEffect, useState } from "react";
import { FlatList, Text, View, Dimensions } from "react-native";
import FilterButton from "./FilterButton";
import { FILTERS } from "./Filters";
import useImageProcessor from "../../hooks/useImageProcessor";
import { GLView } from "expo-gl";
import useWebGL from "../../hooks/useWebGL";
import * as FileSystem from "expo-file-system";

const { width: screenWidth } = Dimensions.get("window");
const PREVIEW_SIZE = 180;

const FilterBar = React.memo(({ imageUri, onFilterSelect, selectedFilter }) => {
  const [previewUris, setPreviewUris] = useState({});
  const { dimensions, processedUri, status } = useImageProcessor(
    imageUri,
    "preview"
  );
  const [contextInitialized, setContextInitialized] = useState(false);
  const previewGLRef = useRef(null);
  const {
    onContextCreate: onPreviewContextCreate,
    generatePreviewImages,
    isContextReady: previewReady,
  } = useWebGL({
    glRef: previewGLRef,
    imageUri: processedUri,
    dimensions: { width: PREVIEW_SIZE, height: PREVIEW_SIZE },
    shader: null,
    onError: (error) => console.error("Preview WebGL error:", error),
    mode: "generation",
  });

  useEffect(() => {
    if (previewReady) setContextInitialized(true);
  }, [previewReady]);

  // robust stat helper used by UI to validate URIs
  const statUri = async (uri) => {
    if (!uri) return { exists: false };
    try {
      const tries = [
        uri,
        uri.startsWith("file://") ? uri : `file://${uri}`,
        uri.replace(/^file:\/\//, ""),
      ];
      for (const t of tries) {
        try {
          const info = await FileSystem.getInfoAsync(t);
          if (info.exists) return { exists: true, uri: t, info };
        } catch (e) {}
      }
      return { exists: false };
    } catch (e) {
      return { exists: false };
    }
  };

  // progressive initial generation (first 5 then rest)
  useEffect(() => {
    if (status !== "ready" || !processedUri || !contextInitialized) return;

    const initialFilters = Object.keys(FILTERS).slice(0, 5);
    generatePreviewImages({
      imageUri: processedUri,
      filters: FILTERS,
      dimensions: { width: PREVIEW_SIZE, height: PREVIEW_SIZE },
      visibleFilters: initialFilters,
      onPreviewGenerated: (name, uri) => {
        // validate & update single preview quickly
        statUri(uri).then((s) => {
          if (s.exists) setPreviewUris((p) => ({ ...p, [name]: s.uri }));
          else console.warn("Initial preview invalid for", name, uri);
        });
      },
    }).catch((e) => console.error("Failed initial previews:", e));
  }, [status, processedUri, contextInitialized, generatePreviewImages]);

  // generate rest progressively (missing)
  useEffect(() => {
    if (status !== "ready" || !processedUri || !contextInitialized) return;

    const missingFilters = Object.keys(FILTERS).filter((f) => !previewUris[f]);
    if (missingFilters.length === 0) return;

    generatePreviewImages({
      imageUri: processedUri,
      filters: FILTERS,
      dimensions: { width: PREVIEW_SIZE, height: PREVIEW_SIZE },
      visibleFilters: missingFilters,
      onPreviewGenerated: (name, uri) => {
        statUri(uri).then((s) => {
          if (s.exists) setPreviewUris((p) => ({ ...p, [name]: s.uri }));
          else console.warn("Missing preview invalid for", name, uri);
        });
      },
    }).catch((e) => console.error("Failed missing previews:", e));
  }, [
    status,
    processedUri,
    contextInitialized,
    previewUris,
    generatePreviewImages,
  ]);

  // on-viewable changed triggers generation for visible items only
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (status !== "ready" || !processedUri || !contextInitialized) return;

    const visibleFilters = viewableItems
      .map((it) => it.item.name)
      .filter((n) => !previewUris[n]);
    if (visibleFilters.length === 0) return;

    generatePreviewImages({
      imageUri: processedUri,
      filters: FILTERS,
      dimensions: { width: PREVIEW_SIZE, height: PREVIEW_SIZE },
      visibleFilters,
      onPreviewGenerated: (name, uri) => {
        statUri(uri).then((s) => {
          if (s.exists) setPreviewUris((p) => ({ ...p, [name]: s.uri }));
        });
      },
    }).catch((e) => console.error("Failed viewable previews:", e));
  }).current;

  const filterData = useMemo(() => {
    return Object.entries(FILTERS).map(([name, shader], index) => ({
      id: `${index}`,
      name,
      shader,
      previewUri: previewUris[name] || null,
    }));
  }, [previewUris]);

  const renderFilterItem = ({ item }) => (
    <FilterButton
      filterName={item.name}
      previewUri={item.previewUri}
      imageUri={imageUri}
      onFilterSelect={onFilterSelect}
      selectedFilter={selectedFilter}
    />
  );

  return (
    <View style={{ paddingHorizontal: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
        Filter Options
      </Text>
      <FlatList
        data={filterData}
        renderItem={renderFilterItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        snapToInterval={68}
        decelerationRate="fast"
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={5}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 80,
          minimumViewTime: 80,
        }}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      {status === "ready" && processedUri && (
        <GLView
          ref={previewGLRef}
          style={{
            position: "absolute",
            left: -PREVIEW_SIZE * 2,
            top: 0,
            width: PREVIEW_SIZE,
            height: PREVIEW_SIZE,
          }}
          onContextCreate={onPreviewContextCreate}
          msaaSamples={0}
        />
      )}
    </View>
  );
});

export default FilterBar;