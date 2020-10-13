import {Action} from "@ngrx/store";
import {KanbanColumn} from "../shared/interfaces/kanban-column.interface";

export enum ColumnActionTypes {
    LOAD_ALL_COLUMNS = "[Column] LOAD_ALL_COLUMNS",
    SET_ALL_COLUMNS = "[Column] SET_ALL_COLUMNS",
    CREATE_COLUMN = "[Column] CREATE_COLUMN",
    CREATE_COLUMN_SUCCESS = "[Column] CREATE_COLUMN_SUCCESS",
    UPDATE_COLUMN = "[Column] UPDATE_COLUMN",
    UPDATE_COLUMN_SUCCESS = "[Column] UPDATE_COLUMN_SUCCESS",
    DELETE_COLUMN = "[Column] DELETE_COLUMN",
    DELETE_COLUMN_SUCCESS = "[Column] DELETE_COLUMN_SUCCESS",
    CREATE_KANBAN_LAYOUT = "[Column] CREATE_KANBAN_LAYOUT",
    CREATE_KANBAN_LAYOUT_SUCCESS = "[Column] CREATE_KANBAN_LAYOUT_SUCCESS"
}

export class LoadAllColumnsAction implements Action {
    readonly type = ColumnActionTypes.LOAD_ALL_COLUMNS;
    readonly payload = undefined;

    constructor() {
    }
}

export class SetAllColumnsAction implements Action {
    readonly type = ColumnActionTypes.SET_ALL_COLUMNS;

    constructor(public payload: KanbanColumn[]) {
    }
}

export class CreateColumnAction implements Action {
    readonly type = ColumnActionTypes.CREATE_COLUMN;

    constructor(public payload: KanbanColumn) {
    }
}

export class CreateColumnSuccessAction implements Action {
    readonly type = ColumnActionTypes.CREATE_COLUMN_SUCCESS;

    constructor(public payload: KanbanColumn) {
    }
}

export class UpdateColumnAction implements Action {
    readonly type = ColumnActionTypes.UPDATE_COLUMN;

    constructor(public payload: KanbanColumn) {
    }
}

export class UpdateColumnSuccessAction implements Action {
    readonly type = ColumnActionTypes.UPDATE_COLUMN_SUCCESS;

    constructor(public payload: KanbanColumn) {
    }
}

export class DeleteColumnAction implements Action {
    readonly type = ColumnActionTypes.DELETE_COLUMN;

    constructor(public payload: string) {
    }
}

export class DeleteColumnSuccessAction implements Action {
    readonly type = ColumnActionTypes.DELETE_COLUMN_SUCCESS;

    constructor(public payload: string) {
    }
}

export class CreateKanbanLayoutAction implements Action {
    readonly type = ColumnActionTypes.CREATE_KANBAN_LAYOUT;
    readonly payload = undefined;

    constructor() {
    }
}

export class CreateKanbanLayoutSuccessAction implements Action {
    readonly type = ColumnActionTypes.CREATE_KANBAN_LAYOUT_SUCCESS;

    constructor(public payload: KanbanColumn[]) {
    }
}

export type ColumnActions =
    LoadAllColumnsAction |
    SetAllColumnsAction |
    CreateColumnAction |
    CreateColumnSuccessAction |
    UpdateColumnAction |
    UpdateColumnSuccessAction |
    DeleteColumnAction |
    DeleteColumnSuccessAction |
    CreateKanbanLayoutAction |
    CreateKanbanLayoutSuccessAction;
