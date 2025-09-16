const breadcrumb = {
    items: [
        {
            title: "Tập tin",
            route: ""
        },
        {
            title: "Quản lý tập tin",
            route: "/admin/file/files"
        }
    ],
    page: {
        title: "QUẢN LÝ PHÂN QUYỀN",
        description: "Hiển thị danh sách quyền, sử dụng các chức năng bên dưới để phân quyền"
    },
    create: {
        title: "THÊM MỚI NGƯỜI DÙNG",
        description: "Nhập đầy đủ các thông tin phía dưới. Các mục có dấu * là bắt buộc."
    },
    update: {
        title: "CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG",
        description: "Chỉnh sửa các thông tin phía dưới. Các mục có dấu * là bắt buộc."
    },
    view: {
        title: "XEM THÔNG TIN NGƯỜI DÙNG",
        description: "Thông tin người dùng chỉ có thể xem, không thể chỉnh sửa"
    }
};

export { 
    breadcrumb
}