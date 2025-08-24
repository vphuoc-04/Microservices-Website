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

interface CustmAlertDialogProps {
    isOpen: boolean,
    title: string,
    description: string,
    closeAlertDialog: () => void,
    confirmAction: () => void
}

const CustomAlertDialog = ({isOpen, title, description, closeAlertDialog, confirmAction}: CustmAlertDialogProps) => {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                    </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={closeAlertDialog}>Thoát</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmAction}>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CustomAlertDialog