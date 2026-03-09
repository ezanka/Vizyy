const C = {
    gradPrimary: "linear-gradient(135deg, var(--primary), var(--primary-light))",
    gradAccent: "linear-gradient(135deg, var(--cyan), var(--primary))",
}

export function GradientText({ children, accent = false, className = "" }: React.ComponentProps<"span"> & { accent?: boolean }) {
    return (
        <span
            className={className}
            style={{
                background: accent ? C.gradAccent : C.gradPrimary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
            }}
        >
            {children}
        </span>
    )
}