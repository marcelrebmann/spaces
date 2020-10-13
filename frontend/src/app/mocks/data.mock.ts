import {KanbanColumn} from "../shared/interfaces/kanban-column.interface";
import {KanbanModule} from "../shared/interfaces/kanban-module.interface";
import {KanbanTask} from "../shared/interfaces/kanban-task.interface";

export const COLUMNS_MOCK: KanbanColumn[] = [
    {
        name: "Todo",
        limit: 0,
        _id: "1",
        _v: 1
    },
    {
        name: "In Progress",
        limit: 5,
        _id: "2",
        _v: 1
    },
    {
        name: "Done",
        limit: 0,
        _id: "3",
        _v: 1
    }
];

export const MODULES_MOCK: KanbanModule[] = [
    {
        name: "General Setup",
        _id: "1",
        _v: 1
    },
    {
        name: "Query this from that",
        _id: "2",
        _v: 1
    },
    {
        name: "Deployment of V1.0",
        _id: "3",
        _v: 1
    }
];

export const TASKS_MOCK: KanbanTask[] = [
    {
        _id: "1",
        name: "Project Setup",
        description: "Blabla Lorem ipsum",
        column: "Todo",
        module: "General Setup"
    },
    {
        _id: "2",
        name: "Feature XYZ implementation",
        description: "Blabla Lorem ipsum",
        column: "In Progress",
        module: "Query this from that"
    },
    {
        _id: "3",
        name: "Project Setup",
        description: "Blabla Lorem ipsum",
        column: "Todo",
        module: "Deployment of V1.0"
    },
    {
        _id: "4",
        name: "Configure Authentication for MongoDB",
        description: "Blabla Lorem ipsum",
        column: "Todo",
        module: "General Setup"
    }
];
