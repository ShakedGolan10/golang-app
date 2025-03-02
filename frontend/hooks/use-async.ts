'use client';

import { useSystemActions } from "@/store/actions/system.actions";


interface AsyncOpArgs<T> {
  asyncOperation: () => Promise<T>;
  successMsg?: boolean;
  errorMsg?: boolean;
}

export const useAsync = () => {
  const { openModalAction, toggleLoaderAction } = useSystemActions()
  const executeAuthFunction = async <T>(args: AsyncOpArgs<T>): Promise<T> => {
    const { asyncOperation } = args;
    try {
      toggleLoaderAction()
      const res = await asyncOperation();
      openModalAction()
      return res;
    } catch (error: any) {
      openModalAction()
      throw new Error(error);
    } finally {
      toggleLoaderAction()
    }
  };

  return { executeAuthFunction };
};
