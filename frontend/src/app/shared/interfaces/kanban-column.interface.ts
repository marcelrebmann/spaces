import {KanbanTask} from "./kanban-task.interface";

export interface KanbanColumn {
    name: string;
    limit: number;
    _id?: string;
    _v?: number;
}

export interface KanbanColumnWithTasks {
    column: KanbanColumn;
    tasks: KanbanTask[];
}

export interface KanbanColumnLimit {
    id: string;
    name: string;
    limit: number;
    taskCount: number;
    limitReached: boolean;
}
