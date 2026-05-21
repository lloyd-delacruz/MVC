import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/cms/repositories/blog";
import { deletePost } from "@/lib/cms/actions/blog";

export const metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-serif text-2xl font-medium text-navy-800">Blog</h1>
          <p className="mt-1 text-sm text-slate-500">Posts, drafts, and publishing.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-redDark"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          No posts in the database yet — the site is showing the original markdown posts. Run the
          blog migration / seed to import them, or create a new post.
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {posts.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card"
          >
            <div className="min-w-0">
              <Link href={`/admin/blog/${p.id}`} className="font-semibold text-navy-800 hover:text-brand-red">
                {p.title}
              </Link>
              <div className="mt-0.5 text-xs text-slate-500">
                <span
                  className={
                    p.status === "PUBLISHED" ? "font-semibold text-green-600" : "font-semibold text-amber-600"
                  }
                >
                  {p.status === "PUBLISHED" ? "Published" : "Draft"}
                </span>{" "}
                · {p.date} · /{p.slug}
              </div>
            </div>
            <form action={deletePost}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="text-sm text-brand-red hover:underline">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
