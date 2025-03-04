export default function Input({ type = "text", className, ...props }) {
    return (
        <input
            type={type}
            className={`${className}`}
            {...props}
        />
    );
}