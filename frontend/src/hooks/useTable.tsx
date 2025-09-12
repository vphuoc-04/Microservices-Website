import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

interface UseTableProps {
    model: string,
    pagination: any
}

interface FilterParams {
    [key: string]: string | number
}

const useTable = ({model, pagination}: UseTableProps) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const [page, setPage] = useState<number | null>(currentPage)
    const [queryString, setQueryString] = useState<string>('')
    const [filters, setFilters] = useState<FilterParams>({})
    const [loading, setLoading] = useState(false);
    const [shouldShowLoading, setShouldShowLoading] = useState(false);
    const { isLoading, isFetching, data, isError, refetch } = useQuery(['users', queryString], () => pagination(queryString),{ 
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    const buildLinks = (pageData: any) => {
        if (!pageData) return [];

        return Array.from({ length: pageData.totalPages }, (_, i) => ({
            url: `?page=${i + 1}`,
            label: (i + 1).toString(),
            active: i === pageData.page
        }));
    };

    useEffect(() => {
        if (isFetching) {
            if (shouldShowLoading) setLoading(true);
        } else {
            const timer = setTimeout(() => {
                setLoading(false);
                setShouldShowLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isFetching, shouldShowLoading]);


    const handlePageChange = (page: number) => {
        setPage(page);
        setShouldShowLoading(true);
        navigate(`?${queryString}`)
    }

    const handleQueryString = (filterParam: FilterParams) => {
        setShouldShowLoading(true);
        setFilters(filterParam)
    }

    useEffect(() => {
        const query = Object.keys(filters)
            .filter(key => {
                const value = filters[key]
                if ((key === "parent_id" 
                    || key === "publish" 
                    || key === "gender" 
                    || key === "userCatalogueId" 
                    || key === "sort"
                ) && Number(value) === 0) return false;

                if (key === "perpage" && (value === "" || value === null)) return false;
                return true;
            })
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
            .join('&');

        const mainQueryString = query ? `page=${page}&${query}` : `page=${page}`;
        setQueryString(mainQueryString);
    }, [page, filters, refetch]);

    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        navigate(`?${queryString}`)
        refetch()
    }, [queryString])

    return {
        isLoading: isLoading || loading, 
        data,
        isError,
        refetch,
        buildLinks,
        handlePageChange,
        handleQueryString
    }
}

export default useTable