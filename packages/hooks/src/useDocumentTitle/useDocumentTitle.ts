import { useEffect, useRef } from "react";

interface DocumentTitleEntry {
  restoreOnUnmount: boolean;
  title: string;
}

interface DocumentTitleState {
  entries: DocumentTitleEntry[];
  previousTitle: string;
}

const documentTitleStates = new WeakMap<Document, DocumentTitleState>();

/**
 * Dynamically update the document title.
 *
 * @param title - The title to set for the document
 * @param restoreOnUnmount - Whether to restore the previous title on unmount (default: true)
 *
 * @example
 * // Basic usage
 * useDocumentTitle('Home | My App');
 *
 * @example
 * // Dynamic title based on state
 * useDocumentTitle(`${unreadCount} new messages`);
 *
 * @example
 * // Don't restore title on unmount
 * useDocumentTitle('Dashboard', false);
 */
export function useDocumentTitle(title: string, restoreOnUnmount = true): void {
  const entryRef = useRef<DocumentTitleEntry | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    let state = documentTitleStates.get(document);
    if (!state) {
      state = { entries: [], previousTitle: document.title };
      documentTitleStates.set(document, state);
    }

    const entry = entryRef.current ?? { restoreOnUnmount, title };
    entry.title = title;
    entry.restoreOnUnmount = restoreOnUnmount;
    entryRef.current = entry;

    const currentIndex = state.entries.indexOf(entry);
    if (currentIndex !== -1) {
      state.entries.splice(currentIndex, 1);
    }
    state.entries.push(entry);
    document.title = title;
  }, [title, restoreOnUnmount]);

  useEffect(() => {
    return () => {
      if (typeof document === "undefined") {
        return;
      }

      const entry = entryRef.current;
      const state = documentTitleStates.get(document);
      if (!entry || !state) {
        return;
      }

      const index = state.entries.indexOf(entry);
      if (index === -1) {
        return;
      }

      if (!entry.restoreOnUnmount) {
        state.previousTitle = entry.title;
      }
      state.entries.splice(index, 1);

      const activeEntry = state.entries.at(-1);
      document.title = activeEntry?.title ?? state.previousTitle;

      if (state.entries.length === 0) {
        documentTitleStates.delete(document);
      }
    };
  }, []);
}
