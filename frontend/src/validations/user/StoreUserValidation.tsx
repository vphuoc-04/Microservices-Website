import { User, PayloadInputs } from "@/types/User";

export const validation = (password: any, data?: User | undefined) => {
    const baseValidationData = [
        { 
            label: 'Họ *', 
            name: 'lastName', 
            type: 'text', 
            rules: { 
                required: 'Bạn cần nhập thông tin Họ' 
            },
            defaultValue: data && data.lastName
        },
        { 
            label: 'Tên đệm', 
            name: 'middleName', 
            type: 'text',
            defaultValue: data && data.middleName
        },
        { 
            label: 'Tên *', 
            name: 'firstName', 
            type: 'text', 
            rules: { 
                required: 'Bạn cần nhập thông tin Tên' 
            },
            defaultValue: data && data.firstName
        },
        { 
            label: 'Email *', 
            name: 'email', 
            type: 'text', 
            rules: { 
                required: 'Bạn cần nhập thông tin Email',
                pattern: {
                    value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                    message: 'Email không hợp lệ'
                }
            },
            defaultValue: data && data.email
        },
        { 
            label: 'Số điện thoại *', 
            name: 'phone', 
            type: 'tel', 
            rules: { 
                required: 'Bạn cần nhập thông tin Số điện thoại',
                validate: (value: string) => {
                    if (!/^[0-9]+$/.test(value)) {
                        return 'Số điện thoại chỉ được chứa số'
                    }
                    if (value.length < 10) {
                        return 'Vui lòng nhập đủ kí tự số điện thoại'
                    }
                    if (value.length > 10) {
                        return 'Đã quá kí tự số điện thoại'
                    }
                    return true
                }
            },
            defaultValue: data && data.phone
        },
        { 
            label: 'Ngày sinh *', 
            name: 'birthDate', 
            type: 'date', 
            rules: { 
                required: 'Bạn cần nhập thông tin nhập Ngày sinh' 
            },
            defaultValue: (() => {
                const value = data?.birthDate
                if (!value) return ''
                if (/^(\d{2})-(\d{2})-(\d{4})$/.test(value)) {
                    const [, dd, mm, yyyy] = value.match(/^(\d{2})-(\d{2})-(\d{4})$/)!
                    return `${yyyy}-${mm}-${dd}`
                }
                if (/^(\d{4})-(\d{2})-(\d{2})$/.test(value)) {
                    return value
                }
                const d = new Date(value)
                return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
            })()
        },
    ]

    if (password && !data) {
        return [
            ...baseValidationData,
            { 
                label: 'Mật khẩu *', 
                name: 'password', 
                type: 'password', 
                rules: { 
                    required: 'Bạn cần nhập thông tin nhập Mật khẩu' 
                },
                defaultValue: ''
            },
            { 
                label: 'Nhập lại mật khẩu *', 
                name: 'confirmPassword', 
                type: 'password', 
                rules: { 
                    required: 'Bạn cần nhập thông tin Nhập lại mật khẩu',
                    validate: (value: any) => (value === (password.current ?? '')) || 'Mật khẩu không khớp'
                },
                defaultValue: ''
            },
        ]
    }

    return baseValidationData
}

export const mapUserToFormDefaults = (data?: User | undefined): Partial<PayloadInputs> => {
    if (!data) return {}
    const normalizeBirthDate = () => {
        const value = data?.birthDate as any
        if (!value) return '' as any
        if (/^(\d{2})-(\d{2})-(\d{4})$/.test(value)) {
            const [, dd, mm, yyyy] = value.match(/^(\d{2})-(\d{2})-(\d{4})$/)!
            return `${yyyy}-${mm}-${dd}` as any
        }
        if (/^(\d{4})-(\d{2})-(\d{2})$/.test(value)) {
            return value as any
        }
        const d = new Date(value)
        return isNaN(d.getTime()) ? '' as any : (d.toISOString().split('T')[0] as any)
    }

    return {
        lastName: data.lastName as any,
        middleName: (data.middleName ?? '') as any,
        firstName: data.firstName as any,
        email: data.email as any,
        phone: data.phone as any,
        birthDate: normalizeBirthDate(),
        gender: Number(data.gender) as any,
        userCatalogueId: [Number(data.userCatalogueId)] as any,
    }
}