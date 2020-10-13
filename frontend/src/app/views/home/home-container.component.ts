import {Component, OnDestroy, OnInit} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {AppState, getAmountOfTasksInColumns, getMergedKanbanBoardData} from "../../reducers";
import {Observable, Subject} from "rxjs";
import {KanbanColumnLimit} from "../../shared/interfaces/kanban-column.interface";
import {KanbanModuleWithData} from "../../shared/interfaces/kanban-module.interface";
import {DeleteTaskAction, UpdateTaskOnDragDropAction} from "../../actions/task.actions";
import {CreateKanbanLayoutAction, DeleteColumnAction} from "../../actions/column.actions";
import {LoadingChannel} from "../../channels/loading.channel";
import {debounceTime, takeUntil, tap} from "rxjs/operators";
import {DeleteModuleAction} from "../../actions/module.actions";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {KanbanTask} from "../../shared/interfaces/kanban-task.interface";
import {RevertableDropEvent} from "../../shared/interfaces/revertable-drop-event";

@Component({
    selector: "app-home",
    templateUrl: "./home-container.component.html",
    styleUrls: ["./home-container.component.scss"]
})
export class HomeContainerComponent implements OnInit, OnDestroy {

    columnsWithLimits$: Observable<KanbanColumnLimit[]> = this.store.pipe(
        select(getAmountOfTasksInColumns)
    );

    mergedKanbanData$: Observable<KanbanModuleWithData[]> = this.store.pipe(
        select(getMergedKanbanBoardData)
    );

    destroyed$ = new Subject<boolean>();

    showLoading = false;

    constructor(private store: Store<AppState>,
                private loadingChannel: LoadingChannel) {
    }

    ngOnInit(): void {
        this.loadingChannel.showMainViewLoading$.pipe(
            takeUntil(this.destroyed$),
            debounceTime(50),
            tap((showLoading) => this.showLoading = showLoading)
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    deleteTask(taskId: string): void {
        this.store.dispatch(new DeleteTaskAction(taskId));
    }

    deleteModule(moduleId: string): void {
        this.store.dispatch(new DeleteModuleAction(moduleId));
    }

    deleteColumn(columnId: string): void {
        this.store.dispatch(new DeleteColumnAction(columnId));
    }

    updateTaskAfterDragDrop(event: RevertableDropEvent<KanbanTask[]>): void {
        this.store.dispatch(new UpdateTaskOnDragDropAction(event));
    }

    createKanbanLayout(): void {
        this.store.dispatch(new CreateKanbanLayoutAction());
    }
}
