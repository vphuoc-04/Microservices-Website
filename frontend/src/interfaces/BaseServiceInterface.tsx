export interface UpdateStatusByFieldParam {
    id: string | number,
    column: string,
    publish: string | number | boolean,
    model: string
}

export interface CheckedStateInterface {
    checkedState: { [key: number] : boolean }
}

export interface FilterProps extends CheckedStateInterface {
    isAnyChecked: boolean,
    model: string, 
    refetch: any,
    handleQueryString: any
}