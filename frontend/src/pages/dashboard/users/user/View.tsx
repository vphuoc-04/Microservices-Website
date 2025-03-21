import React, { useEffect, useState } from "react";

import { User } from "@/types/User";
import { getAllUser } from "@/services/UserService";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationPrevious, 
    PaginationNext,
    PaginationEllipsis, 
    PaginationLink 
} from "@/components/ui/pagination";

const MAX_VISIBLE_PAGES = 5; 
const generatePageNumbers = (currentPage: number, totalPages: number) => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const leftSide = Math.max(1, currentPage - 2);
    const rightSide = Math.min(totalPages, currentPage + 2);

    if (leftSide > 1) pages.push(1);
    if (leftSide > 2) pages.push("...");

    for (let i = leftSide; i <= rightSide; i++) {
        pages.push(i);
    }

    if (rightSide < totalPages - 1) pages.push("...");
    if (rightSide < totalPages) pages.push(totalPages);

    return pages;
};

const View: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sort, setSort] = useState<string>("id,asc");

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await getAllUser(currentPage, 10, sort);
    
            if (response) {
                setUsers(response.users);
                setTotalPages(response.totalPages);
            } else {
                console.error("Failed to fetch users.");
            }
        };
    
        fetchUsers();
    }, [currentPage, sort]);

    const pageNumbers = generatePageNumbers(currentPage, totalPages);
    
    return (
        <div className="container">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">User List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex gap-2">
                        <Button variant="outline" onClick={() => setSort("id,asc")}>Sort by ID ↑</Button>
                        <Button variant="outline" onClick={() => setSort("id,desc")}>Sort by ID ↓</Button>
                        <Button variant="outline" onClick={() => setSort("firstName,asc")}>Sort by Name ↑</Button>
                        <Button variant="outline" onClick={() => setSort("firstName,desc")}>Sort by Name ↓</Button>
                    </div>
                    
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><Checkbox className="border-black" /></TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Middle Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell><Checkbox /></TableCell>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.middleName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    <div className="flex justify-center items-center mt-4 cursor-pointer">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                                </PaginationItem>

                                {pageNumbers.map((page, index) => (
                                    <PaginationItem key={index}>
                                        {typeof page === "string" ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink isActive={currentPage === page} onClick={() => setCurrentPage(Number(page))}>
                                                {page}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export { View };