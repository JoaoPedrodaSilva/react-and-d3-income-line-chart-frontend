import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"

export const ColorLegend = ({ yAccessors, setYAccessors }) => {

    const toggleAccessorVisibility = (yAccessor) => {
        const tempYAccessors = []

        yAccessors.map(currentYAccessor => {
            if (currentYAccessor.legend === yAccessor.legend) {
                if (currentYAccessor.isVisible) {
                    tempYAccessors.push({ ...yAccessor, isVisible: false })
                } else {
                    tempYAccessors.push({ ...yAccessor, isVisible: true })
                }
            } else {
                tempYAccessors.push({ ...currentYAccessor })
            }
        })
        setYAccessors([...tempYAccessors])
    }

    return (
        <>
            {yAccessors.map((yAccessor, index) => (
                <g
                    key={index}
                    transform={`translate(${50 * index}, ${250})`}
                    style={yAccessor.isVisible ? { cursor: "pointer", opacity: "1" } : { cursor: "pointer", opacity: "0.3" }}
                    onClick={() => toggleAccessorVisibility(yAccessor)}
                >
                    <rect
                        width={95}
                        height={25}
                        x={(index * 60) - 10}
                        rx={5}
                        fill={yAccessor.color}
                    />

                    <text
                        dx="1em"
                        x={(index * 60) + 4}
                        y={17}
                        style={index === 0 ? { fill: "black", fontSize: "0.6rem" } : { fill: "white", fontSize: "0.6rem" }}
                    >
                        {yAccessor.legend}
                    </text>

                    {yAccessor.isVisible ? (
                        <AiFillEye
                            x={(index * 60) - 5}
                            y={5}
                            style={index === 0 ? { fill: "black", fontSize: "1rem" } : { fill: "white", fontSize: "1rem" }}
                        />
                    ) : (
                        <AiFillEyeInvisible
                            x={(index * 60 - 5)}
                            y={5}
                            style={index === 0 ? { fill: "black", fontSize: "1rem" } : { fill: "white", fontSize: "1rem" }}
                        />
                    )}
                </g>
            ))}
        </>
    )
}

