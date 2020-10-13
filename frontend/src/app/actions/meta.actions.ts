import {Action} from "@ngrx/store";

export enum MetaActionTypes {
    LOAD_ALL_DATA = "[Meta] LOAD_ALL_DATA",
    REQUEST_FAILED = "[Meta] REQUEST_FAILED"
}

export class LoadAllDataAction implements Action {
    readonly type = MetaActionTypes.LOAD_ALL_DATA;
    readonly payload = undefined;

    constructor() {
    }
}

export class RequestFailedAction implements Action {
    readonly type = MetaActionTypes.REQUEST_FAILED;
    readonly payload = undefined;

    constructor() {
    }
}

export type MetaActions = LoadAllDataAction | RequestFailedAction;
