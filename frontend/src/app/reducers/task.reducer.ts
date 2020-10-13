import {TaskActions, TaskActionTypes} from "../actions/task.actions";
import {KanbanTask} from "../shared/interfaces/kanban-task.interface";

export interface TaskState {
    selectedTask: string;
    allTasks: KanbanTask[];
    firstLoadingHappened: boolean;
}

const initialState: TaskState = {
    selectedTask: null,
    allTasks: [],
    firstLoadingHappened: false
};

export function reducer(state = initialState, action: TaskActions): TaskState {
    switch (action.type) {
        case TaskActionTypes.SET_ALL_TASKS:
            return {
                ...state,
                allTasks: action.payload,
                firstLoadingHappened: true
            };
        case TaskActionTypes.CREATE_TASK_SUCCESS:
            return {
                ...state,
                allTasks: [].concat(state.allTasks, action.payload)
            };
        case TaskActionTypes.UPDATE_TASK_SUCCESS:
            const editedTask = action.payload;
            const taskList: KanbanTask[] = [].concat(state.allTasks);
            for (let i = 0, len = taskList.length; i < len; i++) {
                if (taskList[i]._id === editedTask._id) {
                    taskList[i] = editedTask;
                    break;
                }
            }
            return {
                ...state,
                allTasks: taskList
            };
        case TaskActionTypes.DELETE_TASK_SUCCESS:
            return {
                ...state,
                allTasks: state.allTasks.filter(task => task._id !== action.payload)
            };
        case TaskActionTypes.DELETE_MODULE_TASKS:
            return {
                ...state,
                allTasks: state.allTasks.filter(task => task.module !== action.payload)
            };
        default:
            return state;
    }
}
