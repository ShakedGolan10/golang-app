'use client'

import { toggleLoader, openModal, closeModal } from '@/store/reducers/system.reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store';

export const useSystemActions = () => {
    const dispatch = useDispatch<AppDispatch>();

    const openModalAction = (modalMsg?: string, isError?: boolean) => {
        dispatch(openModal({ modalMsg, isError }))
    }

    const closeModalAction = () => {
        dispatch(closeModal())
    }
    const toggleLoaderAction = () => {
        dispatch(toggleLoader())
    }


    return { openModalAction, toggleLoaderAction, closeModalAction }
}

