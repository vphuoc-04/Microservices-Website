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
import Paginate from "@/components/admins/paginate";
import CustomTable from "@/components/admins/CustomTable";
import Filter from "@/components/admins/Filter";

// Hooks
import useCheckBoxState from "@/hooks/useCheckBoxState";
import useTable from "@/hooks/useTable";
import useSheet from "@/hooks/useSheet";


const Catalogue = () => {
    const breadcrumbData: BreadcrumbData = breadcrumb
    const { isLoading, data, isError, refetch, buildLinks, handlePageChange, handleQueryString } = useTable({model, pagination})
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading);
    const anyChecked = isAnyChecked();

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
                        <Filter 
                            isAnyChecked={anyChecked} 
                            checkedState={checkedState} 
                            model={model} 
                            refetch={refetch} 
                            handleQueryString={(filters: any) => handleQueryString(filters)}
                            openSheet={openSheet}
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
            </div>
        </>
    );
};

export { Catalogue };