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
        <div className="w-full flex text-[0.6rem] xs:text-xs justify-around">
            {yAccessors.map((yAccessor, index) => (
                <div
                    key={index}
                    className={`flex items-center justify-center gap-2 cursor-pointer rounded-md p-1 px-3 ${yAccessor.isVisible ? "opacity-100" : "opacity-30"} ${index === 0 ? "text-black" : "text-white"}`}
                    onClick={() => toggleAccessorVisibility(yAccessor)}
                    style={{ backgroundColor: yAccessor.color }}
                >
                    <div className={`flex items-center gap-1 ${index === 0 ? "text-black" : "text-white"}`}>
                        {yAccessor.isVisible ? (
                            <>
                                <AiFillEye />
                                <p>{yAccessor.legend}</p>
                            </>
                        ) : (
                            <>
                                <AiFillEyeInvisible />
                                <p>{yAccessor.legend}</p>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

