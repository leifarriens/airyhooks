import { useEffect, useState } from "react";

/**
 * Detects if a specific keyboard key is currently pressed.
 *
 * @param targetKey - The key to detect (e.g., "Enter", "ArrowUp", " " for space)
 * @returns Whether the key is currently pressed
 *
 * @example
 * const isEnterPressed = useKeyPress("Enter");
 * const isArrowUpPressed = useKeyPress("ArrowUp");
 *
 * return (
 *   <div>
 *     <p>Enter pressed: {isEnterPressed ? "Yes" : "No"}</p>
 *     <p>Arrow Up pressed: {isArrowUpPressed ? "Yes" : "No"}</p>
 *   </div>
 * );
 */
export function useKeyPress(targetKey: string): boolean {
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setIsKeyPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setIsKeyPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [targetKey]);

  return isKeyPressed;
}
