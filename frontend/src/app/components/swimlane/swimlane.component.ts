import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from "@angular/core";
import {KanbanModuleWithData} from "../../shared/interfaces/kanban-module.interface";
import {Router} from "@angular/router";
import {KanbanColumnLimit} from "../../shared/interfaces/kanban-column.interface";
import {Subject} from "rxjs";
import {CdkDrag, CdkDragDrop, CdkDropList, transferArrayItem} from "@angular/cdk/drag-drop";
import {KanbanTask} from "../../shared/interfaces/kanban-task.interface";
import {RevertableDropEvent} from "../../shared/interfaces/revertable-drop-event";

@Component({
    selector: "app-swimlane",
    templateUrl: "./swimlane.component.html",
    styleUrls: ["./swimlane.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwimlaneComponent implements OnInit, OnDestroy {

    @Input()
    data: KanbanModuleWithData;

    @Input()
    columnLimitState: KanbanColumnLimit[];

    @Output()
    deleteTaskClicked = new EventEmitter<string>();

    @Output()
    deleteModuleClicked = new EventEmitter<string>();

    @Output()
    taskDropped = new EventEmitter<RevertableDropEvent<KanbanTask[]>>();

    destroyed$ = new Subject<boolean>();

    constructor(private router: Router, private ref: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    openCreateTaskView(): void {
        this.router.navigate(["task"], {
            state: {
                data: this.data.module
            }
        });
    }

    emitModuleDeletion(moduleId: string): void {
        this.deleteModuleClicked.emit(moduleId);
    }

    openEditTaskView(taskId: string): void {
        this.router.navigate(["task", taskId]);
    }

    openEditModuleView(moduleId: string): void {
        this.router.navigate(["module", moduleId]);
    }

    emitTaskDeletion(taskId: string): void {
        this.deleteTaskClicked.emit(taskId);
    }

    emitTaskDropped(dragDropEvent: CdkDragDrop<KanbanTask[]>): void {
        this.taskDropped.emit({
            dragDropEvent,
            errorHandler: () => this.revertDropped(dragDropEvent)
        });
    }

    handleTaskDropped(event: CdkDragDrop<KanbanTask[]>) {
        // Only triggers, if the task is moved into another column.
        if (event.previousContainer !== event.container) {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
            this.emitTaskDropped(event);
        }
    }

    revertDropped(event: CdkDragDrop<KanbanTask[]>): void {
        transferArrayItem(event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex);
        // Workaround is needed to trigger Angular's change detection manually here to show the reversion of the drop.
        this.ref.markForCheck();
    }

    getConnectedDragLists(columnId: string): string[] {
        return this.data.columns
            .filter(col => col.column._id !== columnId)
            .map(col => `${this.data.module._id}_${col.column._id}`);
    }

    respectColumnLimitPredicate(drag: CdkDrag, drop: CdkDropList): boolean {
        const columnId = drop.id;
        return !document.getElementById(columnId).classList.contains("limit-reached");
    }
}
