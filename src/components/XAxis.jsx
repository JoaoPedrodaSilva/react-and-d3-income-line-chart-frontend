export const XAxis = ({ xScale, innerHeight }) => (
    xScale.ticks(5).map((tick, index) => (
        <g key={index} transform={`translate(${xScale(tick)}, 0)`}>
            <line
                style={{ stroke: "#373737" }}
                y2={innerHeight}
            />
            <text
                style={{ textAnchor: "middle", fill: "white" }}
                y={innerHeight}
                dy="1.5rem"
            >
                {(tick)}
            </text>
        </g>
    ))
)
