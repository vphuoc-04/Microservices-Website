import { FieldValues, SubmitHandler } from "react-hook-form"
import { useMutation } from "react-query"

// Helpers
import { showToast } from "@/helpers/myHelper"

type SubmitFunction<T extends FieldValues> = (data: T, updateParams: { action: string, id: string | null }) => Promise<any>

const useFormSubmit = <T extends FieldValues, >(
    submitFunc: SubmitFunction<T>, 
    refetch: any, 
    closeSheet: () => void,
    updateParams: { action: string, id: string | null }
) => {
    const munation = useMutation<any, Error, T>({
        mutationFn: (payload) => submitFunc(payload, updateParams),
        onSuccess: (response: any) => {
            closeSheet()
            showToast((response && (response.message || response?.data?.message)) || 'Thao tác thành công', 'success')
            refetch()
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi'
            showToast(message, 'error')
        }
    })

    const onSubmitHandler: SubmitHandler<T> = async (payload) => {
        munation.mutate(payload)
    }

    return {
        onSubmitHandler,
        success: munation.isSuccess,
        error: munation.isError,
        loading: munation.isLoading
    }
}

export default useFormSubmit