import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/cms/auth/session";
import { LoginForm } from "./form";

export const metadata = { title: "Admin Sign In" };

export default async function AdminLoginPage() {
  if (await getCurrentUser()) redirect("/admin");

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream-50 px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="headline-serif text-2xl font-medium text-navy-800">MVC Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage site content.</p>
        <LoginForm />
      </div>
    </div>
  );
}
