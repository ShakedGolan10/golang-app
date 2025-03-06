'use client'

import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface ISystemState {
    modal?: {
        isModalOpen: boolean,
        modalMsg: string,
        isError: boolean,
    },
    isLoading?: boolean
}

interface IToggleModalPayload {
    modalMsg: string
    isError: boolean
}

interface IToggleLoaderPayload {
    boolean: boolean
}



const initialState: ISystemState = {
    modal: {
        isModalOpen: false,
        modalMsg: '',
        isError: false,
    },
    isLoading: false
}


export const system = createSlice({
    name: 'system',
    initialState,
    reducers: {
        openModal: (state: ISystemState, action: PayloadAction<IToggleModalPayload>) => {
            return state = {
                modal: {
                    isModalOpen: true,
                    modalMsg: action.payload.modalMsg,
                    isError: action.payload.isError
                },
                isLoading: state.isLoading
            }
        },
        closeModal: (state: ISystemState) => {
            return state = {
                modal: {
                    isModalOpen: false,
                    modalMsg: '',
                    isError: false
                },
                isLoading: state.isLoading
            }
        },
        toggleLoader: (state: ISystemState, action: PayloadAction<IToggleLoaderPayload>) => {
            return state = {
                modal: {
                    isModalOpen: state.modal.isModalOpen,
                    modalMsg: state.modal.modalMsg,
                    isError: state.modal.isError
                },
                isLoading: (action.payload) ? action.payload.boolean : !state.isLoading
            }
        },
    }
})

export const { openModal, closeModal, toggleLoader } = system.actions
export default system.reducer