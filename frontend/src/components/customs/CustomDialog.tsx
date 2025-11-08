import { ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

interface CustomDialogProps {
    title: string,
    description: string,
    children: ReactNode,
    open: boolean,
    close: () => void
}

const CustomDialog = ({ title, description, children, open, close }: CustomDialogProps) => {
    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    {children}

                    <DialogFooter>
                        <DialogClose asChild onClick={close}>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CustomDialog