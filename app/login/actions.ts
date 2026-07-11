"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function cleanRedirect(value: FormDataEntryValue | null) {
  const redirectTo = String(value || "/");
  return redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
}

function redirectWithMessage(path: string, message: string) {
  redirect(`/login?redirectTo=${encodeURIComponent(path)}&message=${encodeURIComponent(message)}`);
}

export async function signIn(formData: FormData) {
  const redirectTo = cleanRedirect(formData.get("redirectTo"));
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithMessage(redirectTo, error.message);
  }

  redirect(redirectTo);
}

export async function signUp(formData: FormData) {
  const redirectTo = cleanRedirect(formData.get("redirectTo"));
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirectWithMessage(redirectTo, error.message);
  }

  if (!data.session) {
    redirectWithMessage(redirectTo, "Account created. Check your email to confirm it, then log in.");
  }

  redirect(redirectTo);
}
