// Types
import { BreadcrumbData } from "@/types/Breadcrumb";

// Settings
import { breadcrumb } from "@/settings/file";
import PageHeading from "@/components/admins/heading";

const File = () => {
    const breadcrumbData: BreadcrumbData = breadcrumb

    return (
        <>
            <PageHeading breadcrumb={breadcrumbData.items} />
        </>
    )   
}

export { File }