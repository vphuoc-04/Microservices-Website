export type User = {
    id: number,
    imgId: number | null,
    imgUrl: string | null,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    phone: string,
    birthDate: string,
    gender: number,
    userCatalogueId: number,
    userCatalogueName: string
}

export type PayloadInputs = {
    publish: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;  // chỉ khi create
    confirmPassword?: string; // chỉ để validate FE, không gửi BE
    img?: File | null; // upload file (local only)
    imgId?: number | null; // send to BE
    imgUrl?: string | null; // send to BE
    birthDate: string | null;
    gender: number | undefined;
    userCatalogueId: number[];
}