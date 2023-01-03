import axios from "../axios"
import { scaleLinear, extent, format } from "d3"
import { useEffect, useState } from "react"

import { XAxis } from "../components/XAxis"
import { YAxis } from "../components/YAxis"
import { Marks } from "../components/Marks"
import { ColorLegend } from "../components/ColorLegend"

export const HomePage = () => {

    //declaring states and variables 
    const [financialData, setFinancialData] = useState(null)
    const [selectedChart, setSelectedChart] = useState('income')
    const [yAccessors, setYAccessors] = useState(null)
    const xAccessor = d => d.year
    const svgWidth = 280
    const svgHeight = 350
    const margin = { top: 15, right: 20, bottom: 65, left: 15 }
    const innerWidth = svgWidth - margin.right - margin.left
    const innerHeight = svgHeight - margin.top - margin.bottom


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
        return Math.floor(financialData.operating_income / financialData.net_revenue * 100)
    }
    const getNetMargin = (financialData) => {
        return Math.floor(financialData.net_income / financialData.net_revenue * 100)
    }
    const refreshChartType = () => {
        if (selectedChart === 'income') {
            // setChartTitle('Income')
            // setYAccessorTickFormat(() => format(","))
        } else if (selectedChart === 'margins') {
            // setChartTitle('Margins')
            // setYAccessorTickFormat(() => format(".1f"))
        }
    }
    const refreshYAccessors = () => {
        if (selectedChart === 'income') {
            setYAccessors([
                {
                    accessor: d => d.net_revenue,
                    color: "#d6d6ff",
                    legend: "Net Revenue",
                    isVisible: false
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
        } else if (selectedChart === 'margins') {
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


    //fetching data and setting YAccessors and Chart Type
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
        refreshYAccessors()
        refreshChartType()
    }, [selectedChart])


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
    const xScale = scaleLinear()
        .domain(extent(financialData, xAccessor))
        .range([0, innerWidth])
        .nice()

    const yScale = scaleLinear()
        .domain([0, getYDomainMaxValue(financialData, yAccessors)])
        .range([innerHeight, 0])
        .nice()


    


    return (
        <>
            {financialData &&
                <>
                    <select
                        className="shadow mx-auto text-center text-xs xs:text-base rounded px-1 mt-2 text-gray-700 focus:outline-none focus:shadow-outline"
                        onChange={event => setSelectedChart(event.target.value)}
                    >
                        {financialData &&
                            <>
                                <option value="income">Income (U$)</option>
                                <option value="margins">Margins (%)</option>
                            </>
                        }
                    </select>


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
                                tickFormat={format(",")}
                            />

                            <Marks
                                financialData={financialData}
                                selectedChart={selectedChart}

                                xAccessor={xAccessor}
                                xScale={xScale}

                                yScale={yScale}
                                yAccessors={yAccessors}
                                yAccessorTickFormat={format(",")}
                            />
                        </g>
                    </svg>

                    <ColorLegend
                        yAccessors={yAccessors}
                        setYAccessors={setYAccessors}
                    />
                </>
            }
        </>
    )
}
