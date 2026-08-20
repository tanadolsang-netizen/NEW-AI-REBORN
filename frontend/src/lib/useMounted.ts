"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * True only once hydrated on the client. Uses useSyncExternalStore (not
 * useState+useEffect) so there is no setState-in-effect, and React's own
 * hydration handling keeps the server/client first paint in sync.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
