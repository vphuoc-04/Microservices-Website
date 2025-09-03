import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"

import { AvatarFallback } from "@radix-ui/react-avatar"

// Components
import CustomSelectBox from "@/components/admins/CustomSelectBox"
import CustomInput from "@/components/admins/CustomInput"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import CustomButton from "@/components/admins/CustomButton"

// Services
import { create, getUserById, update } from "@/services/UserService"

// Hooks
import useUpload from "@/hooks/useUpload"
import useCatalogue from "@/hooks/useCatalogue"
import useFormSubmit from "@/hooks/useFormSubmit"

// Types
import { FormInputs, User, UserPayloads } from "@/types/User"
import { validation } from "@/validations/user/StoreUserValidation"

interface UserStoreProps {
  userId: string | null,
  action: string
}

const UserStore = ({ userId, action }: UserStoreProps) => {
    const { register, handleSubmit, formState: { errors }, watch, control, reset } = useForm<FormInputs>()
    const { images, handleImageChange } = useUpload(false)
    const password = useRef({})
    password.current = watch("password", "")

    const { data, isLoading } = useQuery<User>(
        ['user', userId],
        () => getUserById(userId),
        { enabled: (action === 'update' || action === "view") && !!userId }
    )

    const [validationRules, setValidationRules] = useState(() => validation(password, undefined))
    const catalogues = useCatalogue()

    const { onSubmitHandler, loading } = useFormSubmit(async (formData: FormInputs) => {
        const payload = UserPayloads(formData, images, selectedBox)
        console.log("Payload: ", payload);

        if (action === "update") {
            await update(userId, payload)
        }
        else {
            await create(payload)
        }

    })

    useEffect(() => {
        if (!isLoading && data) {
            const formValues: FormInputs = {
                first_name: data.firstName,
                middle_name: data.middleName,
                last_name: data.lastName,
                email: data.email,
                phone: data.phone,
                password: "",
                confirm_password: "",
                birth_date: data.birthDate ? data.birthDate.split("T")[0] : "",
                gender: data.gender ? String(data.gender) : "",
                catalogue: data.userCatalogueIds ? String(data.userCatalogueIds) : "",
            }

            reset(formValues) 
            setValidationRules(validation(null, data))
        }
    }, [data, isLoading, reset])

    const selectedBox = [
        {
            title: "Giới tính (*)",
            placeholder: "Chọn giới tính",
            errors: errors,
            rules: {},
            name: "gender",
            control: control,
            disabled: action === "view",
            options: [
                { id: 1, value: "male", label: "Nam" },
                { id: 2, value: "female", label: "Nữ" },
                { id: 3, value: "other", label: "Khác" },
            ],
        },
        {
            title: "Nhóm người dùng (*)",
            placeholder: "Chọn nhóm người dùng",
            errors: errors,
            rules: {},
            name: "catalogue",
            control: control,
            disabled: action === "view",
            options:
                catalogues?.filter((c) => c.id !== 0).map((c) => ({
                id: c.id,
                value: String(c.id),
                label: c.name,
                })) || [],
        },
    ]

    return (
        <form 
                onSubmit={action === "view" ? undefined : handleSubmit(onSubmitHandler)} 
                className="space-y-4"
        >
            <div className="grid gap-4 py-4">
                {action !== "view" && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="upload-image"
                        className="hidden"
                    />
                )}

                <div className="text-center">
                    <label htmlFor={action !== "view" ? "upload-image" : undefined}>
                        <Avatar className="w-[100px] h-[100px] cursor-pointer">
                        <AvatarImage
                            src={
                            images.length > 0
                                ? images[0].preview
                                : "https://github.com/shadcn.png"
                            }
                        />
                        <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </label>
                </div>

                {validationRules && validationRules.map((item, index) => (
                    <CustomInput
                        key={index}
                        errors={errors}
                        register={register}
                        disabled={action === "view"}
                        {...item}
                    />
                ))}

                {selectedBox && selectedBox.map((item, index) => (
                    <CustomSelectBox 
                        key={index} 
                        register={register} 
                        {...item} 
                    />
                ))}

                {action !== "view" && (
                    <div className="text-center pt-30">
                        <CustomButton loading={loading} text="Lưu thông tin" />
                    </div>
                )}
            </div>
        </form>
    )
}

export default UserStore
