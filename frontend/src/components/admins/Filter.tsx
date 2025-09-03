import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { FilterProps } from "@/interfaces/BaseServiceInterface"
import { Button } from "../ui/button"
import { FaPlus } from "react-icons/fa"
import { genders, perpages, publishs, sorts } from "@/constants/generals"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import useFilterAction from "@/hooks/useFilterAction"
import CustomAlertDialog from "./CustomAlertDialog"
import useDebounce from "@/hooks/useDebounce"
import useCatalogue from "@/hooks/useCatalogue"


interface FilterInterface {
    perpage: string | number,
    publish: string | number,
    userCatalogueId: string | number,
    gender: string | number,
    sort: string | number
}

const Filter = ({ isAnyChecked, checkedState, model, refetch, handleQueryString, openSheet }: FilterProps) => {
    const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false)
    const [actionSelectedValue, setActionSelectedValue] = useState<string>('')
    const [filters, setFilters] = useState<FilterInterface>({
        perpage: '',
        publish: 0,
        userCatalogueId: 0,
        gender: 0,
        sort: 'id,asc'
    })
    const [keyword, setKeyword] = useState<string>('')

    const { actionSwitch } = useFilterAction();
    const catalogues = useCatalogue()

    const openAlertDialog = (value: string) => {
        setAlertDialogOpen(true)
        setActionSelectedValue(value)
    }

    const closeAlertDialog = () => {
        setAlertDialogOpen(false)
        setActionSelectedValue('')
    }

    const confirmAction = (value: string): void => {
        const [action, selectedValue] = value.split('|');
        actionSwitch(action, selectedValue, { checkedState }, model, refetch)
        closeAlertDialog()
    }

    const { debounce } = useDebounce()

    const debounceInput = debounce((value: string) => {
        setKeyword(value)
    }, 300)

    useEffect(() => {
        handleQueryString({...filters, keyword: keyword})
    }, [keyword])


    const handleFilter = (value: string, field: string) => {
        setFilters(prevFilters => ({...prevFilters, [field]: value}))
    }

    useEffect(() => {
        console.log(checkedState)
    }, [checkedState])

    useEffect(() => {
        handleQueryString({...filters})
    }, [filters])

    return (
        <>
            <div className="mb-[15px]">
                <CustomAlertDialog 
                    isOpen={alertDialogOpen}
                    title="Bạn có chắc chắn muốn thực hiện chức năng này?"
                    description="Thao tác này không thể hoàn tác. Thao tác này sẽ xóa vĩnh viễn tài khoản của bạn
                    và xóa dữ liệu của bạn khỏi máy chủ của chúng tôi."
                    closeAlertDialog={closeAlertDialog}
                    confirmAction={() => confirmAction(actionSelectedValue)}
                />
                <div className="flex justify-between items-start flex-wrap gap-35">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-4 flex-1">
                        <div className="mr-[15px]">
                            <Select onValueChange={(value) => openAlertDialog(value)} disabled={!isAnyChecked}>
                                <SelectTrigger className="w-[160px]" disabled={!isAnyChecked}>
                                    <SelectValue placeholder="Chọn thao tác" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="deleteMany">
                                        <div className="">Xóa</div>
                                    </SelectItem>
                                    <SelectItem value="publish|2">
                                        <div className="">Xuất bản</div>
                                    </SelectItem>
                                    <SelectItem value="publish|1">
                                        <div className="">Ngừng xuất bản</div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mr-[15px]">
                            <Select onValueChange={(value) => handleFilter(value, 'perpage')}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Chọn số bản ghi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {perpages && perpages.map((perpage, index) => (
                                        <SelectItem key={index} value={perpage}>{perpage} bản ghi</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mr-[15px]">
                            <Select onValueChange={(value) => handleFilter(value, 'publish')}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    {publishs && publishs.map((publish, index) => (
                                        <SelectItem key={index} value={String(publish.id)}>{publish.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mr-[15px]">
                            <Select onValueChange={(value) => handleFilter(value, 'userCatalogueId')}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    {catalogues && catalogues.map((catalogue, index) => (
                                        <SelectItem key={index} value={String(catalogue.id)}>{catalogue.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mr-[15px]">
                            <Select onValueChange={(value) => handleFilter(value, 'sort')}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Sắp xếp" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sorts && sorts.map((sort, index) => (
                                        <SelectItem key={index} value={String(sort.id)}>{sort.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mr-[15px]">
                            <Select onValueChange={(value) => handleFilter(value, 'gender')}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    {genders && genders.map((gender, index) => (
                                        <SelectItem key={index} value={String(gender.id)}>{gender.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mr-[10px] flex gap-3">
                            <Input 
                                placeholder="Tìm kiếm..."
                                onChange={(e) => debounceInput(e.target.value, 'keyword')}         
                            />
                        </div>
                    </div>
                    <div className="shrink-0">
                        <Button 
                            className="bg-teal-600 cursor-pointer text-white flex justify-between items-center gap-1" 
                            onClick={() =>openSheet({ open: true, action: '', id: null })}
                        >
                            <FaPlus />Thêm thành viên mới
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Filter