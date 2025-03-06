'use client'
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function MainPage() {
    const navigate = useRouter()
    const { user } = useSelector((state: RootState) => state.userReducer);

    return (
        <div className="max-w-md mx-auto flex flex-col items-center gap-10">
            <h1 className="text-4xl font-extrabold text-center">{`Welcome to Main Page ${user.name}`}</h1>
            <div className="flex gap-6">
                <button
                    className="px-6 py-2 border border-blue-500 bg-blue-500 text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => navigate.push('main/users')}
                >
                    Users
                </button>
                <button
                    className="px-6 py-2 border border-gray-500 bg-gray-500 text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-gray-600 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => navigate.push('main/posts')}
                >
                    Posts
                </button>
            </div>
        </div>
    );
}
