"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/ui/form";
import { Input } from "~/ui/input";
import { IconLoader2 } from "@tabler/icons-react";

const validationSchema = z.object({
  email: z.string().trim().toLowerCase().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormValues = z.infer<typeof validationSchema>;

export const SignUpForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) =>
    await fetch("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(values),
    });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <h1 className="text-4xl">Sign up</h1>
      <Form {...form}>
        <form
          className="flex w-full max-w-sm flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <IconLoader2 className="mr-2 animate-spin" aria-hidden="true" />
            ) : null}
            Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
};
