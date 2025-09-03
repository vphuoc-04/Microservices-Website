import React, { useState } from "react"

interface ImageUploadResult {
    file: File,
    preview: string
}

const useUpload = (multiple: boolean = false) => {
    const [images, setImages] = useState<ImageUploadResult[]>([])

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
            const files = Array.from(event.target.files)
            const imagePreviews = files.map((file) => ({
                file,
                preview: URL.createObjectURL(file)
            })) 
            setImages(multiple ? [...images, ...imagePreviews] : imagePreviews)
        }
    }

    return {
        images,
        setImages,
        handleImageChange
    }
}

export default useUpload