import { Option } from "@/components/customs/CustomSelectBox"
import { SelectBoxItem } from "@/interfaces/BaseServiceInterface"
import { useCallback, useState } from "react"

const useSelectedBox = (initialSelectBoxs: SelectBoxItem[]) => {
    const [selectBox, setSelectBox] = useState<SelectBoxItem[]>(initialSelectBoxs)
    
    const updateSelectedBoxValue = useCallback((name: string, options: Option[], values: string | string[] | undefined) => {
        setSelectBox(prevSelectedBox => 
            prevSelectedBox.map(item => {
                if (item.name === name) {
                    if (values === undefined) {
                        return { ...item, value: item.multiple ? [] : null }
                    }
                    
                    if (Array.isArray(values)) {
                        // Multiple selection
                        const selectedOptions = options.filter((option: Option) => 
                            values.includes(option.value)
                        )
                        return { ...item, value: selectedOptions }
                    } else {
                        // Single selection
                        const selectedOption = options.find((option: Option) => option.value === values)
                        return { ...item, value: selectedOption || null }
                    }
                }
                return item
            })
        )
    }, [])

    const updateSelectedBoxOptions = useCallback((name: string, newOptions: Option[] | []) => {
        setSelectBox(prevSelectedBox => 
            prevSelectedBox.map(item => 
                item.name === name
                ? { ...item, options: newOptions } 
                : item
            )
        )
    }, [])

    return { selectBox, updateSelectedBoxValue, updateSelectedBoxOptions }
}

export default useSelectedBox