import { useEffect, useState } from "react";

interface WindowSize {
  height: number | undefined;
  width: number | undefined;
}

/**
 * Tracks window dimensions.
 *
 * @returns Object with width and height of the window
 *
 * @example
 * const { width, height } = useWindowSize();
 *
 * return (
 *   <div>
 *     Window size: {width}x{height}
 *   </div>
 * );
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    height: undefined,
    width: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    // Call once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
