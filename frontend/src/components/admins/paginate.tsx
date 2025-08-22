import React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationLinks {
    url: string | null,
    label: string,
    active: boolean
    
}

interface PaginationProps {
    links?: PaginationLinks[],
    onPageChange?: (page: number) => void;
}

const Paginate: React.FC<PaginationProps> = ({ links, onPageChange }) => {
    console.log(links)

    if (!links || links.length === 0) {
        return null
    }

    const activeLinkIndex = links.findIndex(link => link.active);

    const filterLinks = links.filter((link, index) => {
        if (index === 0 || index === links.length - 1) return true;

        return index >= activeLinkIndex - 3 && index <= activeLinkIndex + 3;
    });

    return (
        <Pagination>
            <PaginationContent>
                {activeLinkIndex > 0 && (
                    <PaginationItem>
                        <PaginationPrevious 
                            href="#"
                            onClick={(e) => {e.preventDefault(); onPageChange?.(activeLinkIndex);}} 
                        />
                    </PaginationItem>
                )}

                {filterLinks.map((link, index) => (
                    <PaginationItem key={index} className={link.active ? 'bg-teal-600 rounded-[10px] text-white' : ""}>
                        {link.url && (
                            <PaginationLink className="cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange?.(parseInt(link.label))
                                }}
                            >
                                {link.label}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {activeLinkIndex < links.length - 1 && (
                    <PaginationItem>
                        <PaginationNext 
                            href="#"
                            onClick={(e) => {e.preventDefault(); onPageChange?.(activeLinkIndex + 2);}} 
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    )
}

export default Paginate