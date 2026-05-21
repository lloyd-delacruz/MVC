import { requireUser } from "@/lib/cms/auth/session";
import { logout } from "@/lib/cms/actions/auth";
import { AdminNav } from "@/components/admin/Nav";

export const metadata = { title: "Admin" };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-slate-50 text-navy-800">
      <div className="flex">
        <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-navy-800 px-4 py-6 text-white">
          <div className="px-3 text-lg font-semibold">MVC Admin</div>
          <div className="mt-6 flex-1 overflow-y-auto">
            <AdminNav />
          </div>
          <form action={logout} className="border-t border-white/10 pt-4">
            <div className="px-3 pb-2 text-xs text-slate-300">{user.email}</div>
            <button
              type="submit"
              className="w-full rounded-md border border-white/15 px-3 py-2 text-sm text-slate-200 transition hover:bg-navy-700 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </aside>

        <main className="flex-1 px-8 py-8">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
