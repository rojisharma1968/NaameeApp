import { useCallback } from "react";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native";

export const useAutoScrollToTop = (ref) => {
  useScrollToTop(ref);

  useFocusEffect(
    useCallback(() => {
      if (ref.current?.scrollToOffset) {
        ref.current.scrollToOffset({ offset: 0, animated: false });
      } else if (ref.current?.scrollTo) {
        ref.current.scrollTo({ y: 0, animated: false });
      }
    }, [])
  );
};
