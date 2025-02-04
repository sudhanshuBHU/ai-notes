import React, { useState } from 'react';

interface ModalProps {
    show: boolean;
    onClose?: () => void;
    title?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-2/3 h-3/4">
                <div className='p-4'>
                    {children}
                </div>
            </div>
        </div>
    );
};
export default Modal;
