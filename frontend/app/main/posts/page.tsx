import fs from "fs";
import path from "path";
import { Post } from "@/services/post.service";
import Table from "@/components/table";


export default async function PostsPage() {
  const filePath = path.join(process.cwd(), "public/data/posts.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const posts: Post[] = JSON.parse(jsonData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <ul className="space-y-4">
        <Table data={posts} dataKind={'posts'} actions={{ delete: true, update: true, create: true }} />
      </ul>
    </div>
  );
}

