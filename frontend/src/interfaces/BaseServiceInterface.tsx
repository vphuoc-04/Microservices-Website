import { Option } from "@/components/customs/CustomSelectBox"
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

export interface FilterSetting {
    field: string;
    type: 'select' | 'input' | 'date' | 'number';
    placeholder: string;
    options?: Array<{ id: string | number; name: string }>;
    dataSource?: 'static' | 'api';
    apiEndpoint?: string;
    dependsOn?: string;
}

export interface ActionSetting {
    value: string;
    label: string;
    method: string;
    requiresSelection: boolean;
    confirmMessage?: string;
}

export interface ModelFilterConfig {
    model: string;
    filters: FilterSetting[];
    actions: ActionSetting[];
    createButton?: {
        label: string;
        icon: JSX.Element;
    };
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
    remove?: (id: string) => Promise<any>,
    changePassword?: (id: string, payload: { newPassword: string, confirmPassword: string }) => Promise<any>,
    refetch: any,
    [key: string]: any   
    restProps?: Record<string, any>
}

export interface SelectBoxItem {
    title: string | undefined,
    placeholder: string | undefined,
    options: Option[],
    value: Option | Option[] | null, // Hỗ trợ cả single và multiple
    rules: object,
    name: string,
    control: any,
    errors: any,
    multiple?: boolean, // Thêm prop multiple
    onSelectedChange?: (value: string | string[] | undefined) => void, // Hỗ trợ string[]
    isLoading?: boolean
}