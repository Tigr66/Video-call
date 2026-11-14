import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
    copyText: string;
    className?: string;
    iconSize?: number;
}

const CopyButton = ({ className, copyText, iconSize }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(copyText);
            setCopied(true);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center justify-center border-0 bg-transparent p-0 cursor-pointer ${className ?? ""}`}
            aria-label={copied ? "Скопировано" : "Скопировать"}
            title={copied ? "Скопировано" : "Скопировать"}
        >
            {copied ? <Check size={iconSize} /> : <Copy size={iconSize} />}
        </button>
    );
};

export default CopyButton;
