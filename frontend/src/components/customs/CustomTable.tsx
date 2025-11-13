import React, { useEffect, useState } from "react";

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
import CustomAlertDialog from "@/components/customs/CustomAlertDialog";
import CustomDialog from "@/components/customs/CustomDialog";

// Hooks
import useColumnState from "@/hooks/useColumnState";
import useDialog from "@/hooks/useDialog";

// Types
import { ButtonAction, CustomTableProps } from "@/interfaces/BaseServiceInterface";

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
    changePassword,
    refetch,
    actions = [],
    ...restProps
}: CustomTableProps) => {
    const { columnState, handleChecked, setInitialColumnState } = useColumnState();
    const { alertDialogOpen, openAlertDialog, closeAlertDialog, confirmAction, isLoading: isDialogLoading } = useDialog(refetch);

    const [DialogComponent, setDialogComponent] = useState<React.ComponentType<any> | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [currentAction, setCurrentAction] = useState<{ action: ButtonAction; row: any } | null>(null);

    const handleAlertDialog = (id: string, callback: any) => {
        openAlertDialog(id, callback);
    };

    const handleDialog = (id: string, callback: Function, Component: React.ComponentType<any>) => {
        setDialogComponent(() => (props: any) => <Component id={id} callback={callback} close={() => setIsDialogOpen(false)} {...props} />);
        setIsDialogOpen(true);
    };

    const getParamValue = (param: string, row: any, action: ButtonAction) => {
        if (param.endsWith(':f')) {
            const functionName = param.slice(0, -2);
            
        
            switch (functionName) {
                case 'openSheet':
                    return openSheet;
                case 'handleAlertDialog':
                    return handleAlertDialog;
                case 'remove':
                    return remove;
                case 'changePassword':
                    return changePassword;
                case 'handleDialog':
                    return handleDialog;
                default:
                    return restProps?.[functionName];
            }
        } else if (param.endsWith(':c')) {
            return action.component;
        } else {
            return row[param];
        }
    };

    const handleButtonClick = (action: ButtonAction, row: any, event: React.MouseEvent) => {
        event.stopPropagation();

        if (action.confirmMessage) {
            setCurrentAction({ action, row });
            openAlertDialog(row.id, () => executeAction(action, row));
            return;
        }

        executeAction(action, row);
    };

    const executeAction = (action: ButtonAction, row: any) => {
        if (action.onClick && action.params) {
            const args = action.params.map(param => 
                getParamValue(param as string, row, action)
            );
            
            action.onClick(...args);
        }
        setCurrentAction(null);
    };

    const shouldShowAction = (action: ButtonAction, row: any): boolean => {
        if (action.isVisible) {
            return action.isVisible(row);
        }
        return true;
    };

    const isActionDisabled = (action: ButtonAction, row: any): boolean => {
        if (action.isDisabled) {
            return action.isDisabled(row);
        }
        return false;
    };

    useEffect(() => {
        if (!isLoading && Array.isArray(data?.[model])) {
            setInitialColumnState(data[model], "publish");
        }
    }, [isLoading, data, model]);

    const colSpan = tableColumn ? tableColumn.length + 3 : 3;

    return (
        <>
            <Table className="table-auto w-full border">
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Checkbox 
                                className="border-teal-600" 
                                checked={checkedAllState}
                                onCheckedChange={handleCheckedAllChange}
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
                            <TableCell colSpan={colSpan} className="text-center">
                                <div className="flex items-center justify-center gap-2 py-4">
                                    <div className="spinner"></div>
                                    <span className="text-gray-600">Loading...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={colSpan} className="text-center">
                                Có vấn đề xảy ra trong quá trình truy xuất dữ liệu. Hãy thử lại sau.
                            </TableCell>
                        </TableRow>
                    ) : !data[model] || data[model].length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={colSpan} className="text-center">
                                Không có dữ liệu tồn tại
                            </TableCell>
                        </TableRow>
                    ) : (
                        data[model].map((row: any, index: number) => (
                            <TableRow key={index} className={checkedState[row.id] ? 'bg-[#ffc]' : ''}>
                                <TableCell>
                                    <Checkbox 
                                        className="border-teal-600" 
                                        checked={checkedState[row.id] || false}
                                        onCheckedChange={() => handleCheckedChange(row.id)}
                                    />
                                </TableCell>

                                {tableColumn.map((column, idx) => (
                                    <TableCell key={idx} className={column.className}>
                                        {column.render(row)}
                                    </TableCell>
                                ))}

                                <TableCell className="text-center">
                                    <Switch
                                        value={row.id} 
                                        checked={columnState[row.id]?.publish ?? false} 
                                        onCheckedChange={() => handleChecked(row.id, 'publish')} 
                                    />
                                </TableCell>
                                <TableCell className="flex justify-center gap-1">
                                    {actions.filter(action => shouldShowAction(action, row)).map((action, actionIndex) => (
                                        <Button 
                                            key={actionIndex} 
                                            className={`${action.className} p-[10px] cursor-pointer`}
                                            disabled={isActionDisabled(action, row)}
                                            onClick={(e) => handleButtonClick(action, row, e)}
                                            title={action.method}
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
                title={currentAction?.action.confirmMessage ? currentAction.action.confirmMessage : "Bạn có chắc chắn muốn thực hiện chức năng này?"}
                description="Thao tác này không thể hoàn tác. Thao tác này sẽ xóa vĩnh viễn tài khoản của bạn và xóa dữ liệu của bạn khỏi máy chủ của chúng tôi."
                closeAlertDialog={() => {
                    closeAlertDialog();
                    setCurrentAction(null);
                }}
                confirmAction={() => {
                    if (currentAction) {
                        executeAction(currentAction.action, currentAction.row);
                    }
                    confirmAction();
                }}
                isDialogLoading={isDialogLoading}
            />

            {isDialogOpen && DialogComponent && (
                <CustomDialog 
                    title="Khôi phục mật khẩu"
                    description="Tính năng này cho phép thay đổi mật khẩu của người dùng."
                    open={isDialogOpen}
                    close={() => setIsDialogOpen(false)}
                >
                    {React.createElement(DialogComponent)}
                </CustomDialog>
            )}
        </>
    );
};

export default CustomTable;