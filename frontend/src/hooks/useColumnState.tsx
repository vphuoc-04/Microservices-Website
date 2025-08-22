import { updateStatusByField } from "@/services/UserService"
import { useState } from "react"

interface ColumnState {
    [columnName: string]: boolean
}

interface UserState {
    [userId: string] : ColumnState
}

interface ColumnStateReturn {
    columnState: UserState,
    handleChecked: (userId: string, columnName: string) => void
    setInitialColumnState: (users: any[], columnName: string) => void
}

const useColumnState = (): ColumnStateReturn => {
    const [columnState, setColumnState] = useState<UserState>({})

    const handleChecked = (userId: string, columnName: string) => {
        const isChecked = columnState[userId]?.[columnName] || false;
        const params = {
            id: userId,
            publish: isChecked ? 1 : 2,  
            column: 'publish',
            model: 'users'
        }

        updateStatusByField(params)

        setColumnState((prevState) => ({
            ...prevState,
            [userId]: {
                ...prevState[userId],
                [columnName]: !isChecked
            }
        }))
    }

    const setInitialColumnState = (users: any[], columnName: string) => {
        const initialState = users.reduce((acc: UserState, user: any) => {
            acc[user.id] = {
                [columnName]: user[columnName] === 2 ? true : false
            }
            return acc
        }, {})

        setColumnState(initialState) 
    }

    return { columnState, handleChecked, setInitialColumnState }
}

export default useColumnState;