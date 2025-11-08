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
    value: Option | Option[] | null // Sửa để hỗ trợ cả single và multiple
    onSelectChange?: (value: string | string[] | undefined) => void // Sửa để hỗ trợ string[]
    isLoading?: boolean
    rules?: object
    name: string
    register?: any
    control: any
    errors: any
    action?: string
    multiple?: boolean // Thêm prop multiple
    disabled?: boolean // Thêm prop disabled
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
    multiple = false, // Mặc định là single select
    disabled = false,
}: CustomSelectBoxProps) => {
    const [selectedValue, setSelectedValue] = useState<Option | Option[] | null>(value)

    useEffect(() => {
        if (value) {
            setSelectedValue(value)
            // Không gọi onSelectChange ở đây vì sẽ gây vòng lặp vô hạn
        } else {
            setSelectedValue(multiple ? [] : null)
        }
    }, [value, multiple])

    const handleChange = (selected: any) => {
        if (multiple) {
            // Xử lý multiple selection
            const selectedOptions = selected as Option[] || []
            setSelectedValue(selectedOptions)
            
            const values = selectedOptions.map(option => option.value)
            if (onSelectChange) {
                onSelectChange(values.length > 0 ? values : undefined)
            }
        } else {
            // Xử lý single selection
            const selectedOption = selected as Option | null
            setSelectedValue(selectedOption)
            
            if (onSelectChange) {
                onSelectChange(selectedOption?.value)
            }
        }
    }

    const handleControllerChange = (onChange: (value: any) => void) => (selected: any) => {
        if (multiple) {
            const values = Array.isArray(selected) 
                ? selected.map(option => option?.value).filter(Boolean)
                : []
            onChange(values)
        } else {
            onChange(selected?.value)
        }
        handleChange(selected)
    }

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
                    <Select
                        options={options}
                        className="col-span-3"
                        placeholder={placeholder}
                        value={selectedValue}
                        onChange={handleControllerChange(onChange)}
                        isLoading={isLoading}
                        isMulti={multiple} // Sử dụng isMulti của react-select
                        isDisabled={disabled}
                        closeMenuOnSelect={!multiple} // Đóng menu khi chọn nếu là single select
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