'use client'
import Login from '@/components/login';
import Register from '@/components/register';
import { useState } from 'react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="max-w-md mx-auto flex flex-col items-center gap-10">
      <h1 className="text-4xl font-extrabold text-center">Welcome to Auth Page</h1>
      <div className="flex gap-6">
        <button
          className="px-6 py-2 border border-blue-500 bg-blue-500 text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className="px-6 py-2 border border-gray-500 bg-gray-500 text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-gray-600 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>
      {mode === 'login' ? <Login /> : <Register />}
    </div>
  );
}
