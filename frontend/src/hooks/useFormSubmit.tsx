import { useState } from "react"
import { FieldValues, SubmitHandler } from "react-hook-form"
import { useMutation } from "react-query"

type SubmitFunction<T extends FieldValues> = (data: T) => Promise<void>

const useFormSubmit = <T extends FieldValues, >(submitFunc: SubmitFunction<T>) => {
    const [loading, setLoading] = useState<boolean>(false)

    const munation = useMutation<void, Error, T>({
        mutationFn: submitFunc,
        onSuccess: () => {
            console.log('Khởi tạo dữ liệu thành công');
        },
        onError: (error) => {
            console.error('Lỗi: ', error);
        }
    })

    const onSubmitHandler: SubmitHandler<T> = async (payload) => {
        // try {
        //     console.log(payload);
            

        // } catch (error) {
        //     console.log(error);
            

        // } finally {


        // }
        console.log(payload);
        
        munation.mutate(payload)
    }

    return {
        onSubmitHandler,
        success: munation.isSuccess,
        loading: munation.isLoading
    }
}

export default useFormSubmit