import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"

// Constants
import { USER_CATALOGUE_KEYS_TO_CHECK } from "@/constants/formkey"

// Components
import CustomSelectBox, { Option } from "@/components/customs/CustomSelectBox"
import CustomInput from "@/components/customs/CustomInput"
import CustomButton from "@/components/customs/CustomButton"

// Services
import { createUserCatalogue, updateUserCatalogue, getUserCatalogueById, getUserCataloguePermissions, getUserCatalogueUsers } from "@/services/UserCatalogueService"
import { getAllPermissions } from "@/services/PermissionService"
import { pagination } from "@/services/UserService"

// Hooks
import useFormSubmit from "@/hooks/useFormSubmit"
import useSelectedBox from "@/hooks/useSelectBox"
import useAllDifferent from "@/hooks/useAllDifferent"

// Types
import { UserCatalogue } from "@/types/UserCatalogue"
import { validation, mapUserCatalogueToFormDefaults } from "@/validations/user/StoreUserCatalogueValidation"

// Interfaces
import { SelectBoxItem } from "@/interfaces/BaseServiceInterface"

interface UserCatalogueStoreProps {
    refetch: any,
    closeSheet: () => void,
    userCatalogueId: string | null,
    action: string
}

interface PayloadInputs {
    name: string;
    publish: number;
    permissions: number[];
    users: number[];
}

const UserCatalogueStore = ({ userCatalogueId, action, refetch, closeSheet }: UserCatalogueStoreProps) => {
    const { register, handleSubmit, formState: { errors, isValid }, watch, control, setValue, reset, getValues } = useForm<PayloadInputs>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            publish: 1,
            permissions: [],
            users: []
        }
    })

    const { data: userCatalogueData, isLoading } = useQuery<UserCatalogue | null>(
        ['userCatalogue', userCatalogueId],
        () => getUserCatalogueById(userCatalogueId as string),
        { enabled: (action === 'update' || action === "view") && !!userCatalogueId }
    )

    const { data: permissionsData } = useQuery(
        ['permissions'],
        () => getAllPermissions(),
        { enabled: action !== "view" }
    )

    const { data: usersData } = useQuery(
        ['users'],
        () => pagination('page=1&limit=100'),
        { enabled: action === 'create' }
    )

    // Thêm query để lấy permissions và users của user catalogue khi update/view
    const { data: cataloguePermissions } = useQuery(
        ['cataloguePermissions', userCatalogueId],
        () => getUserCataloguePermissions(userCatalogueId as string),
        { enabled: (action === 'update' || action === 'view') && !!userCatalogueId }
    )

    const { data: catalogueUsers } = useQuery(
        ['catalogueUsers', userCatalogueId],
        () => getUserCatalogueUsers(userCatalogueId as string),
        { enabled: (action === 'update' || action === 'view') && !!userCatalogueId }
    )

    const [validationRules] = useState(() => validation())
    const initialValuesRef = useRef<Partial<PayloadInputs> | null>(null)

    const saveUserCatalogue = async (data: PayloadInputs): Promise<boolean> => {
        if (action === 'create') {
            return await createUserCatalogue(data.name, String(data.publish), data.users, data.permissions)
        } else if (action === 'update' && userCatalogueId) {
            return await updateUserCatalogue(userCatalogueId, data.name, String(data.publish))
        }
        return false
    }

    const { onSubmitHandler, loading } = useFormSubmit(saveUserCatalogue, refetch, closeSheet, { 
        action: action, 
        id: userCatalogueId 
    })

    const [defaultSelectValue] = useState<Option | null>(null)
    
    const permissionOptions = useMemo(() => 
        permissionsData?.map(permission => ({
            id: permission.id,
            value: String(permission.id),
            label: permission.name
        })) || [], 
        [permissionsData]
    )

    const userOptions = useMemo(() => 
        usersData?.users?.map(user => ({
            id: user.id,
            value: String(user.id),
            label: `${user.firstName} ${user.lastName} (${user.email})`
        })) || [], 
        [usersData]
    )

    const initialSelectBoxs = useMemo<SelectBoxItem[]>(() => [
        {
            title: 'Quyền (*)',
            placeholder: 'Chọn quyền',
            errors: errors,
            rules: {
                required: action === 'create' ? 'Bạn cần chọn ít nhất một quyền.' : false
            },
            name: 'permissions',
            value: defaultSelectValue,
            control: control,
            disabled: action === 'view' || action === 'update', 
            multiple: true,
            options: permissionOptions,
            onSelectedChange: (value?: string | string[]) => {
                if (value !== undefined) {
                    const permissionsArray = Array.isArray(value) 
                        ? value.map(v => Number(v))
                        : value ? [Number(value)] : []
                    setValue('permissions', permissionsArray as any, { shouldDirty: true, shouldValidate: true })
                }
            },
        },
        {
            title: 'Người dùng',
            placeholder: 'Chọn người dùng',
            errors: errors,
            rules: {
                required: false
            },
            name: 'users',
            value: defaultSelectValue,
            control: control,
            disabled: action === 'view' || action === 'update',
            multiple: true,
            options: userOptions,
            onSelectedChange: (value?: string | string[]) => {
                if (value !== undefined) {
                    const usersArray = Array.isArray(value) 
                        ? value.map(v => Number(v))
                        : value ? [Number(value)] : []
                    setValue('users', usersArray as any, { shouldDirty: true, shouldValidate: true })
                }
            },
        }
    ], [permissionOptions, userOptions, defaultSelectValue, action, control, errors])

    const { selectBox, updateSelectedBoxValue, updateSelectedBoxOptions } = useSelectedBox(initialSelectBoxs)

    useEffect(() => {
        if (!isLoading && userCatalogueData && (action === 'update' || action === 'view')) {
            // Set giá trị cho permissions và users từ API riêng
            if (cataloguePermissions) {
                updateSelectedBoxValue('permissions', permissionOptions, cataloguePermissions.map(p => String(p)))
                setValue('permissions', cataloguePermissions, { shouldDirty: false })
            }

            if (catalogueUsers) {
                updateSelectedBoxValue('users', userOptions, catalogueUsers.map(u => String(u)))
                setValue('users', catalogueUsers, { shouldDirty: false })
            }

            const mapped = mapUserCatalogueToFormDefaults(userCatalogueData)
            initialValuesRef.current = mapped
            reset(mapped, { keepDirty: false })
        }
    }, [isLoading, userCatalogueData, cataloguePermissions, catalogueUsers, action, permissionOptions, userOptions, reset])

    useEffect(() => {
        if (permissionOptions.length > 0) {
            updateSelectedBoxOptions('permissions', permissionOptions)
        }
    }, [permissionOptions])

    useEffect(() => {
        if (userOptions.length > 0) {
            updateSelectedBoxOptions('users', userOptions)
        }
    }, [userOptions])

    const watched = watch(USER_CATALOGUE_KEYS_TO_CHECK)
    const areAllDifferent = useAllDifferent({
        watchedValues: watched,
        getCurrentValues: getValues,
        initialValues: initialValuesRef.current,
        keysToCheck: USER_CATALOGUE_KEYS_TO_CHECK
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

                {selectBox && selectBox.map((item, index) => (
                    <CustomSelectBox 
                        key={index} 
                        register={register} 
                        {...item} 
                    />
                ))}

                {action === 'update' && (
                    <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
                        <strong>Lưu ý:</strong> Chức năng chỉnh sửa chỉ cập nhật tên và trạng thái. 
                        Để thay đổi quyền hoặc người dùng, vui lòng xóa và tạo mới.
                    </div>
                )}

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

export default UserCatalogueStore