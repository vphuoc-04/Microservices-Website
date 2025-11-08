import { RegisterOptions } from "react-hook-form"

export const validation = (): any[] => {
    return [
        {
            label: 'Tên quyền (*)',
            name: 'name',
            type: 'text',
            rules: {
                required: 'Tên quyền là bắt buộc.',
                minLength: {
                    value: 2,
                    message: 'Tên quyền phải có ít nhất 2 ký tự.'
                }
            } as RegisterOptions
        },
        {
            label: 'Mô tả',
            name: 'description',
            type: 'textarea',
            rules: {
                required: false
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

export const mapPermissionToFormDefaults = (data: any) => {
    return {
        name: data.name || '',
        description: data.description || '',
        publish: data.publish || 1
    }
}