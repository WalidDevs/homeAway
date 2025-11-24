import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    className?: string;
    onClick?: () => void;
};
export const Button: React.FC<ButtonProps> = ({ children, type = "button", className = "", onClick }) => {
    return (
        <button
            type={type}
            className={`px-4 py-2 rounded-lg ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};