import React, { useState } from 'react';

interface ModalProps {
    show: boolean;
    onClose?: () => void;
    title?: string;
    children: React.ReactNode;
    fullScreen?: boolean;
}

const Modal: React.FC<ModalProps> = ({ show, children, fullScreen }) => {
    if (!show) {
        return null;
    }
    const fullScreenValue = "h-full w-full";
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`bg-white rounded-lg shadow-lg w-2/3 h-3/4 ${fullScreen ? fullScreenValue : ""}`}>
                <div className='p-4'>
                    {children}
                </div>
            </div>
        </div>
    );
};
export default Modal;
