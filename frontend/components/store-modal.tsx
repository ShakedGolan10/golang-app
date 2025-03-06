'use client'
import { useSelector } from 'react-redux';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import Modal from './modal';
import { RootState } from '@/store/store';
import { useSystemActions } from '@/store/actions/system.actions';

export default function StoreModal() {
  const { modal } = useSelector((state: RootState) => state.systemReducer);
  const { closeModalAction } = useSystemActions()
  const isSuccess = Boolean(!modal.isError);

  return (
    <Modal onClose={() => closeModalAction()} isOpen={modal.isModalOpen}>
      {isSuccess && (
        <div className="flex flex-col items-center gap-3 text-green-600">
          <CheckCircleIcon className="w-16 h-16 text-green-500" />
          <h2 className="text-xl font-bold">Success!</h2>
        </div>
      )}
      {modal.isError && (
        <div className="flex flex-col items-center gap-3 text-red-600">
          <XCircleIcon className="w-16 h-16 text-red-500" />
          <p className="text-md">Sorry operation faild, please try again!</p>
        </div>
      )}
      <button
        onClick={() => closeModalAction()}
        className="bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out"
      >
        OK
      </button>
    </Modal>
  );
}

