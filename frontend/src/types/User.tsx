export type User = {
    id: number,
    img: string,
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
    img?: File | null; // upload file
    birthDate: string | null;
    gender: number | undefined;
    userCatalogueId: number[];
}