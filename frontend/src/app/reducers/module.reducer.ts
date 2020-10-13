import {ModuleActions, ModuleActionTypes} from "../actions/module.actions";
import {KanbanModule} from "../shared/interfaces/kanban-module.interface";

export interface ModuleState {
    allModules: KanbanModule[];
}

const initialState: ModuleState = {
    allModules: []
};

export function reducer(state = initialState, action: ModuleActions): ModuleState {
    switch (action.type) {
        case ModuleActionTypes.SET_ALL_MODULES:
            return {
                ...state,
                allModules: action.payload
            };
        case ModuleActionTypes.CREATE_MODULE_SUCCESS:
            return {
                ...state,
                allModules: [].concat(state.allModules, action.payload)
            };
        case ModuleActionTypes.UPDATE_MODULE_SUCCESS:
            const editedModule = action.payload;
            const moduleList: KanbanModule[] = [].concat(state.allModules);
            for (let i = 0, len = moduleList.length; i < len; i++) {
                if (moduleList[i]._id === editedModule._id) {
                    moduleList[i] = editedModule;
                    break;
                }
            }
            return {
                ...state,
                allModules: moduleList
            };
        case ModuleActionTypes.DELETE_MODULE_SUCCESS:
            return {
                ...state,
                allModules: [].concat(state.allModules.filter(module => module._id !== action.payload))
            };
        default:
            return state;
    }
}
