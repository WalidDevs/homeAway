import React from "react";

type Option = {
    label: string;
    value: string;
};

type InputSelectProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    required?: boolean;
    errorMessage?: string;
    className?: string;
};

export const InputSelect: React.FC<InputSelectProps> = ({ id, name, label, value, onChange, options, required, errorMessage }) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="border border-gray-300 p-2 rounded mt-1"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
        </div>
    );
};
