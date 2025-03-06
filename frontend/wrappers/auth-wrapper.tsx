'use client'
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Loader from '@/components/loader';
import { useUserActions } from '@/store/actions/user.actions';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useRouter();
  const path = usePathname()
  const { checkAuthAction } = useUserActions()
  const { authChecked, user } = useSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    if (!authChecked) checkAuthAction()
  }, []);

  useEffect(() => {
    if (authChecked && !user.id) return navigate.push('/')
    else if (path === '/') navigate.push('/main');
  }, [authChecked]);

  if (!authChecked) {
    return <Loader />;
  }

  return <>{children}</>;
}
