import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useTheme, { getToken } from '../../../../Hooks/useTheme';

const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

export default function Chart() {
    const [theme] = useTheme()

    // SVG attributes can't read CSS variables, so resolve the tokens per theme
    const colors = useMemo(() => ({
        primary: getToken("--color-primary"),
        grid: getToken("--chart-grid"),
        axis: getToken("--chart-axis"),
        surface: getToken("--color-surface"),
        border: getToken("--color-border"),
        text: getToken("--color-heading"),
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [theme])

    return (
        <section className='card p-3 mt-4 shadow-sm'>
            <h2 className="h6 fw-bold mb-3">Overview</h2>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.45} />
                                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                        <XAxis dataKey="name" stroke={colors.axis} tick={{ fill: colors.axis, fontSize: 12 }} />
                        <YAxis stroke={colors.axis} tick={{ fill: colors.axis, fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 8, color: colors.text }}
                            labelStyle={{ color: colors.text }}
                            itemStyle={{ color: colors.primary }} />
                        <Area type="monotone" dataKey="uv" stroke={colors.primary} strokeWidth={2} fill="url(#chartFill)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    )
}
