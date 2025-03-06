import fs from "fs";
import path from "path";
import { User } from "@/store/reducers/user.reducer";
import Table from "@/components/table";


export default async function UsersPage() {
    const filePath = path.join(process.cwd(), "public/data/users.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const users: User[] = JSON.parse(jsonData);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <ul className="space-y-4">
                <Table data={users} dataKind={'users'} actions={{ delete: true }} />
            </ul>
        </div>
    );
}
