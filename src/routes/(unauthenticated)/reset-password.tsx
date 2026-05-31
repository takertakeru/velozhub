import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import {
  Description,
  FieldControl,
  FieldGroup,
  Label,
} from "@/components/ui/fieldset";
import { InputField, PasswordInput } from "@/components/ui/input";
import { Stepper, useStep } from "@/components/ui/stepper";
import { Strong, Text, TextLink, Title } from "@/components/ui/text";
import { Content } from "@/components/ui/view";
import { buildPasswordSchema } from "@/features/auth/password-schema";
import { authProvider } from "@/features/auth/provider";
import { getErrorMessage } from "@/libs/query/query-error";

function buildChangePasswordSchema() {
  return z
    .object({
      code: z.string().min(1, "Required"),
      newPassword: buildPasswordSchema(),
      confirmNewPassword: z.string(),
    })
    .refine((v) => v.newPassword === v.confirmNewPassword, {
      message: "Passwords don't match",
      path: ["confirmNewPassword"],
    });
}

export const Route = createFileRoute("/(unauthenticated)/reset-password")({
  component: RouteComponent,
  loader: () => ({ changePasswordSchema: buildChangePasswordSchema() }),
});

function RouteComponent() {
  const [email, setEmail] = useState("");

  return (
    <AuthLayout>
      <Stepper>
        <ResetPasswordForm onSent={setEmail} />
        <ChangePasswordForm email={email} />
      </Stepper>
    </AuthLayout>
  );
}

function ResetPasswordForm({ onSent }: { onSent: (email: string) => void }) {
  const step = useStep();
  const form = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(z.object({ email: z.email() })),
  });

  const onSubmitHandler = form.handleSubmit(async (data) => {
    try {
      await authProvider.resetPassword(data.email);
      onSent(data.email);
      step.nextStep();
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  });
  const rootError = form.formState.errors.root?.message;

  return (
    <form
      className="grid w-full max-w-sm grid-cols-1 gap-8"
      onSubmit={onSubmitHandler}
    >
      {rootError !== undefined && (
        <Banner>
          <Content>
            <Label>Reset Password Error</Label>
            <Description>{rootError}</Description>
          </Content>
        </Banner>
      )}

      <div>
        <Title>Reset Password</Title>
        <Description>
          Enter your email address and we&apos;ll send you a code to reset your
          password.
        </Description>
      </div>
      <InputField
        type="email"
        control={form.control}
        field="email"
        label="Email"
        name="email"
      />
      <Button
        type="submit"
        className="w-full"
        isPending={form.formState.isSubmitting}
      >
        Send Code
      </Button>
      <Text className="text-center">
        Return to{" "}
        <TextLink to="/login">
          <Strong>Login</Strong>
        </TextLink>
      </Text>
    </form>
  );
}

function ChangePasswordForm({ email }: { email: string }) {
  const { changePasswordSchema } = Route.useLoaderData();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: { code: "", newPassword: "", confirmNewPassword: "" },
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmitHandler = form.handleSubmit(async (data) => {
    try {
      await authProvider.confirmResetPassword({
        username: email,
        code: data.code,
        newPassword: data.newPassword,
      });
      void navigate({ to: "/login" });
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  });

  const rootError = form.formState.errors.root?.message;

  return (
    <form
      className="grid w-full max-w-sm grid-cols-1 gap-8"
      onSubmit={onSubmitHandler}
    >
      <Title>Update your password</Title>
      {rootError !== undefined && (
        <Banner>
          <Content>
            <Label>Reset Password Error</Label>
            <Description>{rootError}</Description>
          </Content>
        </Banner>
      )}
      <FieldGroup>
        <InputField
          control={form.control}
          field="code"
          label="Verification Code"
        />
        <FieldControl control={form.control} field="newPassword">
          <Label>New Password</Label>
          <PasswordInput />
        </FieldControl>
        <FieldControl control={form.control} field="confirmNewPassword">
          <Label>Confirm New Password</Label>
          <PasswordInput />
        </FieldControl>
      </FieldGroup>
      <Button
        type="submit"
        className="w-full"
        isPending={form.formState.isSubmitting}
      >
        Update Password
      </Button>
    </form>
  );
}
