import { createPost } from "@/lib/cms/actions/blog";
import { BlogForm } from "../BlogForm";

export const metadata = { title: "New post" };

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">New post</h1>
      <div className="mt-6">
        <BlogForm action={createPost} />
      </div>
    </div>
  );
}
