import { XMarkIcon } from '@heroicons/react/24/solid';

export default function Modal({ children, onClose, isOpen }) {
  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 flex items-center justify-center z-[999] rounded-md">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />

      <div className="relative flex flex-col gap-4 bg-base-100 shadow-lg rounded-lg p-10">
        <XMarkIcon
          onClick={onClose}
          className="h-4 w-4 outline-none absolute top-[10px] right-[10px] cursor-pointer"
        />
        {children}
      </div>
    </section>
  );
}
