import {KanbanColumnWithTasks} from "./kanban-column.interface";

export interface KanbanModule {
    name: string;
    _id?: string;
    _v?: number;
}

export interface KanbanModuleWithData {
    module: KanbanModule;
    columns: KanbanColumnWithTasks[];
}
