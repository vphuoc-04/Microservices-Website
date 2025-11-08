import { Button } from "@/components/ui/button"

interface CustomButtonProps {
    loading: boolean,
    text: string,
    disabled?: boolean
}

const CustomButton = ({ loading, text, disabled = false }: CustomButtonProps) => {
    const isDisabled = loading || disabled
    
    return (
        <Button 
            className={`
                w-full py-2 rounded transition-colors
                ${isDisabled 
                  ? "bg-gray-400 text-gray-200 opacity-60 !cursor-not-allowed" 
                  : "bg-teal-500 text-white cursor-pointer hover:bg-teal-400"}
            `}
            type="submit"
            disabled={isDisabled}
            style={isDisabled ? { cursor: 'not-allowed' } : undefined}
        >
            {loading ? <div className="spinner"></div> : text}
        </Button>
    )
}

export default CustomButton