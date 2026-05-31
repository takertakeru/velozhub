/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/**
 * Https://github.com/desko27/react-call.
 */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@/components/ui/dialog";
import { Description } from "@/components/ui/fieldset";
import { SurfaceActions } from "@/components/ui/surface";
import { Title } from "@/components/ui/text";

export type PrivateResolve<Response> = (
  value: Response | PromiseLike<Response>,
) => void;

export type PrivateCallContext<Props, Response> = {
  key: string;
  props: Props;
  promise: Promise<Response>;
  resolve: PrivateResolve<Response>;
  end: (response: Response) => void;
  ended: boolean;
};
export type PrivateStackState<Props, Response> = Array<
  PrivateCallContext<Props, Response>
>;
export type PrivateStackStateSetter<Props, Response> = React.Dispatch<
  React.SetStateAction<PrivateStackState<Props, Response>>
>;

/**
 * The call() method.
 */
export type CallFunction<Props, Response> = (props: Props) => Promise<Response>;

/**
 * The special call prop in UserComponent.
 */
export type CallContext<Props, Response, RootProps> = Omit<
  PrivateCallContext<Props, Response>,
  "props"
> & { root: RootProps; index: number; stackSize: number };

/**
 * User props + the call prop.
 */
export type PropsWithCall<Props, Response, RootProps> = Props & {
  call: CallContext<Props, Response, RootProps>;
};

/**
 * What is passed to createCallable.
 */
export type UserComponentType<Props, Response, RootProps> =
  React.FunctionComponent<PropsWithCall<Props, Response, RootProps>>;

/**
 * What createCallable returns.
 */
export type Callable<Props, Response, RootProps> = {
  Root: React.FunctionComponent<RootProps>;
  call: CallFunction<Props, Response>;
  end: ((promise: Promise<Response>, response: Response) => void) &
    ((response: Response) => void);
  update: ((promise: Promise<Response>, props: Partial<Props>) => void) &
    ((props: Partial<Props>) => void);
};
export function createCallable<Props = void, Response = void, RootProps = {}>(
  UserComponent: UserComponentType<Props, Response, RootProps>,
  unmountingDelay = 0,
): Callable<Props, Response, RootProps> {
  let $setStack: PrivateStackStateSetter<Props, Response> | null = null;
  let $nextKey = 0;

  const createEnd = (promise: Promise<Response> | null) => {
    return (response: Response) => {
      if (!$setStack) {
        return;
      }
      const scopedSetStack = $setStack;

      scopedSetStack((prev) => {
        return prev.map((call) => {
          if (promise && call.promise !== promise) {
            return call;
          }
          call.resolve(response);

          return { ...call, ended: true };
        });
      });

      globalThis.setTimeout(() => {
        scopedSetStack((prev) =>
          prev.filter((c) => promise && c.promise !== promise),
        );
      }, unmountingDelay);
    };
  };

  return {
    call: (props) => {
      if (!$setStack) {
        throw new Error("No <Root> found!");
      }

      const key = String($nextKey++);
      let resolve: PrivateResolve<Response>;
      const promise = new Promise<Response>((res) => {
        resolve = res;
      });

      $setStack((prev) => {
        return [
          ...prev,
          {
            key,
            props,
            promise,
            resolve,
            end: createEnd(promise),
            ended: false,
          },
        ];
      });

      return promise;
    },
    end: (...args: [Promise<Response>, Response] | [Response]) => {
      const targeted = args.length === 2;

      createEnd(targeted ? args[0] : null)(targeted ? args[1] : args[0]);
    },
    update: (
      ...args: [Promise<Response>, Partial<Props>] | [Partial<Props>]
    ) => {
      if (!$setStack) {
        return;
      }
      const scopedSetStack = $setStack;
      const targeted = args.length === 2;

      scopedSetStack((prev) => {
        return prev.map((call) => {
          return targeted && call.promise !== args[0]
            ? call
            : {
                ...call,
                props: { ...call.props, ...(targeted ? args[1] : args[0]) },
              };
        });
      });
    },
    Root: (rootProps: RootProps) => {
      const [stack, setStack] = useState<PrivateStackState<Props, Response>>(
        [],
      );

      useEffect(() => {
        if ($setStack) {
          throw new Error("Multiple instances of <Root> found!");
        }
        $setStack = setStack;

        return () => {
          $setStack = null;
          $nextKey = 0;
        };
      }, []);

      return stack.map(({ props, ...call }, index) => {
        return (
          <UserComponent
            {...props}
            key={call.key}
            call={{
              ...call,
              root: rootProps,
              index,
              stackSize: stack.length,
            }}
          />
        );
      });
    },
  };
}

export const AreyouSure = createCallable<
  { description: string; confirmText: string },
  boolean
>(({ description, confirmText, call }) => {
  return (
    <AlertDialog defaultOpen>
      <Title>Confirm Action</Title>
      <Description>{description}</Description>
      <SurfaceActions>
        <Button
          variant="plain"
          slot="close"
          onPress={() => {
            call.end(false);
          }}
        >
          Cancel
        </Button>
        <Button
          color="danger"
          onPress={() => {
            call.end(true);
          }}
        >
          {confirmText}
        </Button>
      </SurfaceActions>
    </AlertDialog>
  );
});
