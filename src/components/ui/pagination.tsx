import {
  createContext,
  type FC,
  type ForwardedRef,
  forwardRef,
  useContext,
} from "react";
import { useId } from "react-aria";
import {
  ButtonContext,
  Collection,
  CollectionBuilder,
  CollectionRendererContext,
  type ContextValue,
  createLeafComponent,
  DEFAULT_SLOT,
  Provider,
  useContextProps,
  useSlottedContext,
} from "react-aria-components";
import { match, P } from "ts-pattern";
import { CollectionNode } from "@react-aria/collections";
import { Link } from "@tanstack/react-router";
import * as pagination from "@zag-js/pagination";
import { normalizeProps, useMachine } from "@zag-js/react";
import { DEFAULT_PAGE_SIZE } from "@/libs/api/constants";
import { composeButtonStyles } from "./button";
import { Text } from "./text";
import { cn } from "./utils";

type OwnProps = Pick<
  pagination.Props,
  | "count"
  | "defaultPage"
  | "defaultPageSize"
  | "page"
  | "pageSize"
  | "onPageChange"
>;

type PaginationProps = Omit<
  React.ComponentPropsWithoutRef<"nav">,
  keyof OwnProps
> &
  OwnProps;
export const PaginationContext = createContext<
  ContextValue<PaginationProps, HTMLDivElement>
>({});

const PaginationApiContext =
  createContext<ContextValue<pagination.Api, HTMLElement>>(null);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const usePagination = () => useSlottedContext(PaginationApiContext)!;

export const Pagination = forwardRef(function Pagination(
  {
    "aria-label": ariaLabel = "Page navigation",
    className,
    defaultPage,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    pageSize,
    page,
    count,
    onPageChange,
    ...props
  }: PaginationProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  // eslint-disable-next-line no-param-reassign
  [props, ref] = useContextProps(props, ref, PaginationContext);
  const service = useMachine(pagination.machine, {
    id: useId(),
    count,
    defaultPageSize,
    defaultPage,
    page,
    pageSize,
    onPageChange,
    /**
     * TODO: Figure out if we expose this.
     */
    siblingCount: 3,
  });

  const api = pagination.connect(service, normalizeProps);

  return (
    <Provider
      values={[
        [PaginationApiContext, api],
        [
          ButtonContext,
          {
            slots: {
              [DEFAULT_SLOT]: {},
              "previous-page": {
                ...api.getPrevTriggerProps(),
                onClick: undefined,
                onBlur: undefined,
                onFocus: undefined,
                value: undefined,
                formAction: undefined,
                // @ts-expect-error
                isDisabled: api.getPrevTriggerProps().disabled,
                onPress(e) {
                  /**
                   * Based from the source code the `currentTarget` is the only thing needed to make this work
                   * we just faked it to be able to adapt zagjs + RAC.
                   */
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  api.getPrevTriggerProps().onClick(e.target);
                },
              },
              "next-page": {
                ...api.getNextTriggerProps(),
                onClick: undefined,
                onBlur: undefined,
                onFocus: undefined,
                value: undefined,
                formAction: undefined,
                // @ts-expect-error
                isDisabled: api.getNextTriggerProps().disabled,
                onPress(e) {
                  /**
                   * Based from the source code the `currentTarget` is the only thing needed to make this work
                   * we just faked it to be able to adapt zagjs + RAC.
                   */
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  api.getNextTriggerProps().onClick(e.target);
                },
              },
            },
          },
        ],
      ]}
    >
      <nav
        ref={ref}
        aria-label={ariaLabel}
        {...props}
        className={cn(className, "flex gap-x-2")}
      />
    </Provider>
  );
});

// eslint-disable-next-line no-restricted-syntax/noClasses
class PaginationNode extends CollectionNode<unknown> {
  static readonly type = "item";
}
type PaginationPageRendererProps = {
  /**
   * The main type is plucked from zag. We need a way to
   * sync this they might update the API.
   */
  page:
    | {
        type: "ellipsis";
        id: string;
        index: number;
      }
    | {
        type: "page";
        value: number;
        id: string;
        index: number;
      };
};

export const PaginationPage = createLeafComponent(
  PaginationNode,
  function PaginationPage(
    { page }: PaginationPageRendererProps,
    ref: ForwardedRef<HTMLLIElement>,
  ) {
    const api = usePagination();
    const styles = composeButtonStyles("outline", {});

    return (
      <li ref={ref} className="flex shrink-0">
        {match({
          type: page.type,
          value: page.type === "page" ? page.value : null,
        })
          .with({ type: "page", value: P.not(null) }, ({ value }) => {
            return (
              <Link
                {...api.getItemProps(page as pagination.ItemProps)}
                className={cn(styles, "min-w-[2.25rem]")}
                to="."
              >
                {value}
              </Link>
            );
          })
          .with({ type: "ellipsis" }, () => {
            return (
              <Text
                elementType="span"
                {...api.getEllipsisProps({ index: page.index })}
              >
                ...
              </Text>
            );
          })
          .otherwise(() => null)}
      </li>
    );
  },
);

export function PaginationPages({
  renderPage: PageRenderer = PaginationPage,
}: {
  renderPage?: FC<PaginationPageRendererProps>;
}) {
  const api = usePagination();
  const { CollectionRoot } = useContext(CollectionRendererContext);

  return (
    <CollectionBuilder
      content={
        <Collection
          items={api.pages.map((v, i) => {
            return v.type === "ellipsis"
              ? ({
                  ...v,
                  id: `ellipsis-${i}`,
                  index: i,
                } satisfies PaginationPageRendererProps["page"])
              : ({
                  ...v,
                  id: `${v.value}`,
                  index: i,
                } satisfies PaginationPageRendererProps["page"]);
          })}
        >
          {(item) => <PageRenderer page={item} />}
        </Collection>
      }
    >
      {(collection) => {
        return (
          <ol className={cn("flex items-baseline gap-x-2")}>
            <CollectionRoot collection={collection} />
          </ol>
        );
      }}
    </CollectionBuilder>
  );
}

export function PaginationGap({
  className,
  children = <>&hellip;</>,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={cn(
        className,
        "w-[2.25rem] text-center text-sm/6 font-semibold text-neutral-950 select-none dark:text-white",
      )}
    >
      {children}
    </span>
  );
}
