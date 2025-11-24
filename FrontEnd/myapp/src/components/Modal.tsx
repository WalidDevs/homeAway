import React from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#F0F3F5] mt-14">
            <div className="bg-white p-4 rounded-lg shadow-lg mt-14 ">
                {children}
            </div>
        </div>
    );
};