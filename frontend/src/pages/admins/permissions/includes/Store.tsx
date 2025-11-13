import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"

// Constants
import { PERMISSION_KEYS_TO_CHECK } from "@/constants/formkey"

// Components
import CustomInput from "@/components/customs/CustomInput"
import CustomButton from "@/components/customs/CustomButton"

// Services
import { createPermission, updatePermission, getPermissionById, save } from "@/services/PermissionService"

// Hooks
import useFormSubmit from "@/hooks/useFormSubmit"
import useAllDifferent from "@/hooks/useAllDifferent"

// Types
import { PayloadInputs, Permission } from "@/types/Permission"
import { validation, mapPermissionToFormDefaults } from "@/validations/permissions/StorePermissionValidation"

interface PermissionStoreProps {
    refetch: any,
    closeSheet: () => void,
    permissionId: string | null,
    action: string
}


const PermissionStore = ({ permissionId, action, refetch, closeSheet }: PermissionStoreProps) => {
    const { register, handleSubmit, formState: { errors, isValid }, watch, control, setValue, reset, getValues } = useForm<PayloadInputs>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            publish: 1 
        }
    })

    const { data, isLoading } = useQuery<Permission | null>(
        ['permission', permissionId],
        () => getPermissionById(permissionId as string),
        { enabled: (action === 'update' || action === "view") && !!permissionId }
    )

    const [validationRules] = useState(() => validation())
    const initialValuesRef = useRef<Partial<PayloadInputs> | null>(null)

    // const savePermission = async (data: PayloadInputs): Promise<boolean> => {
    //     if (action === 'create') {
    //         return await createPermission(data.name, data.publish, data.description)
    //     } else if (action === 'update' && permissionId) {
    //         return await updatePermission(permissionId, data.name, data.publish, data.description)
    //     }
    //     return false
    // }

    const { onSubmitHandler, loading } = useFormSubmit(save, refetch, closeSheet, { 
        action: action, 
        id: permissionId 
    })

    useEffect(() => {
        if (!isLoading && data && (action === 'update' || action === 'view')) {
            const mapped = mapPermissionToFormDefaults(data)
            initialValuesRef.current = mapped
            reset(mapped, { keepDirty: false })
        }
    }, [isLoading, data, action, reset])

    const watched = watch(PERMISSION_KEYS_TO_CHECK)
    const areAllDifferent = useAllDifferent({
        watchedValues: watched,
        getCurrentValues: getValues,
        initialValues: initialValuesRef.current,
        keysToCheck: PERMISSION_KEYS_TO_CHECK
    })

    return (
        <form onSubmit={action === "view" ? undefined : handleSubmit(onSubmitHandler)} className="space-y-4">
            <div className="grid gap-4 py-4">
                {validationRules && validationRules.map((item, index) => (
                    <CustomInput
                        key={index}
                        errors={errors}
                        register={register}
                        disabled={action === "view"}
                        {...item}
                    />
                ))}

                {action !== "view" && (
                    <div className="text-center pt-4">
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

export default PermissionStore