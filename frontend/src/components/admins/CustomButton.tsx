import { Button } from "@/components/ui/button"

interface CustomButtonProps {
    loading: boolean,
    text: string
}

const CustomButton = ({ loading, text }: CustomButtonProps) => {
    return (
        <Button 
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-400 cursor-pointer"
            type="submit"
            disabled={loading}
        >
            {loading ? <div className="spinner"></div> : text}
        </Button>
    )
}

export default CustomButton