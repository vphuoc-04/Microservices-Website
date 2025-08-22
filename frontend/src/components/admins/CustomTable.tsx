import { JSX, useEffect, useState } from "react";

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";


import useColumnState from "@/hooks/useColumnState";
import { buttonActions } from "@/services/UserService";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Switch } from "../ui/switch";

interface CustomTableProps {
    data: any,
    isLoading: boolean,
    isError: boolean,
    model: string,
    tableColumn: Array<{ name: string; render: (item: any) => JSX.Element }>,
    checkedState: { [key:number]  : boolean },
    checkedAllState: boolean,
    handleCheckedChange: (id: number) => void
    handleCheckedAllChange: () => void
}

const CustomTable = ({ 
    isLoading, 
    data, 
    isError, 
    model, 
    tableColumn,
    checkedState,
    checkedAllState,
    handleCheckedChange,
    handleCheckedAllChange
} : CustomTableProps) => {
    const { columnState, handleChecked, setInitialColumnState } = useColumnState();

    useEffect(() => {
        if (!isLoading && Array.isArray(data?.[model])) {
            setInitialColumnState(data[model], "publish");
        }
    }, [isLoading, data, model]);

    return (
        <Table>
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
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={9}>
                            <div className="flex items-center justify-center gap-2 py-4">
                                <div className="spinner"></div>
                                <span className="text-gray-600">Loading...</span>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : isError ? (
                    <TableRow>
                        <TableCell colSpan={9}>
                            Có vấn đề xảy ra trong quá trình truy xuất dữ liệu. Hãy thử lại sau.
                        </TableCell>
                    </TableRow>
                ) : data[model] && data[model].map((row: any, index: number) => (
                    <TableRow key={index} className={ checkedState[row.id] ? 'bg-[#ffc]' : '' }>
                        <TableCell>
                            <Checkbox 
                                className="border-gray-400" 
                                checked = { checkedState[row.id] || false }
                                onCheckedChange={() => handleCheckedChange(row.id)}
                            />
                        </TableCell>
                        {tableColumn && tableColumn.map((column, idx) => (
                            <TableCell key={idx}>{column.render(row)}</TableCell>
                        ))}
                        <TableCell className="text-center">
                            <Switch 
                                value={row.id} 
                                checked={columnState[row.id]?.publish ?? false} 
                                onCheckedChange={() => handleChecked(row.id, 'publish')} 
                            />
                        </TableCell>
                        <TableCell className="flex">
                            {buttonActions && buttonActions.map((action, index) => (
                                <Button key={index} className={`${action.className} p-0`}>
                                    <Link className="block p-[10px]" to={`${action.path}/${row.id}`}>{action.icon}</Link>
                                </Button>
                            ))}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default CustomTable;
