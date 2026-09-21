
interface DividerProps {
    text: string;
}

const Divider = ({ text }: DividerProps) => {
    return (
        <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-300" />

            <span className="text-sm text-slate-400">{text}</span>

            <div className="h-px flex-1 bg-slate-300" />
        </div>
    );
};

export default Divider;
