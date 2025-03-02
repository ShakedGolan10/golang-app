'use client'
import { useState, ChangeEvent, FormEvent } from 'react';
import { useUserActions } from '@/store/actions/user.actions';
import { useRouter } from 'next/navigation';

interface Credentials {
  email: string;
  password: string;
}

interface Errors {
  email?: boolean;
  password?: boolean;
}

export default function Login() {
  const [creds, setCreds] = useState<Credentials>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useRouter();
  const { loginAction } = useUserActions()
  const validateEmail = (val: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePassword = (val: string): boolean => val.length >= 6 && /[a-zA-Z]/.test(val);

  const handleBlur = (field: keyof Credentials): void => {
    setErrors((prev) => ({
      ...prev,
      [field]:
        field === 'email' && !validateEmail(creds.email)
          ? true
          : field === 'password' && !validatePassword(creds.password)
            ? true
            : undefined,
    }));
  };

  const isFormInvalid = (): boolean => !validateEmail(creds.email) || !validatePassword(creds.password);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCreds((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (isFormInvalid()) return;
    await loginAction(creds)
    navigate.push('/main');
  };

  return (
    <form className="flex flex-col gap-4 min-w-[300px]" onSubmit={onSubmit}>
      <label className="flex flex-col">
        <span>Email</span>
        <input
          className="border border-gray-300 rounded px-2 py-1"
          type="email"
          name="email"
          value={creds.email}
          onBlur={() => handleBlur('email')}
          onChange={handleChange}
        />
      </label>
      {errors.email && <span className="text-red-500 text-xs">Invalid email</span>}

      <label className="flex flex-col">
        <span>Password</span>
        <input
          className="border border-gray-300 rounded px-2 py-1"
          type="password"
          name="password"
          value={creds.password}
          onBlur={() => handleBlur('password')}
          onChange={handleChange}
        />
      </label>
      {errors.password && <span className="text-red-500 text-xs">Invalid password</span>}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isFormInvalid()}>
        Login
      </button>
    </form>
  );
}
