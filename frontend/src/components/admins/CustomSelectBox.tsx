import Select from "react-select"
import { Label } from "@/components/ui/label"
import { Controller } from "react-hook-form"
import { useEffect, useState } from "react"

export interface Option {
    id: number
    value: string
    label: string
}

interface CustomSelectBoxProps {
    title: string | undefined
    placeholder: string | undefined
    options: Option[]
    value: Option | null
    onSelectChange?: (value: string | undefined) => void
    isLoading?: boolean
    rules?: object
    name: string
    register?: any
    control: any
    errors: any
    action?: string   
}

const CustomSelectBox = ({
    title,
    placeholder,
    options = [],
    onSelectChange,
    isLoading,
    register,
    rules,
    name,
    control,
    errors,
    value,
    action,
}: CustomSelectBoxProps) => {
    const [selectedValue, setSelectedValue] = useState<Option | null>(value)

    useEffect(() => {
        if (value) {
        setSelectedValue(value)
            if (onSelectChange) {
                onSelectChange(value.value)
            }
        }
    }, [value])

    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-left">
                {title}
            </Label>

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange } }) => (
                    // <Select
                    //     options={action === "update" && isLoading ? [] : options}
                    //     className="col-span-3"
                    //     placeholder={placeholder}
                    //     value={selectedValue || null}
                    //     onChange={(selected) => {
                    //     setSelectedValue(selected)
                    //     onChange(selected?.value)
                    //     if (onSelectChange) {
                    //         onSelectChange(selected?.value)
                    //     }
                    //     }}
                    //     isLoading={action === "update" && isLoading}
                    // />
                    <Select
                        options={options} 
                        className="col-span-3"
                        placeholder={placeholder}
                        value={selectedValue || null}
                        onChange={(selected) => {
                            setSelectedValue(selected)
                            onChange(selected?.value)
                            if (onSelectChange) {
                                onSelectChange(selected?.value)
                            }
                        }}
                        isLoading={isLoading} 
                    />
                )}
            />

            <div className="error-line text-right">
                {errors[name] && (
                <span className="text-red-500 text-[12px]">
                    {errors[name].message}
                </span>
                )}
            </div>
        </div>
    )
}

export default CustomSelectBox
