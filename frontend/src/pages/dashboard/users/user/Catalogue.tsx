import { useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Checkbox } from "@/components/ui/checkbox"

// Types
import { UserCatalogue } from "@/types/UserCatalogue"

// Services
import { fetchUserCatalogue } from "@/services/UserCatalogueService"

const Catalogue = () => {
    const [userCatalogue, setUserCatalogue] = useState<UserCatalogue[]>([])

    useEffect(() => {
        const fetchUserCatalogueData = async () => {
            const userCatalogueData = await fetchUserCatalogue();
            setUserCatalogue(userCatalogueData);
        };
        fetchUserCatalogueData();
    }, []);

    return (
        <div className="container">
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Checkbox disabled/>
                                </TableHead>
                                <TableHead className="w-[100px]">Id</TableHead>
                                <TableHead>name</TableHead>
                                <TableHead>publish</TableHead>
                                <TableHead>Created by</TableHead>
                                <TableHead>Updated by</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userCatalogue.length > 0 ? (
                                userCatalogue.map((catalogue, catalogueIndex) => (
                                    <TableRow key={catalogueIndex}>
                                        <TableCell>
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>{catalogue.id}</TableCell>
                                        <TableCell>{catalogue.name}</TableCell>
                                        <TableCell>{catalogue.publish}</TableCell>
                                        <TableCell>{catalogue.createdBy}</TableCell>
                                        <TableCell>{catalogue.updatedBy}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell className="text-center">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>
    );
};

export { Catalogue };