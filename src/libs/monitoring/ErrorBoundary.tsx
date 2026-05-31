import { SealWarningIcon } from "@phosphor-icons/react";
import * as Sentry from "@sentry/react";
import { Banner } from "@/components/ui/banner";
import { Description, Label } from "@/components/ui/fieldset";
import { Code } from "@/components/ui/text";
import { Content } from "@/components/ui/view";
import { getErrorMessage } from "../query/query-error";

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary
      // eslint-disable-next-line react/no-unstable-nested-components
      fallback={({ error }) => {
        return (
          <Banner>
            <SealWarningIcon />
            <Content>
              <Label>Couldn&apos;t load the details</Label>
              <Description>
                We&apos;re experiencing difficulties retrieving this
                information. Please try again shortly.
                <Code>{getErrorMessage(error)}</Code>
              </Description>
            </Content>
          </Banner>
        );
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
