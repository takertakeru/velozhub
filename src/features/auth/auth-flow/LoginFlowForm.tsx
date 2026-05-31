import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { InputField, PasswordInputField } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Text, TextLink, Title } from "@/components/ui/text";
import { authProvider } from "@/features/auth/provider";
import { getErrorMessage } from "@/libs/query/query-error";
import { MutationErrorBanner } from "@/libs/query/query-resolver";

const schema = z.object({
  username: z.string().min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
});

export function LoginFlowForm() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmitHandler = form.handleSubmit(async (data) => {
    const result = await authProvider
      .signIn({ username: data.username, password: data.password })
      .catch((error) => {
        form.setError("root", { message: getErrorMessage(error) });

      return null;
      });

    if (!result) {
      return;
    }

    if (result.kind === "confirmSignUp") {
      await authProvider.resendSignUpCode(result.username);
      void navigate({
        to: "/confirm-account",
        search: { email: result.username },
      });

      return;
    }

    void navigate({ to: "/dashboard" });
  });

  const rootError = form.formState.errors.root?.message;
  const isLoading = form.formState.isSubmitting;

  return (
    <AuthLayout>
      <form
        className="grid w-full max-w-sm grid-cols-1 gap-8"
        onSubmit={onSubmitHandler}
      >
        <span className="bg-brand-primary inline rounded p-4">
          <img
            src="https://www.ingenuity.ph/wp-content/uploads/2024/02/ingenuity-logo-2020_-light.png"
            alt="Ingenuity"
            className="h-5"
          />
        </span>
        <Title>Sign in to your account</Title>
        <MutationErrorBanner errorMessage={rootError} label="Login Error" />
        <InputField
          control={form.control}
          field="username"
          label="Email Address"
        />
        <PasswordInputField
          control={form.control}
          field="password"
          label="Password"
        />
        <div className="flex items-center justify-between">
          <TextLink
            to="/reset-password"
            className="ml-auto font-medium hover:text-neutral-700 hover:underline"
          >
            Forgot password?
          </TextLink>
        </div>
        <Button type="submit" className="w-full" isPending={isLoading}>
          Login
        </Button>
        <Text>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium hover:text-neutral-700">
            Sign Up
          </Link>
        </Text>
      </form>
    </AuthLayout>
  );
}
