import { breadcrumb, model, pagination, tableColumn, remove } from "@/services/UserService";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import PageHeading from "@/components/admins/heading";
import CustomTable from "@/components/admins/CustomTable";
import Paginate from "@/components/admins/paginate";
import Filter from "@/components/admins/Filter";

// Types
import { BreadcrumbData } from "@/types/Breadcrumb";

// Hooks
import useCheckBoxState from "@/hooks/useCheckBoxState";
import useTable from "@/hooks/useTable";
import useSheet from "@/hooks/useSheet";
import CustomSheet from "@/components/admins/CustomSheet";
import UserStore from "./Store";

const User = ({}) => {
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
                            isLoading = {isLoading}
                            data={data}
                            isError={isError}
                            model={model}
                            tableColumn={tableColumn}
                            checkedState={checkedState}
                            checkedAllState={checkedAllState}
                            handleCheckedChange={handleCheckedChange}
                            handleCheckedAllChange={handleCheckedAllChange}
                            openSheet={openSheet}
                            remove={remove}
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
                    <UserStore 
                        userId={isSheetOpen.id}
                        action={isSheetOpen.action}
                    />
                </CustomSheet>
            </div>
        </>
    );
};

export { User };