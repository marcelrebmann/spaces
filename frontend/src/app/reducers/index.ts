import {ActionReducerMap, createSelector} from "@ngrx/store";
import * as fromTask from "./task.reducer";
import * as fromModule from "./module.reducer";
import * as fromColumn from "./column.reducer";
import {KanbanTask} from "../shared/interfaces/kanban-task.interface";
import {KanbanColumn, KanbanColumnLimit} from "../shared/interfaces/kanban-column.interface";
import {KanbanModule, KanbanModuleWithData} from "../shared/interfaces/kanban-module.interface";

export interface AppState {
    modules: fromModule.ModuleState;
    columns: fromColumn.ColumnState;
    tasks: fromTask.TaskState;
}

export const reducers: ActionReducerMap<AppState, any> = {
    modules: fromModule.reducer,
    columns: fromColumn.reducer,
    tasks: fromTask.reducer
};

export const selectModules = (state: AppState) => state.modules;
export const selectColumns = (state: AppState) => state.columns;
export const selectTasks = (state: AppState) => state.tasks;

export const selectAllModules = createSelector(
    selectModules,
    (state: fromModule.ModuleState) => state.allModules
);
export const selectAllColumns = createSelector(
    selectColumns,
    (state: fromColumn.ColumnState) => state.allColumns
);
export const selectAllTasks = createSelector(
    selectTasks,
    (state: fromTask.TaskState) => state.allTasks
);

export const selectFirstLoadingStatus = createSelector(
    selectTasks,
    (state: fromTask.TaskState) => state.firstLoadingHappened
);

export const getAmountOfTasksInColumns = createSelector(
    selectAllTasks,
    selectAllColumns,
    (tasks: KanbanTask[], columns: KanbanColumn[]) => {
        return columns.map(col => {
            const taskCount = tasks.filter(task => task.column === col._id).length;
            return {
                id: col._id,
                name: col.name,
                limit: col.limit,
                taskCount,
                limitReached: col.limit !== 0 && taskCount >= col.limit
            } as KanbanColumnLimit;
        });
    }
);

export const getMergedKanbanBoardData = createSelector(
    selectAllTasks,
    selectAllColumns,
    selectAllModules,
    (tasks: KanbanTask[], columns: KanbanColumn[], modules: KanbanModule[]): KanbanModuleWithData[] => {
        const temp: { [key: string]: KanbanModuleWithData } = {};
        const columnIndexes = columns.map(col => col._id);
        for (let i = 0, len = modules.length; i < len; i++) {
            temp[modules[i]._id] = {
                module: modules[i],
                columns: columns.map(col => {
                    return {
                        column: col,
                        tasks: []
                    };
                })
            } as KanbanModuleWithData;
        }
        for (const task of tasks) {
            if (temp[task.module]) {
                const colIndex = columnIndexes.indexOf(task.column);
                if (colIndex < 0) {
                    // Should not occur! Task belongs to an unknown Column.
                    continue;
                }
                temp[task.module].columns[colIndex].tasks.push(task);
            }
        }
        return Object.values(temp);
    }
);
