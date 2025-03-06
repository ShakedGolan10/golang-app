'use client'
import { useUserActions } from '@/store/actions/user.actions';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface Errors {
  name: boolean;
  email: boolean;
  password: boolean;
}

export default function Register() {
  const navigate = useRouter();
  const { registerAction } = useUserActions()
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({ name: false, email: false, password: false });

  const validateName = (val: string): boolean => val.trim().length >= 2;
  const validateEmail = (val: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePassword = (val: string): boolean => val.length >= 6 && /[a-zA-Z]/.test(val);

  const handleBlur = (field: keyof FormData): void => {
    setErrors((prev) => ({
      ...prev,
      [field]:
        (field === 'name' && !validateName(formData.name)) ||
        (field === 'email' && !validateEmail(formData.email)) ||
        (field === 'password' && !validatePassword(formData.password)),
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormInvalid: boolean = Object.values(errors).some(Boolean) ||
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.password.trim();

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (isFormInvalid) return;
    await registerAction(formData)
    navigate.push('/main');
  };

  return (
    <form className="flex flex-col gap-4 min-w-[300px]" onSubmit={onSubmit}>
      <label className="flex flex-col">
        <span>Full Name</span>
        <input
          className="border border-gray-300 rounded px-2 py-1"
          type="text"
          name="name"
          value={formData.name}
          onBlur={() => handleBlur('name')}
          onChange={handleChange}
        />
      </label>
      {errors.name && <span className="text-red-500 text-xs">Invalid name</span>}

      <label className="flex flex-col">
        <span>Email</span>
        <input
          className="border border-gray-300 rounded px-2 py-1"
          type="email"
          name="email"
          value={formData.email}
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
          value={formData.password}
          onBlur={() => handleBlur('password')}
          onChange={handleChange}
        />
      </label>
      {errors.password && <span className="text-red-500 text-xs">Invalid password</span>}

      <button type="submit" disabled={isFormInvalid} className="bg-blue-500 text-white px-4 py-2 rounded">
        Register
      </button>
    </form>
  );
}
