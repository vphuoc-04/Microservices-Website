import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

import { CustomAlertDialogProps } from "@/interfaces/BaseServiceInterface"

const CustomAlertDialog = ({
    isOpen, 
    title, 
    description, 
    closeAlertDialog, 
    confirmAction,
    isDialogLoading
}: CustomAlertDialogProps) => {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                    </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={closeAlertDialog}>Thoát</AlertDialogCancel>
                    <AlertDialogAction disabled={isDialogLoading} onClick={confirmAction}>
                        {isDialogLoading ? <div className="spinner"></div> : null}
                        {isDialogLoading ? 'Đang xử lý' : 'Thực hiện'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CustomAlertDialog