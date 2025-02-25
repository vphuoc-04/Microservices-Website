import { useState, useEffect } from "react";

import {
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardFooter,
} from "@/components/ui/card";

import {
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow,
} from "@/components/ui/table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Types
import { UserCatalogue } from "@/types/UserCatalogue";

// Services
import { fetchUserCatalogue, createUserCatalogue } from "@/services/UserCatalogueService";

const Catalogue = () => {
    const [userCatalogue, setUserCatalogue] = useState<UserCatalogue[]>([]);
    const [name, setName] = useState("");
    const [publish, setPublish] = useState("1"); 

    useEffect(() => {
        const fetchUserCatalogueData = async () => {
            const userCatalogueData = await fetchUserCatalogue();
            setUserCatalogue(userCatalogueData);
        };
        fetchUserCatalogueData();
    }, []);

    const createUserCatalogueHanler = async () => {
        if (!name.trim()) {
            return;
        }

        const result = await createUserCatalogue(name, publish);
        if (result) {
            setName(""); 
            const updatedCatalogue = await fetchUserCatalogue(); 
            setUserCatalogue(updatedCatalogue);
        }
    };

    return (
        <div className="container">
            <Card>
                <CardHeader>
                    <CardTitle></CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="User catalogue name..."
                        />
                        <Select value={publish} onValueChange={setPublish}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Inactive</SelectItem>
                                <SelectItem value="1">Active</SelectItem>
                                <SelectItem value="2">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="text-black" onClick={createUserCatalogueHanler}>Create</Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Checkbox disabled />
                                </TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created by</TableHead>
                                <TableHead>Updated by</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userCatalogue.length > 0 ? (
                                userCatalogue.map((catalogue) => (
                                    <TableRow key={catalogue.id}>
                                        <TableCell><Checkbox /></TableCell>
                                        <TableCell>{catalogue.id}</TableCell>
                                        <TableCell>{catalogue.name}</TableCell>
                                        <TableCell>
                                            {catalogue.publish === 0 ? "Inactive" : catalogue.publish === 1 ? "Active" : "Archived"}
                                        </TableCell>
                                        <TableCell>{catalogue.createdBy}</TableCell>
                                        <TableCell>{catalogue.updatedBy}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <p>User catalogue management</p>
                </CardFooter>
            </Card>
        </div>
    );
};

export { Catalogue };
