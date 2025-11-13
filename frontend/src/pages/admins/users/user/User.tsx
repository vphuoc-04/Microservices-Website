// Services
import { model, pagination, remove, changePassword } from "@/services/UserService";

// Settings
import { breadcrumb, tableColumn, buttonActions } from "@/settings/user";

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
import CustomTable from "@/components/customs/CustomTable";
import Paginate from "@/components/customs/CustomPaginate";
import CustomFilter from "@/components/customs/CustomFilter";
import CustomSheet from "@/components/customs/CustomSheet";

// Types
import { BreadcrumbData } from "@/types/Breadcrumb";

// Hooks
import useCheckBoxState from "@/hooks/useCheckBoxState";
import useTable from "@/hooks/useTable";
import useSheet from "@/hooks/useSheet";
import UserStore from "./includes/Store";
import { useFilterConfig } from "@/hooks/useFilterConfig";

const User = ({}) => {
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
                        <CardTitle >{breadcrumb.page.title}</CardTitle>
                        <CardDescription className = {breadcrumb.page.desStyle}>{breadcrumb.page.description}</CardDescription>
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
                            remove={remove}
                            changePassword={changePassword}
                            refetch={refetch}
                            actions={buttonActions}
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
                        refetch={refetch}
                        closeSheet={closeSheet}
                        userId={isSheetOpen.id}
                        action={isSheetOpen.action}
                    />
                </CustomSheet>
            </div>
        </>
    );
};

export { User };