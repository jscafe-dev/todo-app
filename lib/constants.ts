export enum TASK_STATUS {
  TODO = "todo",
  IN_PROGRESS = "inProgress",
  DONE = "done",
}

export enum FILTERS {
  ALL = "all",
  TODO = "todo",
  IN_PROGRESS = "inProgress",
  DONE = "done",
}
export const breakpointColumnsObj = {
  default: 3,
  1280: 2,
  768: 1,
};

export const skeletonCardsData = [
    {
        id: 1,
        externalStyles: {
            textarea: 'h-10'
        }
    },
    {
        id: 2,
        externalStyles: {
            textarea: 'h-20'
        }
    },
    {
        id: 3,
        externalStyles: {
            textarea: 'h-52'
        }
    },
    {
        id: 4,
        externalStyles: {
            textarea: 'h-40'
        }
    },
    {
        id: 5,
        externalStyles: {
            textarea: 'h-60'
        }
    },
    {
        id: 6,
        externalStyles: {
            textarea: 'h-24'
        }
    }
]