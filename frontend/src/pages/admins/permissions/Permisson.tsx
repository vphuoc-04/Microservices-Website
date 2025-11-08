// Components
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import PageHeading from "@/components/admins/heading";
import Paginate from "@/components/customs/CustomPaginate";
import CustomTable from "@/components/customs/CustomTable";
import CustomFilter from "@/components/customs/CustomFilter";
import CustomSheet from "@/components/customs/CustomSheet";

// Services
import { pagination } from "@/services/PermissionService";

import { model } from "@/services/PermissionService";

// Types
import { BreadcrumbData } from "@/types/Breadcrumb";

// Settings
import { breadcrumb, tableColumn } from "@/settings/permission";

// Hooks
import useCheckBoxState from "@/hooks/useCheckBoxState";
import useTable from "@/hooks/useTable";
import useSheet from "@/hooks/useSheet";
import { useFilterConfig } from "@/hooks/useFilterConfig";
import PermissionStore from "./includes/Store";

const Permission = () => {
    const breadcrumbData: BreadcrumbData = breadcrumb

    const { isLoading, data, isError, refetch, buildLinks, handlePageChange, handleQueryString } = useTable({model, pagination})
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading);
    const anyChecked = isAnyChecked();

    const { isSheetOpen, openSheet, closeSheet } = useSheet();

    const { config } = useFilterConfig(model)

    return (
        <>
            <PageHeading breadcrumb={breadcrumbData.items} />
            <div className="container p-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="uppercase">{breadcrumb.page.title}</CardTitle>
                        <CardDescription className="text-[#f00000]">{breadcrumb.page.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CustomFilter 
                            isAnyChecked={anyChecked}
                            checkedState={checkedState}
                            model={model}
                            refetch={refetch}
                            handleQueryString={handleQueryString}
                            openSheet={openSheet}
                            filterConfig={config}
                        />
                        <CustomTable 
                            isLoading={isLoading}
                            data={data}
                            isError={isError}
                            model={model}
                            tableColumn={tableColumn}
                            checkedState={checkedState}
                            checkedAllState={checkedAllState}
                            handleCheckedChange={handleCheckedChange}
                            handleCheckedAllChange={handleCheckedAllChange}
                            openSheet={openSheet}
                            refetch={refetch}
                        />
                    </CardContent>
                    <CardFooter>
                        <Paginate links={buildLinks(data?.pagination)} onPageChange={handlePageChange} />
                    </CardFooter>
                </Card>
                <CustomSheet 
                    title={
                        isSheetOpen.action === 'update'
                        ? breadcrumb.update.title
                        : isSheetOpen.action === 'view'
                        ? breadcrumb.view.title
                        : breadcrumb.create.title
                    }
                    description={
                        isSheetOpen.action === 'update'
                        ? breadcrumb.update.description
                        : isSheetOpen.action === 'view'
                        ? breadcrumb.view.description
                        : breadcrumb.create.description
                    }
                    isSheetOpen={isSheetOpen.open} 
                    closeSheet={closeSheet}
                    className="w-[500px] sm:w-[550px]"
                >
                    <PermissionStore 
                        refetch={refetch}
                        closeSheet={closeSheet}
                        permissionId={isSheetOpen.id}
                        action={isSheetOpen.action}
                    />
                </CustomSheet>
            </div>
        </>
    );
};

export { Permission }