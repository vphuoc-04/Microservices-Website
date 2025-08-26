import { breadcrumb, model, pagination, tableColumn } from "@/services/UserService";

// Components
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PageHeading from "@/components/admins/heading";
import CustomTable from "@/components/admins/CustomTable";
import Paginate from "@/components/admins/paginate";
import Filter from "@/components/admins/Filter";

// Types
import { Breadcrumb } from "@/types/Breadcrumb";

// Hooks
import useCheckBoxState from "@/hooks/useCheckBoxState";
import useTable from "@/hooks/useTable";

const User = ({}) => {
    const breadcrumbData: Breadcrumb[] = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb]
    const { isLoading, data, isError, refetch, handlePageChange, handleQueryString } = useTable({model, pagination})
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading);
    const anyChecked = isAnyChecked();

    const buildLinks = (pageData: any) => {
        if (!pageData) return [];

        return Array.from({ length: pageData.totalPages }, (_, i) => ({
            url: `?page=${i + 1}`,
            label: (i + 1).toString(),
            active: i === pageData.page
        }));
    };
    
    return (
        <>
            <PageHeading breadcrumb = {breadcrumbData} />
            <div className="container p-3">
                <Card>
                    <CardContent>
                        <Filter 
                            isAnyChecked={anyChecked} 
                            checkedState={checkedState} 
                            model={model} 
                            refetch={refetch} 
                            handleQueryString={(filters: any) => handleQueryString(filters)}
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

export { User };