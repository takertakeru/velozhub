/* eslint-disable @typescript-eslint/naming-convention */
import { createContext, useContext } from "react";
import {
  Cell as AriaCell,
  type CellProps as AriaCellProps,
  Collection,
  Column as AriaColumn,
  type ColumnProps as AriaColumnProps,
  composeRenderProps,
  Row as AriaRow,
  type RowProps as AriaRowProps,
  Table as AriaTable,
  TableBody as AriaTableBody,
  type TableBodyProps as AriaTableBodyProps,
  TableHeader as AriaTableHeader,
  type TableHeaderProps as AriaTableHeaderProps,
  type TableProps as AriaTableProps,
  useTableOptions,
} from "react-aria-components";
import { ArrowDownIcon, ArrowUpIcon } from "@phosphor-icons/react";
import { createLink } from "@tanstack/react-router";
import { Checkbox } from "./checkbox";
import { cn, createStyles, EnhancerGroup } from "./utils";

const TableContext = createContext<{
  bleed: boolean;
  dense: boolean;
  grid: boolean;
  striped: boolean;
}>({
  bleed: false,
  dense: false,
  grid: false,
  striped: false,
});

export function Table({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  className,
  children,
  ...props
}: {
  bleed?: boolean;
  dense?: boolean;
  grid?: boolean;
  striped?: boolean;
} & AriaTableProps) {
  return (
    <TableContext.Provider
      value={
        { bleed, dense, grid, striped } as React.ContextType<
          typeof TableContext
        >
      }
    >
      <div className="flow-root">
        <div
          className={cn(
            className,
            // overflow-x-auto
            "-mx-(--gutter) whitespace-nowrap",
          )}
        >
          <div
            className={cn(
              "inline-block min-w-full align-middle",
              !bleed && "sm:px-(--gutter)",
            )}
          >
            <AriaTable
              {...props}
              className="min-w-full text-left text-sm/6 text-neutral-950"
            >
              {children}
            </AriaTable>
          </div>
        </div>
      </div>
    </TableContext.Provider>
  );
}

export function TableBody<T extends object>(props: AriaTableBodyProps<T>) {
  return <AriaTableBody {...props} />;
}

export function TableColumn({
  children,
  className,
  ...props
}: AriaColumnProps) {
  const { bleed, grid } = useContext(TableContext);

  return (
    <AriaColumn
      {...props}
      className={composeRenderProps(className, (v) => {
        return cn([
          v,
          //
          "border-b border-b-neutral-950/10 px-4 py-2 font-medium first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",
          //
          grid && "border-l border-l-neutral-950/5 first:border-l-0",
          //
          !bleed && "sm:first:pl-1 sm:last:pr-1",
        ]);
      })}
    >
      {(renderProps) => {
        return (
          <EnhancerGroup className="items-center">
            {typeof children === "function" ? children(renderProps) : children}
            {renderProps.allowsSorting ? (
              <span aria-hidden="true" className="*:data-[slot=icon]:size-4">
                {renderProps.sortDirection === "ascending" ? (
                  <ArrowUpIcon weight="bold" />
                ) : (
                  <ArrowDownIcon weight="bold" />
                )}
              </span>
            ) : null}
          </EnhancerGroup>
        );
      }}
    </AriaColumn>
  );
}

const TableRowContext = createContext<{
  target?: string;
  title?: string;
}>({
  target: undefined,
  title: undefined,
});

export const TableRowLink = createLink(AriaRow);
export function TableRow<T extends object>({
  href,
  routerOptions,
  target,
  title,
  className,
  children,
  ...props
}: {
  target?: string;
  title?: string;
} & AriaRowProps<T>) {
  const { striped } = useContext(TableContext);
  const options = useTableOptions();

  return (
    <TableRowContext.Provider
      value={
        { href, routerOptions, target, title } as React.ContextType<
          typeof TableRowContext
        >
      }
    >
      <AriaRow
        {...props}
        className={cn(
          className,
          "group/row",
          //
          "data-href:focus:outline-2 data-href:focus:-outline-offset-2 data-href:focus:outline-blue-500",
          //
          striped && "even:bg-neutral-950/[2.5%]",
          //
          striped && "hover:bg-neutral-950/5",
          //
          !striped &&
            "data-href:hover:bg-neutral-950/[2.5%] data-selection-mode:hover:bg-neutral-950/[2.5%]",
        )}
      >
        <>
          {options.selectionBehavior === "toggle" && (
            <TableCell>
              <Checkbox slot="selection" />
            </TableCell>
          )}
          {children}
        </>
      </AriaRow>
    </TableRowContext.Provider>
  );
}

export function TableHeader<T extends object>({
  className,
  children,
  columns,
  ...props
}: AriaTableHeaderProps<T>) {
  const options = useTableOptions();

  return (
    <AriaTableHeader
      {...props}
      className={cn(
        className,
        //
        "text-zinc-500 dark:text-zinc-400",
      )}
    >
      {options.selectionBehavior === "toggle" && (
        <TableColumn
          className={cn([
            // !bleed && "max-w-4 sm:first:pl-1 sm:last:pr-1"
          ])}
        >
          <Checkbox slot="selection" />
        </TableColumn>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  );
}

const cellStyles = createStyles({
  base: "group/cell relative px-4 first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",
  variants: {
    dense: {
      true: "py-2.5",
      false: "py-4",
    },
    bleed: {
      true: "",
      false: "sm:first:pl-1 sm:last:pr-1",
    },
    grid: {
      true: "border-l border-l-neutral-950/5 first:border-l-0",
      false: "",
    },
    striped: {
      true: "",
      false: "border-b border-neutral-950/5",
    },
  },
});

export function TableCell({ className, ...props }: AriaCellProps) {
  const { bleed, dense, grid, striped } = useContext(TableContext);
  const styles = cellStyles({ bleed, grid, striped, dense });

  return (
    <AriaCell
      {...props}
      className={composeRenderProps(className, (value) => cn(styles, value))}
    />
  );
}
