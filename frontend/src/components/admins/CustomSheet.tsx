import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface CustomSheetProps {
    title: string | undefined,
    description: string | undefined,
    children: any,
    className: string | undefined
    isSheetOpen: boolean,
    closeSheet: () => void,
}

const CustomSheet = ({title, description, children, className, isSheetOpen, closeSheet}: CustomSheetProps) => {
    return (
        <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
            <SheetContent className={`${className ?? ''} overflow-y-scroll`}>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>
                        {description}
                    </SheetDescription>
                {children}
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default CustomSheet