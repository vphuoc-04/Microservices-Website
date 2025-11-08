import { useEffect, useState } from "react"

// Interfaces
import { FilterProps, FilterSetting, ModelFilterConfig } from "@/interfaces/BaseServiceInterface"

// Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "../ui/button"
import { Input } from "../ui/input"

import CustomAlertDialog from "@/components/customs/CustomAlertDialog"

// Hooks
import useFilterAction from "@/hooks/useFilterAction"
import useDebounce from "@/hooks/useDebounce"
import useCatalogue from "@/hooks/useCatalogue"
import useDialog from "@/hooks/useDialog"


interface FilterInterface {
    [key: string]: string | number;
}

interface CustomFilterProps extends FilterProps {
    filterConfig?: ModelFilterConfig | null;
}

const CustomFilter = ({ isAnyChecked, checkedState, model, refetch, handleQueryString, openSheet, filterConfig  }: CustomFilterProps ) => {
    const [filters, setFilters] = useState<FilterInterface>({})
    const [actionValue, setActionValue] = useState("")
    const [keyword, setKeyword] = useState<string>('')

    const { alertDialogOpen, openAlertDialog, closeAlertDialog, confirmAction, isLoading: isDialogLoading } = useDialog(refetch, {
        onSuccessCallback: () => setActionValue(""), 
    })
    
    const { actionSwitch } = useFilterAction();
    const catalogues = useCatalogue(true)
    const { debounce } = useDebounce()

    useEffect(() => {
        if (!filterConfig) return;

        const initialFilters: FilterInterface = {}
        filterConfig.filters.forEach(filter => {
            initialFilters[filter.field] = ''
        })
        setFilters(initialFilters)
    }, [filterConfig])

    const handleActionChange = (value: string) => {
        if (!filterConfig) return;

        const action = filterConfig.actions.find(a => a.value === value)
        if (!action) return

        if (action.confirmMessage) {
            openAlertDialog(value, (id: number) => {
                const [actionMethod, selectedValue] = value.split("|")
                return actionSwitch(actionMethod, selectedValue, { checkedState }, model, refetch)
            })
        } else {
            const [actionMethod, selectedValue] = value.split("|")
            actionSwitch(actionMethod, selectedValue, { checkedState }, model, refetch)
            setActionValue("")
        }
    }

    const debounceInput = debounce((value: string) => {
        setKeyword(value)
    }, 300)

    const buildQueryString = (filters: FilterInterface, keyword: string) => {
        const queryParams: Record<string, string | number> = {}
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '' && value !== 0) {
                queryParams[key] = value
            }
        })
        
        if (keyword && keyword.trim() !== '') {
            queryParams.keyword = keyword.trim()
        }
        
        return queryParams
    }

    useEffect(() => {
        const queryParams = buildQueryString(filters, keyword)
        handleQueryString(queryParams)
    }, [keyword, filters])

    const handleFilter = (value: string, field: string) => {
        setFilters(prevFilters => ({...prevFilters, [field]: value}))
    }

    const getFilterOptions = (filter: FilterSetting) => {
        switch (filter.dataSource) {
            case 'static':
                return filter.options || []

            case 'api':
                if (filter.field === 'userCatalogueId') {
                    return catalogues.map(cat => ({ id: cat.id, name: cat.label }))
                }

                return filter.options || []

            default:
                return filter.options || []
        }
    }

    const renderFilterComponent = (filter: FilterSetting) => {
        const options = getFilterOptions(filter)

        switch (filter.type) {
            case 'select':
                return (
                    <Select key={filter.field} onValueChange={(value) => handleFilter(value, filter.field)}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder={filter.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                        {options.map((option, index) => (
                            <SelectItem key={index} value={String(option.id)}>
                                {option.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                )
            
            case 'input':
                return (
                    <Input 
                        key={filter.field}
                        placeholder={filter.placeholder}
                        onChange={(e) => {
                            if (filter.field === 'keyword') {
                                debounceInput(e.target.value)
                            } else {
                                handleFilter(e.target.value, filter.field)
                            }
                        }}
                    />
                )
            
            default:
                return null
        }
    }

    if (!filterConfig) {
        return null
    }

    return (
        <>
            <div className="mb-[15px]">
                <CustomAlertDialog 
                    isOpen={alertDialogOpen}
                    title="Bạn có chắc chắn muốn thực hiện chức năng này?"
                    description="Thao tác này không thể hoàn tác. Thao tác này sẽ xóa vĩnh viễn tài khoản của bạn
                        và xóa dữ liệu của bạn khỏi máy chủ của chúng tôi."
                    closeAlertDialog={closeAlertDialog}
                    confirmAction={() => confirmAction()}
                    isDialogLoading={isDialogLoading}
                />
                
                <div className="flex justify-between items-start flex-wrap gap-35">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-4 flex-1">
                        {filterConfig.actions.length > 0 && (
                            <div className="mr-[15px]">
                                <Select value={actionValue} onValueChange={handleActionChange} 
                                    disabled={!isAnyChecked && filterConfig.actions.some(a => a.requiresSelection)}>
                                    <SelectTrigger className="w-[160px]" 
                                        disabled={!isAnyChecked && filterConfig.actions.some(a => a.requiresSelection)}>
                                        <SelectValue placeholder="Chọn thao tác" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filterConfig.actions.map((action, index) => (
                                            <SelectItem key={index} value={action.value} disabled={action.requiresSelection && !isAnyChecked}>
                                                <div className="">{action.label}</div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {filterConfig.filters.map(filter => (
                            <div key={filter.field} className="mr-[15px]">
                                {renderFilterComponent(filter)}
                            </div>
                        ))}
                    </div>

                    {filterConfig.createButton && (
                        <div className="shrink-0">
                            <Button 
                                className="bg-teal-600 cursor-pointer text-white flex justify-between items-center gap-1" 
                                onClick={() => openSheet({ open: true, action: '', id: null })}
                            >
                                {filterConfig.createButton.icon}
                                {filterConfig.createButton.label}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default CustomFilter