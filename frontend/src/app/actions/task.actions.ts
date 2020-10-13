import {Action} from "@ngrx/store";
import {KanbanTask} from "../shared/interfaces/kanban-task.interface";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {RevertableDropEvent} from "../shared/interfaces/revertable-drop-event";

export enum TaskActionTypes {
    LOAD_ALL_TASKS = "[Task] LOAD_ALL_TASKS",
    SET_ALL_TASKS = "[Task] SET_ALL_TASKS",
    CREATE_TASK = "[Task] CREATE_TASK",
    CREATE_TASK_SUCCESS = "[Task] CREATE_TASK_SUCCESS",
    UPDATE_TASK = "[Task] UPDATE_TASK",
    UPDATE_TASK_SUCCESS = "[Task] UPDATE_TASK_SUCCESS",
    DELETE_TASK = "[Task] DELETE_TASK",
    DELETE_TASK_SUCCESS = "[Task] DELETE_TASK_SUCCESS",
    DELETE_MODULE_TASKS = "[Task] DELETE_MODULE_TASKS",
    UPDATE_TASK_ON_DRAG_DROP = "[Task] UPDATE_TASK_ON_DRAG_DROP"
}

export class LoadAllTasksAction implements Action {
    readonly type = TaskActionTypes.LOAD_ALL_TASKS;
    readonly payload = undefined;

    constructor() {
    }
}

export class SetAllTasksAction implements Action {
    readonly type = TaskActionTypes.SET_ALL_TASKS;

    constructor(public payload: KanbanTask[]) {
    }
}

export class CreateTaskAction implements Action {
    readonly type = TaskActionTypes.CREATE_TASK;

    constructor(public payload: KanbanTask) {
    }
}

export class CreateTaskSuccessAction implements Action {
    readonly type = TaskActionTypes.CREATE_TASK_SUCCESS;

    constructor(public payload: KanbanTask) {
    }
}

export class UpdateTaskAction implements Action {
    readonly type = TaskActionTypes.UPDATE_TASK;

    constructor(public payload: KanbanTask) {
    }
}

export class UpdateTaskSuccessAction implements Action {
    readonly type = TaskActionTypes.UPDATE_TASK_SUCCESS;

    constructor(public payload: KanbanTask) {
    }
}

export class DeleteTaskAction implements Action {
    readonly type = TaskActionTypes.DELETE_TASK;

    constructor(public payload: string) {
    }
}

export class DeleteTaskSuccessAction implements Action {
    readonly type = TaskActionTypes.DELETE_TASK_SUCCESS;

    constructor(public payload: string) {
    }
}

export class DeleteModuleTasksAction implements Action {
    readonly type = TaskActionTypes.DELETE_MODULE_TASKS;

    constructor(public payload: string) {
    }
}

export class UpdateTaskOnDragDropAction implements Action {
    readonly type = TaskActionTypes.UPDATE_TASK_ON_DRAG_DROP;

    constructor(public payload: RevertableDropEvent<KanbanTask[]>) {
    }
}

export type TaskActions =
    LoadAllTasksAction |
    SetAllTasksAction |
    CreateTaskAction |
    CreateTaskSuccessAction |
    UpdateTaskAction |
    UpdateTaskSuccessAction |
    DeleteTaskAction |
    DeleteTaskSuccessAction |
    DeleteModuleTasksAction |
    UpdateTaskOnDragDropAction;
