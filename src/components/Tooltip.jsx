export const Tooltip = ({ tooltipSettings, tickFormat }) => {
    return (
        <aside className="absolute top-20 flex flex-col gap-1 rounded-md bg-slate-500 text-white p-1">
            <p>{`Ano: ${tooltipSettings.year}`}</p>
            {
                tooltipSettings && tooltipSettings.yAccessors.map((yAccessor, index) => {
                    if (yAccessor.isVisible) {
                        return (
                            <div key={index} className="flex gap-2 items-center">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: yAccessor.color }}></div>
                                {
                                    <p>
                                        {`${yAccessor.legend}: ${tickFormat(yAccessor.value)}`}
                                    </p>
                                }
                            </div>
                        )
                    }
                })
            }
        </aside>
    )
}
