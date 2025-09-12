import { showToast } from "@/helpers/myHelper"
import { useCallback, useState } from "react"
import { useMutation } from "react-query"

const useDialog = (
    refetch: any,
    options?: { onSuccessCallback?: () => void }
) => {
    const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false)
    const [currentAction, setCurrentAction] = useState<{ id: string; callback: Function } | null>(null)

    const openAlertDialog = useCallback((id: string, callback: Function) => {
        setCurrentAction({ id, callback })
        setAlertDialogOpen(true)
    }, [])

    const closeAlertDialog = useCallback(() => {
        setAlertDialogOpen(false)
        mutation.reset()
    }, [])

    const mutation = useMutation({
        mutationFn: async (id: number) => {
        if (currentAction?.callback) {
            return currentAction.callback(id)
        }
        return null
        },
        onSuccess: (response: any) => {
            closeAlertDialog()
            setCurrentAction(null)
            const message = (response && (response.message || response?.data?.message)) || 'Thao tác thành công'
            showToast(message, "success")
            refetch()
            options?.onSuccessCallback?.()
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi'
            showToast(message, "error")
        },
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
        setCurrentAction,
        isLoading: mutation.isLoading,
    }
}

export default useDialog
