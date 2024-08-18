"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2 } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/ui/form";
import { Input } from "~/ui/input";

const validationSchema = z.object({
  email: z.string().trim().toLowerCase().email({
    message: "Invalid email address.",
  }),
});

type FormValues = z.infer<typeof validationSchema>;

export const ResendForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) =>
    await fetch("/api/auth/sign-up/resend", {
      method: "POST",
      body: JSON.stringify(values),
    });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <h1 className="text-4xl">Your email is not verified</h1>
      <p className="w-full max-w-sm">
        Oops! We cannot verify your email. Would you like us to re-send the
        verification email?
      </p>
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <IconLoader2 className="mr-2 animate-spin" aria-hidden="true" />
            ) : null}
            Resend
          </Button>
        </form>
      </Form>
    </div>
  );
};
