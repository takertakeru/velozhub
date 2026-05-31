import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isRESTAPIError } from "./query-error";

function retry(failureCount: number, error: Error) {
  /*
    Don't retry if the error is a 4xx error — if a resource wasn't found,
    or the user doesn't have permission to access some resource, we should
    resolve the query immediately and show an error or empty state.
  */
  if (isRESTAPIError(error) && error.status >= 400 && error.status < 500) {
    return false;
  }

  /*
      For all non-4xx errors, retry up to 3 times. This is useful for POSTs which
      we want to retry in case of a network error or API hiccup.
    */
  return failureCount < 3;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry,
      networkMode: "online",
    },
    mutations: {
      networkMode: "online",
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
