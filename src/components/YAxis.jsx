export const YAxis = ({ yScale, innerWidth, tickFormat }) => (

    yScale.ticks().map((tick, index) => (
        <g key={index} transform={`translate(${innerWidth}, ${yScale(tick)})`}>
            <line
                style={{ stroke: "#373737" }}
                x2={-innerWidth}
            />
            <text
                style={{ textAnchor: "start", fill: "white", fontSize: "0.6rem" }}
                dx="0.5rem"
                dy="0.3rem"
            >
                {tickFormat(tick)}
            </text>
        </g>
    ))
)