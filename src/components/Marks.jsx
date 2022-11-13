import { line, curveNatural } from "d3"

export const Marks = ({ financialData, selectedChart, xScale, yScale, xAccessor, yAccessors, yAccessorTickFormat }) => {

    return (
        <>
            {yAccessors.map((yAccessor, index) => (
                yAccessor.isVisible && (
                    <g key={index}>
                        <path
                            d={line()
                                .x(d => xScale(xAccessor(d)))
                                .y(d => yScale(yAccessor.accessor(d)))
                                .curve(curveNatural)
                                (financialData)
                            }
                            fill="none"
                            stroke={yAccessor.color}
                            strokeWidth={3}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />

                        {financialData.map((d, i) => (
                            <circle
                                key={i}
                                fill={yAccessor.color}
                                cx={xScale(xAccessor(d))}
                                cy={yScale(yAccessor.accessor(d))}
                                r={4}
                            >
                                {selectedChart === "income" ? (
                                    <title>
                                        {`Year: ${xAccessor(d)}  -  ${yAccessor.legend}: U$ ${yAccessorTickFormat(yAccessor.accessor(d))}`}
                                    </title>
                                ) : (
                                    <title>
                                        {`Year: ${xAccessor(d)}  -  ${yAccessor.legend}: ${yAccessor.accessor(d)}%`}
                                    </title>
                                )}
                            </circle>
                        ))}
                    </g>
                )
            ))}
        </>
    )
}

