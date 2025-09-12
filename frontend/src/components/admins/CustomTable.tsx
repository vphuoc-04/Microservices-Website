import React, { useEffect } from "react";

// Components
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import CustomAlertDialog from "@/components/admins/CustomAlertDialog";

// Hooks
import useColumnState from "@/hooks/useColumnState";
import useDialog from "@/hooks/useDialog";

// Settings
import { buttonActions, ParamsToTuple, Row } from "@/settings/user";

// Interfaces
import { CustomTableProps } from "@/interfaces/BaseServiceInterface";


const CustomTable = ({ 
    isLoading, 
    data, 
    isError, 
    model, 
    tableColumn,
    checkedState,
    checkedAllState,
    handleCheckedChange,
    handleCheckedAllChange,
    openSheet,
    remove,
    refetch
} : CustomTableProps) => {
    const { columnState, handleChecked, setInitialColumnState } = useColumnState();
    const { alertDialogOpen, openAlertDialog, closeAlertDialog, confirmAction, isLoading: isDialogLoading } = useDialog(refetch);

    const handleAlertDialog = (id: string, callback: (id: number) => Promise<any>) => {
        openAlertDialog(id, callback) 
    }

    useEffect(() => {
        if (!isLoading && Array.isArray(data?.[model])) {
            setInitialColumnState(data[model], "publish");
        }
    }, [isLoading, data, model]);

    return (
        <>
            <Table className="border-[1px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Checkbox 
                                className="border-black" 
                                checked={checkedAllState}
                                onCheckedChange={() => handleCheckedAllChange()}
                            />
                        </TableHead>
                        {tableColumn && tableColumn.map((column, index) => (
                            <TableHead key={index}>{column.name}</TableHead>
                        ))}
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-center">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={12}  className="text-center">
                                <div className="flex items-center justify-center gap-2 py-4">
                                    <div className="spinner"></div>
                                    <span className="text-gray-600">Loading...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={12}  className="text-center">
                                Có vấn đề xảy ra trong quá trình truy xuất dữ liệu. Hãy thử lại sau.
                            </TableCell>
                        </TableRow>
                    ) : !data[model] || data[model].length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={12}  className="text-center">
                                Không có dữ liệu tồn tại
                            </TableCell>
                        </TableRow>
                    ) : (
                        data[model] && data[model].map((row: any, index: number) => (
                            <TableRow key={index} className={ checkedState[row.id] ? 'bg-[#ffc]' : '' }>
                                <TableCell>
                                    <Checkbox 
                                        className="border-gray-400" 
                                        checked = { checkedState[row.id] || false }
                                        onCheckedChange={() => handleCheckedChange(row.id)}
                                    />
                                </TableCell>

                                {tableColumn && tableColumn.map((column, idx) => (
                                    <TableCell key={idx} className={column.className}>{column.render(row)}</TableCell>
                                ))}

                                <TableCell className="text-center">
                                    <Switch
                                        value={row.id} 
                                        checked={columnState[row.id]?.publish ?? false} 
                                        onCheckedChange={() => handleChecked(row.id, 'publish')} 
                                    />
                                </TableCell>
                                <TableCell className="flex justify-center">
                                    {buttonActions && buttonActions.map((action, index) => (
                                        <Button 
                                            key={index} className={`${action.className} p-[10px] cursor-pointer`} 
                                            onClick={
                                                action.onClick && action.params ? (e: React.
                                                MouseEvent<HTMLButtonElement>) => {
                                                    const args = action.params?.map(param =>{
                                                        if (typeof param === 'string' && param.endsWith(':f')) {
                                                            return eval(param.slice(0, -2))
                                                        } else {
                                                            return row[param as keyof Row]
                                                        }
                                                    }) as ParamsToTuple<typeof action.params>
                                                    
                                                    if (action.onClick) {
                                                        action.onClick(...args)
                                                    }
                                                    
                                                }: undefined}
                                        >
                                            {action.icon}
                                        </Button>
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <CustomAlertDialog 
                isOpen={alertDialogOpen}
                title="Bạn có chắc chắn muốn thực hiện chức năng này?"
                description="Thao tác này không thể hoàn tác. Thao tác này sẽ xóa vĩnh viễn tài khoản của bạn
                và xóa dữ liệu của bạn khỏi máy chủ của chúng tôi."
                closeAlertDialog={closeAlertDialog}
                confirmAction={() => confirmAction()}
                isDialogLoading={isDialogLoading}
            />
        </>
    )
}

export default CustomTable;
