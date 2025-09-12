import { useEffect, useState } from "react"

interface UseAllDifferentProps {
    watchedValues: any
    getCurrentValues: () => Record<string, any>
    initialValues: Record<string, any> | null
    keysToCheck: string[]
}

const normalizeValue = (value: any) => {
    if (Array.isArray(value)) return JSON.stringify(value)
    if (typeof value === 'string') return value.trim()
    return value ?? ''
}

const useAllDifferent = (
    { watchedValues, getCurrentValues, initialValues, keysToCheck }: UseAllDifferentProps
) => {
    const [isChanged, setIsChanged] = useState(false)

    useEffect(() => {
        if (!initialValues) {
            setIsChanged(false)
            return
        }

        const currentValues = getCurrentValues()
        const hasChanged = keysToCheck.some((key) => {
            const current = normalizeValue(currentValues[key])
            const initial = normalizeValue(initialValues[key])
            return current !== initial
        })
        setIsChanged(hasChanged)
    }, [JSON.stringify(watchedValues), initialValues, getCurrentValues, keysToCheck])

    return isChanged
}

export default useAllDifferent
