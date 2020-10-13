import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {combineLatest, Observable, Subject} from "rxjs";
import {KanbanTask} from "../../shared/interfaces/kanban-task.interface";
import {
    AppState,
    getAmountOfTasksInColumns,
    selectAllModules,
    selectAllTasks,
    selectFirstLoadingStatus
} from "../../reducers";
import {select, Store} from "@ngrx/store";
import {debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {ToastrService} from "../../services/toastr.service";
import {ToastTypes} from "../../components/toast/toast.component";
import {KanbanModule} from "../../shared/interfaces/kanban-module.interface";
import {KanbanColumnLimit} from "../../shared/interfaces/kanban-column.interface";
import {CreateTaskAction, UpdateTaskAction} from "../../actions/task.actions";
import {ViewMode} from "../../shared/view-mode.enum";
import {LoadingChannel} from "../../channels/loading.channel";

@Component({
    selector: "app-task-container",
    templateUrl: "./task-container.component.html",
    styleUrls: ["./task-container.component.scss"]
})
export class TaskContainerComponent implements OnInit, OnDestroy {

    mode: ViewMode = ViewMode.CREATE;

    taskModel: KanbanTask = {
        name: "",
        module: "",
        column: "",
        description: ""
    };

    containerTitleKey = "task.create.title";

    readonly viewMode = ViewMode;

    showLoading = false;

    allTasks$: Observable<KanbanTask[]> = this.store.pipe(
        select(selectAllTasks)
    );

    allModules$: Observable<KanbanModule[]> = this.store.pipe(
        select(selectAllModules)
    );

    selectableColumns$: Observable<KanbanColumnLimit[]> = this.store.pipe(
        select(getAmountOfTasksInColumns)
    );

    initialLoadHappened$: Observable<boolean> = this.store.pipe(
        select(selectFirstLoadingStatus),
        distinctUntilChanged()
    );

    destroyed$ = new Subject<boolean>();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private store: Store<AppState>,
                private loadingChannel: LoadingChannel,
                private toastrService: ToastrService) {
    }

    ngOnInit(): void {
        this.loadingChannel.showTaskViewLoading$.pipe(
            takeUntil(this.destroyed$),
            debounceTime(50),
            tap((showLoading) => this.showLoading = showLoading)
        ).subscribe();

        const data = window.history.state.data as KanbanModule;
        if (data) {
            this.taskModel.module = data._id;
            return;
        }

        this.initialLoadHappened$.pipe(
            takeUntil(this.destroyed$),
            filter(loaded => !!loaded),
            switchMap(() => combineLatest(this.route.paramMap, this.allTasks$)),
            filter(([params, tasks]) => !!params.get("id")),
            map(([params, tasks]) => {
                const searchedId = params.get("id");
                for (let i = 0, len = tasks.length; i < len; i++) {
                    const task = tasks[i];
                    if (task._id === searchedId) {
                        this.taskModel = task;
                        this.containerTitleKey = "task.edit.title";
                        this.mode = ViewMode.EDIT;
                        return;
                    }
                }
                this.router.navigate(["task"]);
                this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.noTaskFound", [], {taskId: searchedId});
            })
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    handleSubmit() {
        if (this.mode === ViewMode.EDIT) {
            this.updateTask();
        } else if (this.mode === ViewMode.CREATE) {
            this.createNewTask();
        }
    }

    createNewTask(): void {
        this.store.dispatch(new CreateTaskAction(this.taskModel));
    }

    updateTask(): void {
        this.store.dispatch(new UpdateTaskAction(this.taskModel));
    }
}
