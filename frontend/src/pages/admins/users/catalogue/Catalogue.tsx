import { useState, useEffect } from "react";
import {
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardFooter,
} from "@/components/ui/card";

import { UserCatalogue } from "@/types/UserCatalogue";

import {
    model,
    fetchUserCatalogue, 
    createUserCatalogue, 
    updateUserCatalogue, 
    deleteUserCatalogue 
} from "@/services/UserCatalogueService";
import { pagination } from "@/services/UserService";
import { PermissionService } from "@/services/PermissionService";
import PageHeading from "@/components/admins/heading";

// Types
import { BreadcrumbData } from "@/types/Breadcrumb";

// Settings
import { breadcrumb, tableColumn } from "@/settings/userCatalogue";

// Components
import Paginate from "@/components/customs/CustomPaginate";
import CustomTable from "@/components/customs/CustomTable";
import CustomFilter from "@/components/customs/CustomFilter";

// Hooks
import useCheckBoxState from "@/hooks/useCheckBoxState";
import useTable from "@/hooks/useTable";
import useSheet from "@/hooks/useSheet";
import { useFilterConfig } from "@/hooks/useFilterConfig";
import CustomSheet from "@/components/customs/CustomSheet";
import UserCatalogueStore from "./includes/Store";


const Catalogue = () => {
    const breadcrumbData: BreadcrumbData = breadcrumb
    const { isLoading, data, isError, refetch, buildLinks, handlePageChange, handleQueryString } = useTable({model, pagination})
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading);
    const anyChecked = isAnyChecked();

    const { config } = useFilterConfig(model)

    const { isSheetOpen, openSheet, closeSheet } = useSheet();

    return (
        <>
            <PageHeading breadcrumb = {breadcrumbData.items} />
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
                            remove={deleteUserCatalogue}
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
                    <UserCatalogueStore 
                        refetch={refetch}
                        closeSheet={closeSheet}
                        userCatalogueId={isSheetOpen.id}
                        action={isSheetOpen.action}
                    />
                </CustomSheet>
            </div>
        </>
    );
};

export { Catalogue };