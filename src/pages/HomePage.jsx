import axios from "../axios"
import { scaleLinear, extent, format } from "d3"
import { useEffect, useState } from "react"

import { XAxis } from "../components/XAxis"
import { YAxis } from "../components/YAxis"
import { Marks } from "../components/Marks"
import { ColorLegend } from "../components/ColorLegend"
import { Tooltip } from "../components/Tooltip"

export const HomePage = () => {

    //declaring states and variables     
    const [chartSettings, setChartSettings] = useState({
        selectedChart: "income",
        chartType: "line",
        yAccessorsFormat: {
            yAxis: () => format("$,.0f"),
            tooltip: () => format("$,.2f")
        }
    })
    const [tooltipSettings, setTooltipSettings] = useState({
        isVisible: false,
        year: null,
        yAcessors: []
    })
    const [financialData, setFinancialData] = useState(null)
    const [yAccessors, setYAccessors] = useState(null)
    const xAccessor = d => d.year
    const svgWidth = 280
    const svgHeight = 280

    let margin
    if (chartSettings.selectedChart === "income") {
        margin = {
            top: 10,
            right: 45,
            bottom: 30,
            left: 15
        }
    } else if (chartSettings.selectedChart === "margins") {
        margin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 15
        }
    }

    const innerWidth = svgWidth - margin.right - margin.left
    const innerHeight = svgHeight - margin.top - margin.bottom
    const barWidth = financialData && innerWidth / financialData.length * 0.7


    //declaring functions
    const getYDomainMaxValue = (financialData, yAccessors) => {
        const tempVisibleAccessors = []
        financialData.map(yearOfData => {
            yAccessors.map(yAccessor => {
                if (yAccessor.isVisible) {
                    tempVisibleAccessors.push(yAccessor.accessor(yearOfData))
                }
            })
        })
        return Math.max(...tempVisibleAccessors)
    }
    const getOperatingMargin = (financialData) => {
        return financialData.operating_income / financialData.net_revenue
    }
    const getNetMargin = (financialData) => {
        return financialData.net_income / financialData.net_revenue
    }
    const refreshYAccessors = () => {
        if (chartSettings.selectedChart === 'income') {
            setYAccessors([
                {
                    accessor: d => d.net_revenue,
                    color: "#d6ddff",
                    legend: "Net Revenue",
                    isVisible: true
                },
                {
                    accessor: d => d.operating_income,
                    color: "#4747ff",
                    legend: "Oper. Income",
                    isVisible: true
                },
                {
                    accessor: d => d.net_income,
                    color: "#000066",
                    legend: "Net Income",
                    isVisible: true
                }
            ])
        } else if (chartSettings.selectedChart === 'margins') {
            setYAccessors([
                {
                    accessor: d => getOperatingMargin(d),
                    color: "#d6d6ff",
                    legend: "Oper. Margin",
                    isVisible: true
                },
                {
                    accessor: d => getNetMargin(d),
                    color: "#4747ff",
                    legend: "Net Margin",
                    isVisible: true
                }
            ])
        }
    }


    //fetching data and setting YAccessors    
    useEffect(() => {
        const getFinancialData = async () => {
            try {
                const response = await axios.get("/api")
                setFinancialData(response.data.financial_data)
            } catch (error) {
                console.log(error)
            }
        }
        getFinancialData()
    }, [])
    useEffect(() => refreshYAccessors(), [chartSettings.selectedChart])


    //render in case of no data
    if (!financialData) {
        return (
            <div className="flex flex-col justify-center items-center gap-3 pt-40">
                <p className="text-white text-center">Loading data...</p>
                <img className="w-2/12 sm:w-1/12 rounded-lg" src="https://financas-e-fundamentos.s3.sa-east-1.amazonaws.com/loading.gif" alt="An animation, showing the chart is being loaded." />
            </div>
        )
    }


    //declaring scales
    let xScale
    if (chartSettings.chartType === "line") {
        xScale = scaleLinear()
            .domain(extent(financialData, xAccessor))
            .range([0, innerWidth])
            .nice()
    } else if (chartSettings.chartType === "bar") {
        xScale = scaleLinear()
            .domain(extent(financialData, xAccessor))
            .range([barWidth / 2, innerWidth - barWidth / 2])
            .nice()
    }


    const yScale = scaleLinear()
        .domain([0, getYDomainMaxValue(financialData, yAccessors)])
        .range([innerHeight, 0])
        .nice()


    return (
        <section className="relative flex flex-col items-center text-xs">
            {financialData &&
                <>
                    <select
                        className="shadow mx-auto text-center text-xs xs:text-base rounded px-1 mt-2 text-gray-700 focus:outline-none focus:shadow-outline"
                        onChange={event => setChartSettings(prevChartSettings => {
                            if (event.target.value === "income") {
                                return ({
                                    ...prevChartSettings,
                                    yAccessorsFormat: {
                                        yAxis: () => format("$,.0f"),
                                        tooltip: () => format("$,.2f")
                                    },
                                    selectedChart: event.target.value
                                })
                            } else if (event.target.value === "margins") {
                                return ({
                                    ...prevChartSettings,
                                    yAccessorsFormat: {
                                        yAxis: () => format(",.0%"),
                                        tooltip: () => format(",.2%")
                                    },
                                    selectedChart: event.target.value
                                })
                            }
                            
                        })}
                    >
                        {financialData &&
                            <>
                                <option value="income">Income (U$)</option>
                                <option value="margins">Margins (%)</option>
                            </>
                        }
                    </select>


                    <div className="flex justify-center items-center gap-8 text-xs xs:text-sm text-white mt-2">
                        <div className="flex items-center gap-1">
                            <label htmlFor="line-chart-radio">Line Chart</label>
                            <input
                                id="line-chart-radio"
                                type="radio"
                                name="type-chart"
                                value="line"
                                onChange={event => setChartSettings(prevChartSettings => ({ ...prevChartSettings, chartType: event.target.value }))}
                                checked={chartSettings.chartType === "line"}
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <label htmlFor="bar-chart-radio">Bar Chart</label>
                            <input
                                id="bar-chart-radio"
                                type="radio"
                                name="type-chart"
                                value="bar"
                                onChange={event => setChartSettings(prevChartSettings => ({ ...prevChartSettings, chartType: event.target.value }))}
                            />
                        </div>
                    </div>


                    <svg
                        preserveAspectRatio="xMinYMin meet"
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    >
                        <g transform={`translate(${margin.left}, ${margin.top})`}>
                            <XAxis
                                xScale={xScale}
                                innerHeight={innerHeight}
                            />

                            <YAxis
                                yScale={yScale}
                                innerWidth={innerWidth}
                                tickFormat={chartSettings.yAccessorsFormat.yAxis()}
                            />

                            <Marks
                                financialData={financialData}
                                chartType={chartSettings.chartType}
                                barWidth={barWidth}
                                innerHeight={innerHeight}
                                setTooltipSettings={setTooltipSettings}

                                xAccessor={xAccessor}
                                xScale={xScale}

                                yScale={yScale}
                                yAccessors={yAccessors}
                            />
                        </g>
                    </svg>

                    <ColorLegend
                        yAccessors={yAccessors}
                        setYAccessors={setYAccessors}
                    />

                    {tooltipSettings.isVisible &&
                        <Tooltip
                            tooltipSettings={tooltipSettings}
                            tickFormat={chartSettings.yAccessorsFormat.tooltip()}
                        />
                    }
                </>
            }
        </section>
    )
}
