import { useEffect, useState } from "react";

/**
 * Determine if the code is running on the client-side.
 * Useful for SSR-safe code that needs to access browser APIs.
 *
 * @returns true if running on client, false during SSR
 *
 * @example
 * const isClient = useIsClient();
 *
 * if (!isClient) {
 *   return <div>Loading...</div>;
 * }
 *
 * // Safe to use browser APIs
 * return <div>Window width: {window.innerWidth}</div>;
 *
 * @example
 * // Conditionally render client-only components
 * const isClient = useIsClient();
 *
 * return (
 *   <div>
 *     <Header />
 *     {isClient && <ClientOnlyMap />}
 *     <Footer />
 *   </div>
 * );
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
