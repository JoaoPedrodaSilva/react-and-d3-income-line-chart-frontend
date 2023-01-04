import { line, curveNatural } from "d3"

export const Marks = ({ financialData, chartType, barWidth, innerHeight, xScale, yScale, xAccessor, yAccessors, setTooltipSettings }) => {

    const configTooltip = (isVisible, year, yAccessors, financialData) => {
        if (!isVisible) {
            setTooltipSettings({
                isVisible: false,
                year: null,
                yAccessors: []
            })
        } else {
            setTooltipSettings({
                isVisible: true,
                year: year,
                yAccessors: yAccessors && yAccessors.map(yAccessor => {
                    return ({
                        ...yAccessor,
                        value: yAccessor.accessor(financialData.filter(yearOfData => yearOfData.year === year)[0])
                    })
                })
            })
        }
    }

    return (
        <>
            {
                chartType === "line" &&
                yAccessors.map((yAccessor, index) => (
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
                                    className="hover:fill-slate-500"
                                    onMouseEnter={() => configTooltip(true, financialData[i].year, yAccessors, financialData)}
                                    onMouseOut={() => configTooltip(false)}
                                    fill={yAccessor.color}
                                    cx={xScale(xAccessor(d))}
                                    cy={yScale(yAccessor.accessor(d))}
                                    r={4}
                                />
                            ))}
                        </g>
                    )
                ))
            }

            {chartType === "bar" &&
                yAccessors.map((yAccessor, index) => (
                    yAccessor.isVisible && (
                        <g key={index} transform={`translate(${index * 9}, 0)`}>
                            {financialData.map((d, i) => (
                                <rect
                                    key={i}
                                    className="hover:fill-slate-500"
                                    onMouseEnter={() => configTooltip(true, financialData[i].year, yAccessors, financialData)}
                                    onMouseOut={() => configTooltip(false)}
                                    fill={yAccessor.color}
                                    x={xScale(xAccessor(d)) - (barWidth / 2)}
                                    y={yScale(yAccessor.accessor(d))}
                                    width={barWidth / 3}
                                    height={innerHeight - yScale(yAccessor.accessor(d))}
                                />
                            ))}
                        </g>
                    )
                ))            
            }
        </>
    )
}

