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

    const { isLoading, data, isError, refetch } = useQuery(['users', queryString], () => pagination(queryString))

    const handlePageChange = (page: number) => {
        setPage(page);
        navigate(`?${queryString}`)
    }

    const handleQueryString = (filterParam: FilterParams) => setFilters(filterParam)

    useEffect(() => {
        const query = Object.keys(filters)
            .filter(key => {
                const value = filters[key]
                if ((key === "parent_id" || key === "publish") && Number(value) === 0) return false;
                if (key === "perpage" && (value === "" || value === null)) return false;
                return true;
            })
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
            .join('&');

        const mainQueryString = query ? `page=${page}&${query}` : `page=${page}`;
        setQueryString(mainQueryString);
    }, [page, filters, refetch]);

    useEffect(() => {
        navigate(`?${queryString}`)
        refetch()
    }, [queryString])

    return {
        isLoading,
        data,
        isError,
        refetch,
        handlePageChange,
        handleQueryString
    }
}

export default useTable