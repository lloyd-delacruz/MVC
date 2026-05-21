import { getTeamForAdmin } from "@/lib/cms/repositories/team";
import { TeamAdmin } from "./ui";

export const metadata = { title: "Team" };

export default async function AdminTeamPage() {
  const items = await getTeamForAdmin();

  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">Team</h1>
      <p className="mt-1 text-sm text-slate-500">The &ldquo;Meet the Team&rdquo; section.</p>
      <div className="mt-6">
        <TeamAdmin items={items} />
      </div>
    </div>
  );
}
