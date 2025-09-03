import { fetchUserCatalogue } from "@/services/UserCatalogueService";
import { useEffect, useState } from "react";

const useCatalogue = () => {
    const [catalogues, setCatalogues] = useState<{ id: number; name: string }[]>([]);

    let cachedCatalogues: { id: number; name: string }[] | null = null;

    useEffect(() => {
        const load = async () => {
            if (cachedCatalogues) {
                setCatalogues(cachedCatalogues);
            } else {
                const userCatalogues = await fetchUserCatalogue();
                cachedCatalogues = [
                { id: 0, name: "Tất cả" },
                ...userCatalogues.map((c) => ({ id: c.id, name: c.name })),
                ];
                setCatalogues(cachedCatalogues);
            }
        };
        load();
    }, []);

    return catalogues;
};

export default useCatalogue