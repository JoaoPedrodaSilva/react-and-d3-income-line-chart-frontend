import axios from "../axios"
import { scaleLinear, extent, format, tickFormat } from "d3"
import { useEffect, useState } from "react"

import { XAxis } from "../components/XAxis"
import { YAxis } from "../components/YAxis"

export const HomePage = () => {

    //declaring states and variables 
    const [financialData, setFinancialData] = useState(null)
    const [yAccessors, setYAccessors] = useState(null)
    const [xAccessor] = useState(() => d => d.year)
    const svgWidth = 300
    const svgHeight = 300
    const margin = { top: 40, right: 60, bottom: 80, left: 30 }
    const innerWidth = svgWidth - margin.right - margin.left
    const innerHeight = svgHeight - margin.top - margin.bottom


    //fetching data and setting Y Accessors
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
                legend: "Operating Income",
                isVisible: true
            },
            {
                accessor: d => d.net_income,
                color: "#000066",
                legend: "Net Income",
                isVisible: true
            }
        ])
    }, [])


    //declaring functions
    const getYDomainMaxValue = (financialData, yAccessors) => {
        const tempVisibleAccessors = []
        // eslint-disable-next-line
        financialData.map(yearOfData => {
            // eslint-disable-next-line
            yAccessors.map(yAccessor => {                
                if (yAccessor.isVisible) {
                    tempVisibleAccessors.push(yAccessor.accessor(yearOfData))
                }
            })
        })
        return Math.max(...tempVisibleAccessors)
    }


    //render in case of no data
    if (!financialData) {
        return (
            <div className="flex flex-col justify-center items-center gap-3">
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

            </g>
        </svg>
    )
}
