import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {KanbanTask} from "../../shared/interfaces/kanban-task.interface";

@Component({
    selector: "app-task-card",
    templateUrl: "./task-card.component.html",
    styleUrls: ["./task-card.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent {

    @Input()
    task: KanbanTask;

    @Output()
    editClicked = new EventEmitter<string>();

    @Output()
    deleteClicked = new EventEmitter<string>();

    constructor() {
    }

    emitEditClick(): void {
        this.editClicked.emit(this.task._id);
    }

    emitDeleteClick(): void {
        this.deleteClicked.emit(this.task._id);
    }
}
