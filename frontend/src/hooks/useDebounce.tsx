import { useEffect, useState } from "react"

const useDebounce = () => {
    // const [debounceValue, setDebounceValue] = useState<string>(value)
    // useEffect(() => {
    //     const process = setTimeout(() => {
    //         setDebounceValue(value)
    //     }, delay)

    //     return () => {
    //         clearTimeout(process)
    //     }
    // }, [value, delay])

    // return debounceValue

    const debounce = (func: any, timeout: 300) => {
        let timer: any;
        return (...args: any) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args)
            }, timeout);
        }
    }

    return { debounce };
}

export default useDebounce