import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface CustomInputProps {
    label: string,
    name: string,
    type: string | undefined,
    register: any,
    errors: any,
    rules?: object,
    defaultValue?: string
    disabled?: boolean
}

const CustomInput = ({ label, name, type, errors, register, rules, defaultValue, disabled}: CustomInputProps) => {
    return (
        <>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={name} className="text-left">{label}</Label>
                <Input 
                        name={name}
                        type={type ?? 'text'} 
                        id={name} 
                        className="col-span-3" 
                        {...register(name, rules)}
                        defaultValue={defaultValue || ''}
                        disabled={disabled}
                    />
            </div>
            <div className="error-line text-right">
                {errors?.[name] && <span className="text-red-500 text-[12px]">{errors[name]?.message}</span>}
            </div>
        </>
    )
}

export default CustomInput