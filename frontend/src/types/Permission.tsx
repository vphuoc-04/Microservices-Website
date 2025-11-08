export interface Permission {
    id: number;
    name: string;
    description?: string;
    publish: number;
    addedBy?: number;
    editedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}