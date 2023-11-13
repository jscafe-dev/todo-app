import { FILTERS } from "@/lib/constants";

export const getFilterStatusText = (filter: FILTERS) => {
    const stringStore = {
        [FILTERS.ALL]: "All",
        [FILTERS.TODO]: "Todo",
        [FILTERS.IN_PROGRESS]: "In Progress",
        [FILTERS.DONE]: "Done",
    }
    return stringStore[filter]
}
