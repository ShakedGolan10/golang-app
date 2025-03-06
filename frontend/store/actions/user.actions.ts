'use client'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store';
import { checkAuth, login, logout, register } from '../reducers/user.reducer';
import { useSystemActions } from './system.actions';

export const useUserActions = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { toggleLoaderAction, openModalAction } = useSystemActions()

    const loginAction = async (creds: Creds) => {
        try {
            toggleLoaderAction()
            await dispatch(login(creds))
            openModalAction()
        } catch (error) {
            openModalAction('', true)
            throw error
        } finally {
            toggleLoaderAction()
        }
    }

    const logoutAction = async () => {
        toggleLoaderAction()
        await dispatch(logout())
        toggleLoaderAction()
    }

    const registerAction = async (creds: RegisterCreds) => {
        try {
            toggleLoaderAction()
            await dispatch(register(creds))
            openModalAction()
        } catch (error) {
            openModalAction('', true)
            throw error
        } finally {
            toggleLoaderAction()
        }
    }

    const checkAuthAction = () => {
        dispatch(checkAuth())
    }

    return { loginAction, registerAction, logoutAction, checkAuthAction }
}

