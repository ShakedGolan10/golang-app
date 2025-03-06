"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightOnRectangleIcon, HomeIcon } from "@heroicons/react/24/solid";
import { useUserActions } from "@/store/actions/user.actions";

export default function Navbar() {
    const router = useRouter();
    const { logoutAction } = useUserActions()
    const handleLogout = async () => {
        setTimeout(logoutAction, 1000)
        router.push("/");
    };

    return (
        <nav className="w-full absolute top-0 left-0 bg-blue-600 text-white h-16 flex items-center justify-between px-4">
            <Link href="/main" className="flex items-center cursor-pointer">
                <HomeIcon className="w-8 h-8" />
            </Link>

            <div className="flex items-center space-x-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button>

                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-800 px-3 py-2 rounded transition"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Go Back</span>
                </button>
            </div>
        </nav>
    );
}
