// hooks/useCatalogue.ts
import { Option } from "@/components/admins/CustomSelectBox";
import { fetchUserCatalogue } from "@/services/UserCatalogueService";
import { useEffect, useState } from "react";

let cachedRawCatalogues: Option[] | null = null;

const useCatalogue = (includeAll: boolean = false) => {
    const [catalogues, setCatalogues] = useState<Option[]>([]);

    useEffect(() => {
        const load = async () => {
            if (!cachedRawCatalogues) {
                const userCatalogues = await fetchUserCatalogue();
                    cachedRawCatalogues = userCatalogues.map((c) => ({
                    id: c.id,
                    value: String(c.id),
                    label: c.name,
                }));
            }

            let result = [...cachedRawCatalogues];

            if (includeAll) {
                result = [{ id: 0, value: "0", label: "Tất cả" }, ...result];
            }

            setCatalogues(result);
        };
        load();
    }, [includeAll]);

    return catalogues;
};

export default useCatalogue;
