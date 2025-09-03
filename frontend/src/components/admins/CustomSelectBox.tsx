import Select from "react-select"
import { Label } from "@/components/ui/label"
import { Controller } from "react-hook-form"

interface Option {
    id?: number,
    value: string,
    label: string
}

interface CustomSelectBoxProps {
    title: string | undefined,
    placeholder: string | undefined,
    options: Option[],
    onSelectChange?: (value: string | undefined) => void,
    isLoading?: boolean,
    rules?: object,
    name: string
    register?: any,
    control: any,
    errors: any
}

const CustomSelectBox = ({
    title, 
    placeholder, 
    options, 
    onSelectChange, 
    isLoading,  
    register, 
    rules,
    name,
    control,
    errors,
}: CustomSelectBoxProps) => {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-left">{title}</Label>

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value } }) => (
                    <Select
                        options={isLoading ? [] : options}
                        className="col-span-3"
                        placeholder={placeholder}
                        value={options.find(option => option.value === value) || null} 
                        onChange={(selectedValue) => {
                            console.log({ [name]: selectedValue?.value })
                            onChange(selectedValue?.value)
                            onSelectChange && onSelectChange(selectedValue?.value)
                        }}
                        isLoading={isLoading}
                    />
                )}
            />

            <div className="error-line text-right">
                {errors[name] && <span className="text-red-500 text-[12px]">{errors[name].message}</span>}
            </div>
        </div>
    )
}

export default CustomSelectBox