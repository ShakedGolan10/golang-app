'use client'
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Loader from '@/components/loader';
import { useUserActions } from '@/store/actions/user.actions';
import { useRouter } from 'next/navigation';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useRouter();
  const { checkAuthAction } = useUserActions()
  const { authChecked, user } = useSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    checkAuthAction()
  }, []);

  useEffect(() => {
    if (authChecked) {
      if (user.id) {
        navigate.push('/main');
      } else {
        navigate.push('/');
      }
    }
  }, [authChecked, user.id]);

  if (!authChecked) {
    return <Loader />;
  }

  return <>{children}</>;
}
