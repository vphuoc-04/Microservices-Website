import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { FilterProps } from "@/interfaces/BaseServiceInterface"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
import { perpages, publishs } from "@/constants/generals"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import useFilterAction from "@/hooks/useFilterAction"
import CustomAlertDialog from "./CustomAlertDialog"

const Filter = ({ isAnyChecked, checkedState, model, refetch }: FilterProps) => {
    const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false)
    const [actionSelectedValue, setActionSelectedValue] = useState<string>('')
    const { actionSwitch } = useFilterAction();

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

    useEffect(() => {
        console.log(checkedState)
    }, [checkedState])

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

                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="mr-[15px]">
                            {isAnyChecked && (
                                <Select onValueChange={(value) => openAlertDialog(value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Chọn thao tác" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="deleteMany">
                                            <div className="">
                                                Xóa
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="publish|2">
                                            <div className="">
                                                Xuất bản
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="publish|1">
                                            <div className="">
                                                Ngừng xuất bản
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        <div className="mr-[15px]">
                            <Select>
                                <SelectTrigger className="w-[180px]">
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
                            <Select>
                                <SelectTrigger className="w-[180px]">
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
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mr-[10px] flex gap-3">
                            <Input placeholder="Nhập nội dung..."></Input>
                        </div>
                    </div>
                    <div>
                        <Button className="bg-teal-600 cursor-pointer">
                            <Link to="users/add_user" className="text-whte flex justify-between items-center gap-1">
                                <FaPlus />Thêm thành viên mới
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Filter