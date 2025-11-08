import { useState, useEffect } from 'react'

import { filterConfigs } from '@/constants/filters'
import { ModelFilterConfig } from '@/interfaces/BaseServiceInterface'

export const useFilterConfig = (model: string) => {
    const [config, setConfig] = useState<ModelFilterConfig | null>(null)

    useEffect(() => {
        const loadConfig = async () => {    
            const configData = filterConfigs[model]
            setConfig(configData || null)
        }

        loadConfig()
    }, [model])

    return { config }
}