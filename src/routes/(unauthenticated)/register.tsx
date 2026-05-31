import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Description, FieldGroup, Label } from "@/components/ui/fieldset";
import { InputField, PasswordInputField } from "@/components/ui/input";
import { Strong, Text, TextLink, Title } from "@/components/ui/text";
import { Content } from "@/components/ui/view";
import { buildPasswordSchema } from "@/features/auth/password-schema";
import { authProvider } from "@/features/auth/provider";
import { getErrorMessage } from "@/libs/query/query-error";

function buildFormSchema() {
  return z
    .object({
      email: z.email(),
      password: buildPasswordSchema(),
      confirmPassword: z.string(),
    })
    .refine((v) => v.password === v.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
}

export const Route = createFileRoute("/(unauthenticated)/register")({
  component: RouteComponent,
  loader: () => ({ formSchema: buildFormSchema() }),
});

function RouteComponent() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}

function SignUpForm() {
  const { formSchema } = Route.useLoaderData();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();

  const onSubmitHandler = form.handleSubmit(async (data) => {
    const result = await authProvider
      .signUp({ email: data.email, password: data.password })
      .catch((error) => {
        form.setError("root", { message: getErrorMessage(error) });

        return null;
      });

    if (!result) {
      return;
    }

    if (result.kind === "done") {
      void navigate({ to: "/dashboard" });

      return;
    }

    void navigate({
      to: "/confirm-account",
      search: { email: result.username },
    });
  });

  const rootError = form.formState.errors.root?.message;

  return (
    <form
      className="grid w-full max-w-sm grid-cols-1 gap-8"
      onSubmit={onSubmitHandler}
    >
      <span className="bg-brand-primary inline rounded px-3 pt-3 pb-2.5">
        <img
          src="https://www.ingenuity.ph/wp-content/uploads/2024/02/ingenuity-logo-2020_-light.png"
          alt="Ingenuity"
          className="h-8"
        />
      </span>
      <Title>Sign up for an account</Title>
      {rootError !== undefined && (
        <Banner>
          <Content>
            <Label>Register Error</Label>
            <Description>{rootError}</Description>
          </Content>
        </Banner>
      )}
      <FieldGroup>
        <InputField
          control={form.control}
          field="email"
          label="Email Address"
        />
        <PasswordInputField
          label="Password"
          control={form.control}
          field="password"
        />
        <PasswordInputField
          label="Confirm Password"
          control={form.control}
          field="confirmPassword"
        />
      </FieldGroup>
      <Button
        type="submit"
        className="w-full"
        isPending={form.formState.isSubmitting}
      >
        Create Account
      </Button>
      <Text>
        Already have an account?{" "}
        <TextLink to="/login">
          <Strong>Sign In</Strong>
        </TextLink>
      </Text>
    </form>
  );
}
