import { Option } from "@/components/admins/CustomSelectBox"
import { Sheet } from "@/hooks/useSheet"
import { JSX } from "react"

export interface SheetProps {
    openSheet: (sheet: Sheet) => void
}

export interface UpdateStatusByFieldParam {
    id: string | number,
    column: string,
    publish: string | number | boolean,
    model: string
}

export interface CheckedStateInterface {
    checkedState: { [key: number] : boolean }
}

export interface FilterProps extends CheckedStateInterface, SheetProps {
    isAnyChecked: boolean,
    model: string, 
    refetch: any,
    handleQueryString: any,
}

export interface CustomAlertDialogProps {
    isOpen: boolean,
    title: string,
    description: string,
    closeAlertDialog: () => void,
    confirmAction: () => void,
    isDialogLoading?: boolean
}

export interface CustomTableProps extends SheetProps {
    data: any,
    isLoading: boolean,
    isError: boolean,
    model: string,
    tableColumn: Array<{ name: string; className?: string, render: (item: any) => JSX.Element }>,
    checkedState: { [key:number]  : boolean },
    checkedAllState: boolean,
    handleCheckedChange: (id: number) => void
    handleCheckedAllChange: () => void,
    remove: (id: string) => Promise<any>,
    refetch: any
}

export interface SelectBoxItem {
    title: string | undefined,
    placeholder: string | undefined,
    options: Option[],
    value: Option | null,
    rules: object,
    name: string,
    control: any,
    errors: any,
    onSelectedChange?: (value: string | undefined) => void,
    isLoading?: boolean
}