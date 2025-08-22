import { CheckedStateInterface } from "@/interfaces/BaseServiceInterface"
import { deleteMany, updateFieldByParams } from "@/services/UserService"

const useFilterAction = () => {
    const actionSwitch = async (
        action: string,
        selectedValue: string,
        { checkedState }: CheckedStateInterface,
        model: string,
        refetch: any
    ) => {
        const ids = Object.keys(checkedState)
            .filter((key) => checkedState[Number(key)])
            .map(Number); 

        switch (action) {
            case 'deleteMany':
                await deleteMany(ids);
                refetch(); 
                break;

            case 'publish':
                await updateFieldByParams(ids, model, Number(selectedValue), refetch);
                break;
                
            default:
                break;
        }
    };

    return { actionSwitch }
}

export default useFilterAction
