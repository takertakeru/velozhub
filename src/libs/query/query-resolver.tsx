import { useEffect, useRef } from "react";
import type { MutationHookResult, QueryHookResult } from "react-query-kit";
import { InfoIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/fieldset";
import { ProgressCircle } from "@/components/ui/progress";
import { Code, Text } from "@/components/ui/text";
import { EnhancerGroup } from "@/components/ui/utils";
import { Content } from "@/components/ui/view";
import { getErrorMessage } from "./query-error";

function DefaultLoadingElement() {
  return (
    <div className="relative">
      <ProgressCircle />
    </div>
  );
}

type ResolveStrategy = "default" | "stale-while-revalidate";
// eslint-disable-next-line @typescript-eslint/naming-convention
const STRATEGY_CONDITIONS: Record<
  ResolveStrategy,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  <Query extends QueryHookResult<unknown, unknown>>(q: Query) => boolean
> = {
  default: (q) => !q.isFetching,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "stale-while-revalidate": () => true,
};

export function QueryResolver<
  TData,
  TError,
  T extends QueryHookResult<TData, TError>,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  TQueryData = NonNullable<T["data"]>,
>({
  children,
  strategy = "default",
  query,
  onRefetch: onRefetchHandler = query.refetch,
  loadingElement = <DefaultLoadingElement />,
  errorElement = null,
  uninitializedElement = null,
}: {
  query: T;
  strategy?: ResolveStrategy;
  children: ((d: TQueryData) => React.ReactNode) | React.ReactNode;
  onRefetch?: () => void;
  loadingElement?: React.ReactNode;
  errorElement?: ((error: TError) => React.ReactNode) | React.ReactNode;
  uninitializedElement?: React.ReactNode;
}) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const resolveCondition = STRATEGY_CONDITIONS[strategy](query);

  if (query.isPaused) {
    return <>{uninitializedElement}</>;
  }

  if (query.isError) {
    if (errorElement !== null) {
      return (
        <>
          {typeof errorElement === "function"
            ? errorElement(query.error)
            : errorElement}
        </>
      );
    }

    return (
      <div className="flex items-center justify-center px-4 py-16">
        <div>
          <Label>Error</Label>
          <Text>Failed to load data. Try again.</Text>
          <Text size="xs">
            <Code>ERR:{getErrorMessage(query.error)}</Code>
          </Text>
          <div className="mt-2">
            <Button color="neutral" onPress={onRefetchHandler}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /**
   *
   * In the future we can consolidate this behavior to a prop to
   * choose if we want to show the cached data while fetching a new one
   * or show the loading element when the query is fetching.
   */
  if (query.isSuccess && resolveCondition && query.data !== undefined) {
    return (
      <>
        {typeof children === "function"
          ? children(query.data as TQueryData)
          : children}
      </>
    );
  }

  return <>{loadingElement}</>;
}

/**
 * Helper component to handle mutation states. And provide a way to
 * easily handle displaying a mutation return `data` value.
 */
export function MutationResolver<TData, TError, TVariables>({
  children,
  mutation,
  // onRefetch: onRefetchHandler = query.refetch,
  loadingElement = <DefaultLoadingElement />,
  errorElement = null,
  uninitializedElement = null,
}: {
  mutation: MutationHookResult<TData, TError, TVariables>;
  children:
    | ((
        d: MutationHookResult<TData, TError, TVariables>["data"],
      ) => React.ReactNode)
    | React.ReactNode;
  loadingElement?: React.ReactNode;
  errorElement?: ((error: TError) => React.ReactNode) | React.ReactNode;
  uninitializedElement?: React.ReactNode;
}) {
  if (mutation.isIdle) {
    return <>{uninitializedElement}</>;
  }

  if (mutation.isError) {
    if (errorElement !== null) {
      return typeof errorElement === "function"
        ? errorElement(mutation.error)
        : errorElement;
    }

    return (
      <div className="flex items-center justify-center px-4 py-16">
        <div>
          <Label size="md">Error</Label>
          <Text>Failed to load data. Try again.</Text>
        </div>
      </div>
    );
  }

  /**
   *
   * In the future we can consolidate this behavior to a prop to
   * choose if we want to show the cached data while fetching a new one
   * or show the loading element when the query is fetching.
   */
  if (mutation.isSuccess && mutation.data !== undefined) {
    return (
      <>
        {typeof children === "function"
          ? children(
              mutation.data as MutationHookResult<
                TData,
                TError,
                TVariables
              >["data"],
            )
          : children}
      </>
    );
  }

  return <>{loadingElement}</>;
}

export function QueryErrorBanner<TData, TError>({
  query,
}: {
  query: QueryHookResult<TData, TError>;
}) {
  return (
    <QueryResolver
      query={query}
      loadingElement={null}
      errorElement={
        <EnhancerGroup className="border-danger-700 bg-brand-danger-subtle w-full rounded-[var(--surface-radius)] border p-2">
          <InfoIcon weight="fill" className="text-brand-danger-text" />
        </EnhancerGroup>
      }
    >
      {() => null}
    </QueryResolver>
  );
}

export function MutationErrorBanner({
  errorMessage,
  label,
}: {
  errorMessage?: React.ReactNode;
  label: string;
}) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorMessage && bannerRef.current) {
      bannerRef.current.focus();
    }
  }, [errorMessage]);

  if (!errorMessage) {
    return null;
  }

  return (
    <div ref={bannerRef} className="contents">
      <Banner color="danger">
        <span data-slot="icon">
          <WarningCircleIcon className="size-[1lh]" />
        </span>
        <Content>
          <Label color="unset" className="font-medium">
            {label}
          </Label>
          <Text color="inherit" className="text-brand-danger-bold">
            {errorMessage}
          </Text>
        </Content>
      </Banner>
    </div>
  );
}
