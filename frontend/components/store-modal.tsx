'use client'
import { useSelector } from 'react-redux';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import Modal from './modal';
import { RootState } from '@/store/store';
import { closeModal } from '@/store/reducers/system.reducer';

export default function SystemModal() {
  const {isError, isModalOpen} = useSelector((state: RootState) => state.systemReducer.modal);
  const isSuccess = Boolean(!isError);

  return (
    <Modal onClose={() => closeModal()} isOpen={isModalOpen}>
      {isSuccess && (
        <div className="flex flex-col items-center gap-3 text-green-600">
          <CheckCircleIcon className="w-16 h-16 text-green-500" />
          <h2 className="text-xl font-bold">Success!</h2>
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center gap-3 text-red-600">
          <XCircleIcon className="w-16 h-16 text-red-500" />
          <p className="text-md">Sorry operation faild, please try again!</p>
        </div>
      )}
      <div className="modal-action justify-center">
        <button className="btn btn-primary w-32" onClick={() => closeModal()}>
          OK
        </button>
      </div>
    </Modal>
  );
}

