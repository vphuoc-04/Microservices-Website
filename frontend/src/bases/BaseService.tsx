import { AxiosInstance } from "axios";

import { uploadService } from "@/services/UploadService";

interface Pagination<T = any> {
  items: T[]
  pagination: {
    totalPages: number
    totalElements: number
    page: number
    size: number
    last: boolean
  } | null
}

const basePagination = async (
    instance: AxiosInstance, 
    apiUrl: string, 
    queryString: string,
    transformData?: (data: any[]) => Promise<any[]> | any[]
): Promise<Pagination> => {
    try {
        const response = await instance.get(`${apiUrl}/pagination?${queryString}`);
        const pageData = response.data?.data;
        
        let items = pageData?.content || [];
        
        if (transformData) {
            items = await Promise.resolve(transformData(items));
        }

        return {
            items,
            pagination: {                    
                totalPages: pageData?.totalPages,
                totalElements: pageData?.totalElements,
                page: pageData?.number,
                size: pageData?.size,
                last: pageData?.last
            }
        };

    } catch (error) {
        return { items: [], pagination: null };
    }
};

const baseSave = async (
    instance: AxiosInstance,
    apiUrl: string, 
    payload: Record<string, any>, 
    updateParams: { action: string, id: string | null }
) => {
    const body: Record<string, any> = {}
    const keys = Object.keys(payload) as Array<keyof typeof payload>

    // Handle fields including potential file upload for avatar image
    for (const key of keys) {
        const value = payload[key]

        // Special handling for single file image field like 'img'
        if (value instanceof File) {
            // Upload the file and send only file id to backend
            const uploaded = await uploadService.uploadSingleFile(value, 'avatar', undefined, true)
            body.imgId = uploaded.id
            continue
        }

        if (value instanceof FileList) {
            // If ever needed, take the first file as a single image
            const first = value.item(0)
            if (first) {
                const uploaded = await uploadService.uploadSingleFile(first, 'avatar', undefined, true)
                body.imgId = uploaded.id
            }
            continue
        }

        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (!Array.isArray(body[key as string])) body[key as string] = []
                ;(body[key as string] as any[]).push(item)
            })
            continue
        }

        if (value !== null && value !== undefined) {
            body[key as string] = value
        }
    }

    delete (body as any).confirmPassword

    // Chuẩn hoá trường để khớp BE
    if (body.gender !== undefined && body.gender !== null) {
        body.gender = typeof body.gender === 'string' ? Number(body.gender) : body.gender
    }
    if (body.userCatalogueId !== undefined && body.userCatalogueId !== null) {
        const normalized = Array.isArray(body.userCatalogueId)
            ? body.userCatalogueId.map((v: any) => typeof v === 'string' ? Number(v) : v)
            : [typeof body.userCatalogueId === 'string' ? Number(body.userCatalogueId) : body.userCatalogueId]
        body.userCatalogueIds = normalized
        delete body.userCatalogueId
    }
    if (typeof body.birthDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.birthDate)) {
        body.birthDate = `${body.birthDate}T00:00:00`
    }
    if (body.password === '' || body.password === null) {
        delete body.password
    }

    let url = apiUrl
    if (updateParams.action === 'update' && updateParams.id) {
        url = `${apiUrl}/update/${updateParams.id}`
    } else {
        url = `${apiUrl}/create`
    }

    const response = updateParams.action === 'update' && updateParams.id
        ? await instance.put(url, body)
        : await instance.post(url, body)

    return response.data
}

const baseRemove =  async (instance: AxiosInstance, apiUrl: string, id: string) => {
    const response = await instance.delete(`${apiUrl}/delete/${id}`)    
    return response.data;
}

export { 
    baseSave,
    baseRemove,
    basePagination
}

