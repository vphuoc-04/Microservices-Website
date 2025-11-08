import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Components
import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput";

// Helpers
import { showToast } from "@/helpers/myHelper";
import { handleAxiosError } from "@/helpers/axiosHelper";

type Inptus = {
    newPassword: string,
    confirmPassword: string,
}

interface RecoveryProps {
    id: string,
    callback: Function,
    [key: string]: any
}

const Recovery = ({ id, callback, ...restProps }: RecoveryProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Inptus>();

    const changePasswordHandler: SubmitHandler<Inptus> = async(payload) => {
        try {
            const response = await callback(id, payload);
            if (response.data === 'success') {
                showToast(response.message, response.data === 'success' ? 'success' : 'error')
                reset()
                restProps.close()
            }

        } catch (error) {
            handleAxiosError(error)
            console.log(error);
            
        } finally {
            setIsLoading(false)
        }
        
    }

    return (
        <form onSubmit={handleSubmit(changePasswordHandler)}>
            <div className="grid gap-4 py-4">
                <CustomInput 
                    register={register}
                    errors={errors}
                    label="Nhập mật khẩu mới"
                    name="newPassword"
                    type="password"
                    rules={{ required: 'Bạn chưa nhập mật khẩu mới' }}
                    defaultValue=""
                />

                <CustomInput 
                    register={register}
                    errors={errors}
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    type="password"
                    rules={{ required: 'Bạn chưa nhập lại mật khẩu mới' }}
                    defaultValue=""
                />

                <CustomButton loading={isLoading} text="Lưu thay đổi" />
            </div>
        </form>
    )
}

export default Recovery