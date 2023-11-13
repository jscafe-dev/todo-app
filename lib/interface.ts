import { TASK_STATUS } from "@/lib/constants";

export interface Task {
    id: string,
    title: string,
    description: string,
    status: TASK_STATUS
}