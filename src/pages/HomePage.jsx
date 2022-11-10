import axios from "../axios"
import { useEffect } from "react"

export const HomePage = () => {

    useEffect(() => {
        console.log(process.env)
        const getFinancialData = async () => {
            try {
                const response = await axios.get("/api")
                console.log(response.data)
                
            } catch (error) {
                console.log(error)
            }
        }
        getFinancialData()
    }, [])


    return (
        <div>

        </div>
    )
}
