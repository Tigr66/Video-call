import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: ReactNode;
}

const Button = ({
    loading = false,
    children,
    disabled,
    className = "",
    ...props
}: ButtonProps) => {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={twMerge(
                "flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
                className,
            )}
        >
            {loading && <LoaderCircle className="h-5 w-5 animate-spin" />}

            {children}
        </button>
    );
};

export default Button;
