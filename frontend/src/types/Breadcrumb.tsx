export type BreadcrumbItem = {
    title: string,
    route: string
}

export type BreadcrumbData = {
    items: BreadcrumbItem[],
    create: {
        title: string,
        description: string
    }
}
