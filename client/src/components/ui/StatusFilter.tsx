interface StatusFilterProps {
    options: readonly { value: string; label: string }[]
    value: string
    onChange: (value: string) => void
    counts?: Record<string, number>
    label?: string
}

export default function StatusFilter({ options, value, onChange, counts = {}, label = "Filter by status" }: StatusFilterProps) {
    return (
        <ul className="nav nav-pills flex-nowrap overflow-auto gap-1" aria-label={label}>
            {options.map(option => {
                const active = value === option.value
                return (
                    <li className="nav-item" key={option.value}>
                        <button type="button" className={`nav-link text-nowrap py-1 px-3 ${active ? "active" : ""}`}
                            onClick={() => onChange(option.value)} aria-pressed={active}>
                            {option.label}
                            {counts[option.value] !== undefined &&
                                <span className={`badge rounded-pill ms-2 ${active ? "bg-white text-primary" : "bg-secondary-subtle text-secondary-emphasis"}`}>
                                    {counts[option.value]}
                                </span>}
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}
