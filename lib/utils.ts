import { FILTERS } from "@/lib/constants";


/**
 * Returns string corresponding to Filter type
 * @param filter 
 * @returns string
 */
export const getFilterStatusText = (filter: FILTERS) => {
    const stringStore = {
        [FILTERS.ALL]: "All",
        [FILTERS.TODO]: "Todo",
        [FILTERS.IN_PROGRESS]: "In Progress",
        [FILTERS.DONE]: "Done",
    }
    return stringStore[filter]
}
