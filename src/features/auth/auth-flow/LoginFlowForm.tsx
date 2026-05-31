import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { PasswordInputField } from "@/components/ui/input";
import { Option, SelectField } from "@/components/ui/select";
import { Text, Title } from "@/components/ui/text";
import { authProvider } from "@/features/auth/provider";
import { getErrorMessage } from "@/libs/query/query-error";
import { MutationErrorBanner } from "@/libs/query/query-resolver";

// Name to email mapping. These must match the emails you created in Supabase.
const drivers = [
  { name: "Siekie", email: "siekie@gmail.com" },
  { name: "Joahn", email: "internationaljcb@gmail.com" },
  { name: "Takeru", email: "takertakeru@gmail.com" },
  { name: "Khyle", email: "sabrinakhyle@gmail.com" },
  { name: "Ian", email: "iankarl.epis123@gmail.com" },
];

const schema = z.object({
  name: z.string().min(1, "Please select your name."),
  password: z.string().min(1, "Password is required."),
});

type FormData = z.infer<typeof schema>;

export function LoginFlowForm() {
  const navigate = useNavigate();
  const form = useForm<FormData>({
    defaultValues: { name: "", password: "" },
    resolver: zodResolver(schema),
  });

  const onSubmitHandler = form.handleSubmit(async (data) => {
    const driver = drivers.find((d) => d.name === data.name);

    if (!driver) {return;}

    const result = await authProvider
      .signIn({ username: driver.email, password: data.password })
      .catch((error) => {
        form.setError("root", { message: getErrorMessage(error) });

        return null;
      });

    if (!result) {return;}
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
        <div>
          <Title size="lg">VelozHub</Title>
          <Text color="neutral" className="mt-2">
            Shared car booking for the household Toyota Veloz.
          </Text>
        </div>

        <MutationErrorBanner errorMessage={rootError} label="Login Error" />

        <SelectField
          control={form.control}
          field="name"
          label="Who are you?"
          placeholder="Select your name"
        >
          {drivers.map((driver) => {
            return (
              <Option key={driver.name} id={driver.name}>
                {driver.name}
              </Option>
            );
          })}
        </SelectField>

        <PasswordInputField
          control={form.control}
          field="password"
          label="Password"
        />

        <Button type="submit" className="w-full" isPending={isLoading}>
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}
