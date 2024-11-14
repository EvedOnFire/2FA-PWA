import { joinCss } from '@/utilities';
import { InputHTMLAttributes } from 'react';

interface Properties extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'|'onInput'> {
    label: string;
    name: string;
    onInput?: (value: string) => void;
}

export const Input = ({
    className,
    id,
    label,
    name,
    onInput,
    ...props
}: Properties) => {
    return (
        <div className={className}>
            <label htmlFor={id || name} className="block text-sm font-semibold text-gray-700">
                {label}
            </label>

            <input
                id={id || name}
                name={name}
                className={joinCss(
                    'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md',
                    'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                )}
                onInput={(event) => onInput?.(event.currentTarget.value)}
                {...props}
            />
        </div>
    );
};
