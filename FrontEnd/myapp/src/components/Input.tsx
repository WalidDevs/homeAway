import React from "react";

type InputProps = {
    id: string;
    name: string;
    label?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    placeholder?: string;
    errorMessage?: string;
    className?: string; 
};

export const Input: React.FC<InputProps> = ({ id, name, label, value, onChange, type = "text", required, placeholder, errorMessage, className = "" }) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={`border border-gray-300 p-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
            />
            {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
        </div>
    );
};
