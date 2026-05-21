import { notFound } from "next/navigation";
import { getPostByIdForAdmin } from "@/lib/cms/repositories/blog";
import { updatePost } from "@/lib/cms/actions/blog";
import { BlogForm } from "../BlogForm";

export const metadata = { title: "Edit post" };

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPostByIdForAdmin(params.id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">Edit post</h1>
      <p className="mt-1 text-sm text-slate-500">/{post.slug}</p>
      <div className="mt-6">
        <BlogForm initial={post} action={updatePost} />
      </div>
    </div>
  );
}
