export type Permission = {
    id: number;
    name: string;
    description?: string;
    publish: number;
    addedBy?: number;
    editedBy?: number;
}

export type PayloadInputs = {
    id: number;
    name: string;
    description?: string;
    publish: number;
}