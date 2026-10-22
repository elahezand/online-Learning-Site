import { useId } from "react"

export interface FilterOption {
    value: string
    label: string
    count?: number
}

interface FilterSelectProps {
    label: string
    value: string
    onChange: (value: string) => void
    options: FilterOption[]
    allLabel: string
    allCount?: number
    disabled?: boolean
}

const withCount = (label: string, count?: number) => count === undefined ? label : `${label} (${count})`

export default function FilterSelect({ label, value, onChange, options, allLabel, allCount, disabled }: FilterSelectProps) {
    const id = useId()
    return (
        <div className="d-flex align-items-center gap-2">
            <label htmlFor={id} className="visually-hidden">{label}</label>
            <select id={id} className={`form-select form-select-sm w-auto ${value ? "border-primary" : ""}`}
                value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
                <option value="">{withCount(allLabel, allCount)}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>{withCount(option.label, option.count)}</option>
                ))}
            </select>
        </div>
    )
}
