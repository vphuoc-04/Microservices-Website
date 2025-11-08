import { UserCatalogue } from "@/types/UserCatalogue"
import { RegisterOptions } from "react-hook-form"

export const validation = (): any[] => {
    return [
        {
            label: 'Tên nhóm người dùng (*)',
            name: 'name',
            type: 'text',
            rules: {
                required: 'Tên nhóm người dùng là bắt buộc.',
                minLength: {
                    value: 2,
                    message: 'Tên nhóm phải có ít nhất 2 ký tự.'
                }
            } as RegisterOptions
        },
        {
            label: 'Trạng thái (*)',
            name: 'publish',
            type: 'select',
            rules: {
                required: 'Trạng thái là bắt buộc.'
            } as RegisterOptions,
            options: [
                { value: '1', label: 'Không xuất bản' },
                { value: '2', label: 'Xuất bản' }
            ]
        }
    ]
}

export const mapUserCatalogueToFormDefaults = (data: UserCatalogue) => {
    return {
        name: data.name || '',
        publish: data.publish || 1,
        permissions: [], // Sẽ được set riêng từ API
        users: [] // Sẽ được set riêng từ API
    }
}