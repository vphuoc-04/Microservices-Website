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

export interface CustomTableProps extends SheetProps {
    data: any,
    isLoading: boolean,
    isError: boolean,
    model: string,
    tableColumn: Array<{ name: string; render: (item: any) => JSX.Element }>,
    checkedState: { [key:number]  : boolean },
    checkedAllState: boolean,
    handleCheckedChange: (id: number) => void
    handleCheckedAllChange: () => void,
    remove: (id: number) => Promise<any>
}