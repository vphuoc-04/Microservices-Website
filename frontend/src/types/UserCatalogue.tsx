export type UserCatalogue = {
    id: number;
    name: string;
    publish: number;
    addedBy?: number;
    editedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}

export type PayloadInputs = {
    id: number;
    name: string;
    publish: number;
}