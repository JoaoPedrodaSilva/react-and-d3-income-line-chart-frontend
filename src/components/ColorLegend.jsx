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
        <div className="flex text-xs justify-around">
            {yAccessors.map((yAccessor, index) => (
                <div
                    key={index}
                    style={yAccessor.isVisible ? { cursor: "pointer", opacity: "1" } : { cursor: "pointer", opacity: "0.3" }}
                    onClick={() => toggleAccessorVisibility(yAccessor)}
                >
                    {yAccessor.isVisible ? (
                        <div className={`flex ${index === 0 ? "text-black" : "text-white"}`}>
                            <AiFillEye />
                            <p>{yAccessor.legend}</p>
                        </div>
                    ) : (
                        <div className={`flex ${index === 0 ? "text-black" : "text-white"}`}>
                            <AiFillEyeInvisible />
                            <p>{yAccessor.legend}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

