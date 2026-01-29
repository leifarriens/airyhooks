import { useCallback, useState } from "react";

export interface UseCopyToClipboardResult {
  /** The currently copied text, or null if nothing has been copied */
  copiedText: null | string;
  /** Function to copy text to clipboard. Returns true if successful. */
  copy: (text: string) => Promise<boolean>;
  /** Function to reset the copied state */
  reset: () => void;
}

/**
 * Copy text to the clipboard using the modern Clipboard API.
 *
 * @returns Object containing copiedText state, copy function, and reset function
 *
 * @example
 * const { copiedText, copy, reset } = useCopyToClipboard();
 *
 * return (
 *   <button onClick={() => copy("Hello, World!")}>
 *     {copiedText ? "Copied!" : "Copy"}
 *   </button>
 * );
 */
export function useCopyToClipboard(): UseCopyToClipboardResult {
  const [copiedText, setCopiedText] = useState<null | string>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    // Check if we're in a browser environment with clipboard support
    const clipboard =
      typeof window !== "undefined" ? navigator.clipboard : undefined;

    if (!clipboard) {
      console.warn("Clipboard API not available");
      return false;
    }

    try {
      await clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn("Failed to copy to clipboard:", error);
      setCopiedText(null);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setCopiedText(null);
  }, []);

  return { copiedText, copy, reset };
}
