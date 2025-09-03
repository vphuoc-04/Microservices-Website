import { useCallback, useState } from "react"
import { useMutation } from "react-query"

const useDialog = () => {
    const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false)
    const [currentAction, setCurrentAction] = useState<{id: string, callback: Function} | null>(null)

    const openAlertDialog = useCallback((id: string, callback: Function) => {
        setCurrentAction({id, callback})
        setAlertDialogOpen(true)
    }, [])

    const closeAlertDialog = useCallback(() => {
        setAlertDialogOpen(false)
    }, [])

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            if (currentAction?.callback) {
                return currentAction.callback(id)
            }
            return null
        },
        onSuccess: () => {
            closeAlertDialog()
            setCurrentAction(null)
        },
        onError: (error: any) => {
            console.log(error);   
        }
    })

    const confirmAction = useCallback(() => {
        if (currentAction) {
            mutation.mutate(Number(currentAction.id))
        }

    }, [currentAction])


    return {
        alertDialogOpen,
        openAlertDialog,
        closeAlertDialog,
        confirmAction,
        setCurrentAction
    }
}

export default useDialog