export const XAxis = ({ xScale, innerHeight }) => (
    xScale.ticks(5).map((tick, index) => (
        <g key={index} transform={`translate(${xScale(tick)}, 0)`}>
            <line
                style={{ stroke: "#373737" }}
                y2={innerHeight}
            />
            <text
                style={{ textAnchor: "middle", fill: "white", fontSize: "0.6rem" }}
                y={innerHeight}
                dy="1rem"
            >
                {(tick)}
            </text>
        </g>
    ))
)
