import { useMemo, useState } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import { FaMagnifyingGlass } from "react-icons/fa6"
import type { FilterOption } from "./FilterSelect"

interface SearchSelectProps {
    label: string
    value: string
    onChange: (value: string) => void
    options: FilterOption[]
    allLabel: string
    placeholder?: string
}

export default function SearchSelect({ label, value, onChange, options, allLabel, placeholder = "Search…" }: SearchSelectProps) {
    const [query, setQuery] = useState("")
    const selected = options.find(option => option.value === value)

    const visible = useMemo(() => {
        const text = query.trim().toLowerCase()
        return text ? options.filter(option => option.label.toLowerCase().includes(text)) : options
    }, [options, query])

    const choose = (next: string) => {
        onChange(next)
        setQuery("")
    }

    return (
        <Dropdown onToggle={(open) => { if (!open) setQuery("") }} autoClose="outside">
            <Dropdown.Toggle size="sm" variant="outline-secondary" aria-label={label}
                className={`text-truncate text-start ${value ? "border-primary text-primary-emphasis" : ""}`} style={{ maxWidth: "14rem" }}>
                {selected?.label ?? allLabel}
            </Dropdown.Toggle>

            <Dropdown.Menu className="p-2 shadow" style={{ width: "18rem" }}>
                <div className="input-group input-group-sm mb-2">
                    <span className="input-group-text bg-body"><FaMagnifyingGlass /></span>
                    <input type="search" className="form-control" autoFocus value={query}
                        onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
                </div>

                <div className="overflow-auto" style={{ maxHeight: "16rem" }}>
                    <Dropdown.Item as="button" active={!value} onClick={() => choose("")} className="rounded-2">{allLabel}</Dropdown.Item>
                    {visible.map(option => (
                        <Dropdown.Item as="button" key={option.value} active={option.value === value}
                            onClick={() => choose(option.value)} className="rounded-2 text-truncate">
                            {option.label}
                        </Dropdown.Item>
                    ))}
                    {!visible.length && <div className="small text-body-secondary text-center py-3">Nothing found</div>}
                </div>
            </Dropdown.Menu>
        </Dropdown>
    )
}