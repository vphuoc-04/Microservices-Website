import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"

import { AvatarFallback } from "@radix-ui/react-avatar"

// Components
import CustomSelectBox, { Option } from "@/components/admins/CustomSelectBox"
import CustomInput from "@/components/admins/CustomInput"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import CustomButton from "@/components/admins/CustomButton"

// Services
import { save, getUserById } from "@/services/UserService"

// Hooks
import useUpload from "@/hooks/useUpload"
import useCatalogue from "@/hooks/useCatalogue"
import useFormSubmit from "@/hooks/useFormSubmit"
import useSelectedBox from "@/hooks/useSelectBox"
import useAllDifferent from "@/hooks/useAllDifferent"

// Types
import { PayloadInputs, User } from "@/types/User"
import { validation, mapUserToFormDefaults } from "@/validations/user/StoreUserValidation"


interface UserStoreProps {
    refetch: any,
    closeSheet: () => void,
    userId: string | null,
    action: string
}

const UserStore = ({ userId, action, refetch, closeSheet }: UserStoreProps) => {
    const { register, handleSubmit, formState: { errors, isValid }, watch, control, setValue, reset, getValues } = useForm<PayloadInputs>({
        mode:'onChange',
        reValidateMode: 'onChange'
    })
    const { images, handleImageChange } = useUpload(false)
    const password = useRef<string | undefined>("")
    password.current = watch("password", "")

    const { data, isLoading } = useQuery<User>(['user', userId],() => getUserById(userId),
        { enabled: (action === 'update' || action === "view") && !!userId }
    )

    useEffect(() => {
        if (!isLoading && data && action === "update") {
            setValidationRules(validation(null, data));
        }
    }, [data, isLoading, action]);

    const [validationRules, setValidationRules] = useState(() => validation(password, undefined))
    const catalogues = useCatalogue(false)   

    const [genders] = useState([
        { id: 1, value: '1', label: 'Nam' },
        { id: 2, value: '2', label: 'Nữ' },
        { id: 3, value: '3', label: 'Khác' }
    ])    

    const { onSubmitHandler, loading } = useFormSubmit(save, refetch, closeSheet, { action: action, id: userId })
    const initialGenderRef = useRef<string | null>(null)
    const initialCatalogueRef = useRef<string | null>(null)
    const initialValuesRef = useRef<Partial<PayloadInputs> | null>(null)
    
    const [defaultSelectValue] = useState<Option | null>(null)

    interface SelectBoxItem {
        title: string | undefined,
        placeholder: string | undefined,
        options: Option[],
        value: Option | null,
        rules: object,
        name: string,
        control: any,
        disabled: boolean,
        errors: any,
        onSelectedChange?: (value: string | undefined) => void,
        isLoading?: boolean
    }    

    const initialSelectBoxs = useMemo<SelectBoxItem[]>(() => [
        {
            title: 'Giới tính (*)',
            placeholder: 'Chọn giới tính',
            errors: errors,
            rules: {
            required: 'Bạn cần chọn giới tính cho người dùng.',
            },
            name: 'gender',
            value: defaultSelectValue,
            control: control,
            disabled: action === 'view',
            options: genders,
            onSelectedChange: (value?: string) => {
                if (value !== undefined) {
                    setValue('gender', value ? Number(value) as any : undefined, { shouldDirty: true, shouldValidate: true })
                }
            },
        },
        {
            title: 'Nhóm người dùng (*)',
            placeholder: 'Chọn nhóm người dùng',
            errors: errors,
            rules: {
                required: 'Bạn cần chọn nhóm người dùng thuộc về.' 
            },
            name: 'userCatalogueId',
            value: defaultSelectValue,
            control: control,
            disabled: action === 'view',
            options: catalogues,
            onSelectedChange: (value?: string) => {
                if (value !== undefined) {
                    setValue('userCatalogueId', value ? [Number(value)] as any : [], { shouldDirty: true, shouldValidate: true })
                }
            },
        },
    ], [genders, catalogues, defaultSelectValue, action, control, errors, isLoading])


    const { selectBox, updateSelectedBoxValue, updateSelectedBoxOptions } = useSelectedBox(initialSelectBoxs)

    useEffect(() => {
        if (!isLoading && data && (action === 'update' || action === 'view')) {
            updateSelectedBoxOptions('gender', genders)
            updateSelectedBoxOptions('userCatalogueId', catalogues)
            updateSelectedBoxValue('gender', genders, String(data.gender))
            updateSelectedBoxValue('userCatalogueId', catalogues, String(data.userCatalogueId))
            initialGenderRef.current = String(data.gender)
            initialCatalogueRef.current = String(data.userCatalogueId)
            const mapped = mapUserToFormDefaults(data)
            initialValuesRef.current = mapped
            reset(mapped as any, { keepDirty: false, keepValues: false })
        }
    }, [isLoading, data, action, genders, catalogues, reset])

    useEffect(() => {
        if (!isLoading) {
            updateSelectedBoxOptions('gender', genders)
        }
    }, [isLoading, genders, action])

    useEffect(() => {
        if (!isLoading && catalogues) {
            updateSelectedBoxOptions('userCatalogueId', catalogues)
        }
    }, [isLoading, catalogues, action])

    const keysToCheck = ['lastName', 'middleName', 'firstName','email','phone','birthDate','gender','userCatalogueId']
    const watched = watch(keysToCheck as any)
    const areAllDifferent = useAllDifferent({ watchedValues: watched, getCurrentValues: () => getValues() as any, initialValues: (initialValuesRef.current as any) ?? null, keysToCheck: keysToCheck })

    return (
        <form onSubmit={action === "view" ? undefined : handleSubmit(onSubmitHandler)} className="space-y-4">
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

                {selectBox && selectBox.map((item, index) => (
                    <CustomSelectBox 
                        key={index} 
                        register={register} 
                        {...item} 
                    />
                ))}

                {action !== "view" && (
                    <div className="text-center pt-30">
                        <CustomButton 
                            loading={loading} 
                            text="Lưu thông tin" 
                            disabled={action === 'update' ? !(areAllDifferent && isValid) : !isValid}
                        />
                    </div>
                )}
            </div>
        </form>
    )
}

export default UserStore
