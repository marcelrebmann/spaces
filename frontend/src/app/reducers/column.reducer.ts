import {ColumnActions, ColumnActionTypes} from "../actions/column.actions";
import {KanbanColumn} from "../shared/interfaces/kanban-column.interface";

export interface ColumnState {
    allColumns: KanbanColumn[];
}

const initialState: ColumnState = {
    allColumns: []
};

export function reducer(state = initialState, action: ColumnActions): ColumnState {
    switch (action.type) {
        case ColumnActionTypes.SET_ALL_COLUMNS:
            return {
                ...state,
                allColumns: action.payload
            };
        case ColumnActionTypes.CREATE_COLUMN_SUCCESS:
            return {
                ...state,
                allColumns: [].concat(state.allColumns, action.payload)
            };
        case ColumnActionTypes.UPDATE_COLUMN_SUCCESS:
            const editedColumn = action.payload;
            const columnList: KanbanColumn[] = [].concat(state.allColumns);
            for (let i = 0, len = columnList.length; i < len; i++) {
                if (columnList[i]._id === editedColumn._id) {
                    columnList[i] = editedColumn;
                    break;
                }
            }
            return {
                ...state,
                allColumns: columnList
            };
        case ColumnActionTypes.DELETE_COLUMN_SUCCESS:
            return {
                ...state,
                allColumns: [].concat(state.allColumns.filter(column => column._id !== action.payload))
            };
        case ColumnActionTypes.CREATE_KANBAN_LAYOUT_SUCCESS:
            return {
                ...state,
                allColumns: [].concat(action.payload)
            };
        default:
            return state;
    }
}
