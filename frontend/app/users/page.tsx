import fs from "fs";
import path from "path";
import Table from "../../components/table";
import { User } from "@/store/reducers/user.reducer";
import { userService } from "@/services/user.service";


export default async function PostsPage() {
    const filePath = path.join(process.cwd(), "public/data/users.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const users: User[] = JSON.parse(jsonData);

    async function deleteUser(postId: string) {
        await userService.deleteUser(postId)
    }


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <ul className="space-y-4">
                <Table data={users} actions={{ onDelete: (id) => deleteUser(id) }} />
            </ul>
        </div>
    );
}
