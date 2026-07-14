"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { createUser, UserExistsError } from "@/lib/users";
import { registerSchema } from "@/lib/validation";

export async function registerUser(_prevState: string | undefined, formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  try {
    await createUser(parsed.data);
  } catch (error) {
    if (error instanceof UserExistsError) {
      return error.message;
    }
    throw error;
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Account created. Please log in.";
    }
    throw error;
  }
}
