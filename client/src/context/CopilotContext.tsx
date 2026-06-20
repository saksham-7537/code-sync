import { ICopilotContext } from "@/types/copilot"
import { createContext, ReactNode, useContext, useState } from "react"
import toast from "react-hot-toast"
import axiosInstance from "../api/groqApi"

const CopilotContext = createContext<ICopilotContext | null>(null)

export const useCopilot = () => {
    const context = useContext(CopilotContext)
    if (context === null) {
        throw new Error(
            "useCopilot must be used within a CopilotContextProvider",
        )
    }
    return context
}

const CopilotContextProvider = ({ children }: { children: ReactNode }) => {
    const [input, setInput] = useState<string>("")
    const [output, setOutput] = useState<string>("")
    const [isRunning, setIsRunning] = useState<boolean>(false)

    const generateCode = async () => {
        try {
            if (input.length === 0) {
                toast.error("Please write a prompt")
                return
            }

            toast.loading("Generating code...")
            setIsRunning(true)
            const response = await axiosInstance.post("/generate", {
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a code generator copilot for project named Code Sync. Generate code based on the given prompt without any explanation. Return only code in markdown format.",
                    },
                    {
                        role: "user",
                        content: input,
                    },
                ],
            })
            if (response.data) {
                toast.success("Code generated successfully")
                setOutput(response.data.output)
            }
            setIsRunning(false)
            toast.dismiss()
        } catch (error: any) {
            console.error(error?.response?.data || error)

            toast.error(
                error?.response?.data?.error || "Failed to generate code",
            )

            setIsRunning(false)
            toast.dismiss()
        }
    }

    return (
        <CopilotContext.Provider
            value={{
                setInput,
                output,
                isRunning,
                generateCode,
            }}
        >
            {children}
        </CopilotContext.Provider>
    )
}

export { CopilotContextProvider }
export default CopilotContext
