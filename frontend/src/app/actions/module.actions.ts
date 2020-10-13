import {Action} from "@ngrx/store";
import {KanbanModule} from "../shared/interfaces/kanban-module.interface";

export enum ModuleActionTypes {
    LOAD_ALL_MODULES = "[Module] LOAD_ALL_MODULES",
    SET_ALL_MODULES = "[Module] SET_ALL_MODULES",
    CREATE_MODULE = "[Module] CREATE_MODULE",
    CREATE_MODULE_SUCCESS = "[Module] CREATE_MODULE_SUCCESS",
    UPDATE_MODULE = "[Module] UPDATE_MODULE",
    UPDATE_MODULE_SUCCESS = "[Module] UPDATE_MODULE_SUCCESS",
    DELETE_MODULE = "[Module] DELETE_MODULE",
    DELETE_MODULE_SUCCESS = "[Module] DELETE_MODULE_SUCCESS"
}

export class LoadAllModulesAction implements Action {
    readonly type = ModuleActionTypes.LOAD_ALL_MODULES;
    readonly payload = undefined;

    constructor() {
    }
}

export class SetAllModulesAction implements Action {
    readonly type = ModuleActionTypes.SET_ALL_MODULES;

    constructor(public payload: KanbanModule[]) {
    }
}

export class CreateModuleAction implements Action {
    readonly type = ModuleActionTypes.CREATE_MODULE;

    constructor(public payload: KanbanModule) {
    }
}

export class CreateModuleSuccessAction implements Action {
    readonly type = ModuleActionTypes.CREATE_MODULE_SUCCESS;

    constructor(public payload: KanbanModule) {
    }
}

export class UpdateModuleAction implements Action {
    readonly type = ModuleActionTypes.UPDATE_MODULE;

    constructor(public payload: KanbanModule) {
    }
}

export class UpdateModuleSuccessAction implements Action {
    readonly type = ModuleActionTypes.UPDATE_MODULE_SUCCESS;

    constructor(public payload: KanbanModule) {
    }
}

export class DeleteModuleAction implements Action {
    readonly type = ModuleActionTypes.DELETE_MODULE;

    constructor(public payload: string) {
    }
}

export class DeleteModuleSuccessAction implements Action {
    readonly type = ModuleActionTypes.DELETE_MODULE_SUCCESS;

    constructor(public payload: string) {
    }
}

export type ModuleActions =
    LoadAllModulesAction |
    SetAllModulesAction |
    CreateModuleAction |
    CreateModuleSuccessAction |
    UpdateModuleAction |
    UpdateModuleSuccessAction |
    DeleteModuleAction |
    DeleteModuleSuccessAction;
