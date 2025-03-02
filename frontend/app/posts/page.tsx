import fs from "fs";
import path from "path";
import Table from "../../components/table";
import { Post, postService } from "@/services/post.service";


export default async function PostsPage() {
  const filePath = path.join(process.cwd(), "public/data/posts.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const posts: Post[] = JSON.parse(jsonData);

  async function deletePost(postId: string) {
    await postService.deletePost(postId)
  }

  async function updatePost(post: Post) {
    await postService.updatePost(post)
  }
  async function createPost(newPost: Omit<Post, "id">) {
    await postService.createPost(newPost)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <ul className="space-y-4">
        <Table data={posts} actions={{ onCreate: (post) => createPost(post as Post), onDelete: (id) => deletePost(id), onEdit: (post) => updatePost(post as Post) }} />
      </ul>
    </div>
  );
}

