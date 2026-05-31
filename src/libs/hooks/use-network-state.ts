import { useRef, useSyncExternalStore } from "react";

/**
 * Shallow equality check.
 */
function shallowEqual<T extends object>(objA: T, objB: T): boolean {
  const keys1 = Object.keys(objA);
  const keys2 = Object.keys(objB);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
}

interface NetworkState {
  online: boolean;
  downlink: number | null;
  downlinkMax: number | null;
  effectiveType: string | null;
  rtt: number | null;
  saveData: boolean | null;
  type: string | null;
}

/**
 * Helper function to safely get the network connection object.
 */
function getConnection(): NetworkInformation | null {
  if (typeof navigator === "undefined") {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = navigator as any;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return nav.connection || nav.mozConnection || nav.webkitConnection || null;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const networkSubscription = (callback) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  window.addEventListener("online", callback, { passive: true });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  window.addEventListener("offline", callback, { passive: true });

  const connection = getConnection();

  if (connection) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    connection.addEventListener("change", callback, { passive: true });
  }

  return () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    window.removeEventListener("online", callback);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    window.removeEventListener("offline", callback);

    if (connection) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      connection.removeEventListener("change", callback);
    }
  };
};

// Type for the Network Information API
interface NetworkInformation extends EventTarget {
  readonly downlink?: number;
  readonly downlinkMax?: number;
  readonly effectiveType?: string;
  readonly rtt?: number;
  readonly type?: string;
  readonly saveData?: boolean;
  onchange?: EventListener;
}

const getNetworkStateServerSnapshot = () => {
  throw new Error("useNetworkState is a client-only hook");
};

export function useNetworkState() {
  const cache = useRef({});

  const getSnapshot = () => {
    const isOnline = navigator.onLine;
    const connection = getConnection();

    const nextState = {
      online: isOnline,
      downlink: connection?.downlink,
      downlinkMax: connection?.downlinkMax,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type,
    };

    if (shallowEqual(cache.current, nextState)) {
      return cache.current;
    }
    cache.current = nextState;

    return nextState;
  };

  return useSyncExternalStore(
    networkSubscription,
    getSnapshot,
    getNetworkStateServerSnapshot,
  ) as NetworkState;
}
