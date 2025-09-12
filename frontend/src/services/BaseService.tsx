import { AxiosInstance } from "axios";

const baseSave = async (
    instance: AxiosInstance,
    apiUrl: string, 
    payload: Record<string, any>, 
    updateParams: { action: string, id: string | null }
) => {
    const body: Record<string, any> = {}
    const keys = Object.keys(payload) as Array<keyof typeof payload>

    keys.forEach((key) => {
        const value = payload[key]
        if (value instanceof FileList) {
            

        } else if (value instanceof File) {


        } else if (Array.isArray(value)) {
            value.forEach((item) => {
                if (!Array.isArray(body[key as string])) body[key as string] = []
                ;(body[key as string] as any[]).push(item)
            })
        } else if (value !== null && value !== undefined) {
            body[key as string] = value
        }
    })

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
    baseRemove
}

