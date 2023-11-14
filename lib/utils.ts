import { FILTERS, TASK_STATUS } from "@/lib/constants";


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

export const getStatusText = (task: TASK_STATUS) => {
    const stringStore = {
        [TASK_STATUS.TODO]: "Todo",
        [TASK_STATUS.IN_PROGRESS]: "In Progress",
        [TASK_STATUS.DONE]: "Done",
    }
    return stringStore[task]
}