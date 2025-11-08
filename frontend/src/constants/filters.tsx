import { ModelFilterConfig } from "@/interfaces/BaseServiceInterface"
import { FaPlus, FaUserPlus } from "react-icons/fa"

import { perpages, publishs, sorts, genders } from "@/constants/generals"

export const userFilterConfig: ModelFilterConfig = {
    model: 'users',
    filters: [
        {
            field: 'perpage',
            type: 'select',
            placeholder: 'Chọn số bản ghi',
            dataSource: 'static',
            options: perpages.map(p => ({ id: p, name: `${p} bản ghi` }))
        },
        {
            field: 'publish',
            type: 'select',
            placeholder: 'Chọn trạng thái',
            dataSource: 'static',
            options: publishs
        },
        {
            field: 'userCatalogueId',
            type: 'select',
            placeholder: 'Chọn danh mục',
            dataSource: 'api',
            apiEndpoint: '/catalogues'
        },
        {
            field: 'sort',
            type: 'select',
            placeholder: 'Sắp xếp',
            dataSource: 'static',
            options: sorts
        },
        {
            field: 'gender',
            type: 'select',
            placeholder: 'Giới tính',
            dataSource: 'static',
            options: genders
        },
        {
            field: 'keyword',
            type: 'input',
            placeholder: 'Tìm kiếm...'
        }
    ],
    actions: [
        {
            value: 'deleteMany',
            label: 'Xóa',
            method: 'deleteMany',
            requiresSelection: true,
            confirmMessage: 'Bạn có chắc chắn muốn xóa các mục đã chọn?'
        },
        {
            value: 'publish|2',
            label: 'Xuất bản',
            method: 'publish',
            requiresSelection: true
        },
        {
            value: 'publish|1',
            label: 'Ngừng xuất bản',
            method: 'publish',
            requiresSelection: true
        }
    ],
    createButton: {
        label: 'Thêm thành viên mới',
        icon: <FaPlus />
    }
}

export const userCatalogueFilterConfig: ModelFilterConfig = {
    model: 'user_catalogue',
    filters: [
        {
            field: 'perpage',
            type: 'select',
            placeholder: 'Chọn số bản ghi',
            dataSource: 'static',
            options: perpages.map(p => ({ id: p, name: `${p} bản ghi` }))
        },
        {
            field: 'publish',
            type: 'select',
            placeholder: 'Chọn trạng thái',
            dataSource: 'static',
            options: publishs
        },
        {
            field: 'keyword',
            type: 'input',
            placeholder: 'Tìm kiếm...'
        }
    ],
    actions: [
        {
        value: 'deleteMany',
        label: 'Xóa',
        method: 'deleteMany',
        requiresSelection: true,
        confirmMessage: 'Bạn có chắc chắn muốn xóa các nhóm đã chọn?'
        }
    ],
    createButton: {
        label: 'Thêm nhóm mới',
        icon: <FaUserPlus />
    }
}

export const permissionFilterConfig: ModelFilterConfig = {
    model: 'user_catalogue',
    filters: [
        {
            field: 'perpage',
            type: 'select',
            placeholder: 'Chọn số bản ghi',
            dataSource: 'static',
            options: perpages.map(p => ({ id: p, name: `${p} bản ghi` }))
        },
        {
            field: 'publish',
            type: 'select',
            placeholder: 'Chọn trạng thái',
            dataSource: 'static',
            options: publishs
        },
        {
            field: 'keyword',
            type: 'input',
            placeholder: 'Tìm kiếm...'
        }
    ],
    actions: [
        {
        value: 'deleteMany',
        label: 'Xóa',
        method: 'deleteMany',
        requiresSelection: true,
        confirmMessage: 'Bạn có chắc chắn muốn xóa các nhóm đã chọn?'
        }
    ],
    createButton: {
        label: 'Thêm quyền mới',
        icon: <FaUserPlus />
    }
}

export const filterConfigs: Record<string, ModelFilterConfig> = {
    users: userFilterConfig,
    user_catalogue: userCatalogueFilterConfig,
    permissions: permissionFilterConfig
}
