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

// export type FormInputs = {
//     first_name: string;
//     middle_name: string;
//     last_name: string;
//     email: string;
//     phone: string;
//     password: string;
//     confirm_password: string;
//     birth_date: string;
//     gender: string;
//     catalogue: string;
// };

// export const UserPayloads = (
//     formData: FormInputs,
//     images: { preview: string }[],
//     selectedBox: any[]
// ): PayloadInputs => {
//     return {
//         publish: 1,
//         firstName: formData.first_name,
//         middleName: formData.middle_name,
//         lastName: formData.last_name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         img: images.length > 0 ? images[0].preview : null,
//         birthDate: formData.birth_date ? `${formData.birth_date}T00:00:00` : null,
//         gender: selectedBox.find((gender) => gender.name === "gender")?.options.find((opt: any) => opt.value === formData.gender)?.id,
//         userCatalogueIds: [Number(formData.catalogue)],
//     };
// };

