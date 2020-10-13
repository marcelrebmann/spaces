import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {KanbanModuleWithData} from "../../shared/interfaces/kanban-module.interface";
import {KanbanColumnLimit} from "../../shared/interfaces/kanban-column.interface";
import {Router} from "@angular/router";
import {KanbanTask} from "../../shared/interfaces/kanban-task.interface";
import {RevertableDropEvent} from "../../shared/interfaces/revertable-drop-event";

@Component({
    selector: "app-kanban-board",
    templateUrl: "./kanban-board.component.html",
    styleUrls: ["./kanban-board.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanBoardComponent {

    @Input()
    data: KanbanModuleWithData[] = [];

    @Input()
    columns: KanbanColumnLimit[];

    @Output()
    deleteTask = new EventEmitter<string>();

    @Output()
    deleteColumn = new EventEmitter<string>();

    @Output()
    deleteModule = new EventEmitter<string>();

    @Output()
    taskDropped = new EventEmitter<RevertableDropEvent<KanbanTask[]>>();

    @Output()
    createKanbanLayout = new EventEmitter<void>();

    constructor(private router: Router) {
    }

    openCreateModuleView(): void {
        this.router.navigate(["module"]);
    }

    openCreateColumnView(): void {
        this.router.navigate(["column"]);
    }

    openEditColumnView(columnId: string): void {
        this.router.navigate(["column", columnId]);
    }

    emitTaskDeletion(taskId: string): void {
        this.deleteTask.emit(taskId);
    }

    emitModuleDeletion(moduleId: string): void {
        this.deleteModule.emit(moduleId);
    }

    emitColumnDeletion(columnId: string): void {
        this.deleteColumn.emit(columnId);
    }

    emitTaskDropped(event: RevertableDropEvent<KanbanTask[]>): void {
        this.taskDropped.emit(event);
    }

    emitCreateKanbanLayout(): void {
        this.createKanbanLayout.emit();
    }
}
