export const Title = ({ innerWidth, chartTitle }) => (
    <g>
        <text
            style={{ fill: "white", textAnchor: "middle" }}
            x={innerWidth / 2}
            y="-20"
        >
            {chartTitle}
        </text>
    </g>
)