import { User } from "@/types/User";

export const validation = (password: any, data?: User | undefined) => {
    console.log(data);
    
    const baseValidationData = [
        { 
            label: 'Họ *', 
            name: 'last_name', 
            type: 'text', 
            rules: { 
                required: 'Bạn cần nhập thông tin Họ' 
            },
            defaultValue: data && data.lastName
        },
        { 
            label: 'Tên đệm', 
            name: 'middle_name', 
            type: 'text',
            defaultValue: data && data.middleName
        },
        { 
            label: 'Tên *', 
            name: 'first_name', 
            type: 'text', rules: { 
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
                required: 'Bạn cần nhập thông tin Số điện thoại' 
            },
            defaultValue: data && data.phone
        },
        { 
            label: 'Ngày sinh *', 
            name: 'birth_date', 
            type: 'date', 
            rules: { 
                required: 'Bạn cần nhập thông tin nhập Ngày sinh' 
            },
            defaultValue: data && data.birthDate
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
                name: 'confirm_password', 
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