import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import useTheme, { getToken } from "../../hooks/useTheme"

export interface ChartPoint {
    name: string
    value: number
}

interface DashboardChartProps {
    title: string
    data: ChartPoint[]
    valueLabel: string
}

export default function DashboardChart({ title, data, valueLabel }: DashboardChartProps) {
    const [theme] = useTheme()

    const colors = useMemo(() => ({
        primary: getToken("--bs-link-color"),
        grid: getToken("--bs-border-color"),
        axis: getToken("--bs-secondary-color"),
        surface: getToken("--bs-body-bg"),
        text: getToken("--bs-emphasis-color"),
    }), [theme])

    return (
        <section className="card shadow-sm h-100">
            <div className="card-header py-3"><h2 className="h6 fw-bold mb-0">{title}</h2></div>
            <div className="card-body">
                {data.length ?
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                <XAxis dataKey="name" stroke={colors.axis} tick={{ fill: colors.axis, fontSize: 12 }} interval={0} angle={-25} textAnchor="end" height={60} />
                                <YAxis allowDecimals={false} stroke={colors.axis} tick={{ fill: colors.axis, fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: colors.grid, opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: colors.surface, borderColor: colors.grid, borderRadius: 8, color: colors.text }}
                                    labelStyle={{ color: colors.text }}
                                    formatter={(value) => [value, valueLabel]} />
                                <Bar dataKey="value" fill={colors.primary} radius={[6, 6, 0, 0]} maxBarSize={48} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div> :
                    <p className="text-body-secondary mb-0">No data yet.</p>}
            </div>
        </section>
    )
}
