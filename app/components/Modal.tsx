import React, { FC } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  children: React.ReactNode;
  label: string;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ children, label, onClose }) => {
  return (
    <>
      <div className="flex justify-center items-center fixed inset-0 z-10">
        <div className="max-w-4xl w-full bg-white mx-auto p-3 z-10 ">
          <div className="flex justify-between items-start">
            <h2 className="text-title font-bold">{label}</h2>
            <button onClick={onClose} className="hover:bg-gray-300 mb-2 p-2">
              <IoClose className="w-4" />
            </button>
          </div>
          {children}
        </div>
        <div className="absolute inset-0 bg-black/20 " onClick={onClose}></div>
      </div>
    </>
  );
};

export default Modal;
