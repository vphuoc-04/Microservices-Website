import { Option } from "@/components/admins/CustomSelectBox"
import { SelectBoxItem } from "@/interfaces/BaseServiceInterface"
import { useCallback, useState } from "react"

const useSelectedBox = (initialSelectBoxs: SelectBoxItem[]) => {

    const [selectBox, setSelectBox] = useState<SelectBoxItem[]>(initialSelectBoxs)
    
    const updateSelectedBoxValue = useCallback((name: string, options: Option[], value: string | undefined) => {
        setSelectBox(prevSelectedBox => 
            prevSelectedBox.map(item => 
                item.name === name
                ? {...item, value: options.filter((option: Option) => option.value === value)[0] } 
                : item
            )
        )
    }, [])

    const updateSelectedBoxOptions = useCallback((name: string, newOptions: Option[] | []) => {
        setSelectBox(prevSelectedBox => 
            prevSelectedBox.map(item => 
                item.name === name
                ? {...item, options: newOptions } 
                : item
            )
        )
    }, [])

    return { selectBox, updateSelectedBoxValue, updateSelectedBoxOptions }
}

export default useSelectedBox