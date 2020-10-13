import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {
    CreateTaskAction,
    CreateTaskSuccessAction, DeleteModuleTasksAction, DeleteTaskAction, DeleteTaskSuccessAction,
    LoadAllTasksAction,
    SetAllTasksAction,
    TaskActionTypes, UpdateTaskAction, UpdateTaskOnDragDropAction, UpdateTaskSuccessAction
} from "../actions/task.actions";
import {catchError, map, mergeMap, tap} from "rxjs/operators";
import {TaskService} from "../services/task.service";
import {of} from "rxjs";
import {ToastrService} from "../services/toastr.service";
import {ToastActionTypes, ToastTypes} from "../components/toast/toast.component";
import {RequestFailedAction} from "../actions/meta.actions";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../reducers";
import {HttpErrorResponse} from "@angular/common/http";
import {LoadingChannel} from "../channels/loading.channel";
import {DeleteModuleSuccessAction, ModuleActionTypes} from "../actions/module.actions";
import {KanbanTask} from "../shared/interfaces/kanban-task.interface";
import {transferArrayItem} from "@angular/cdk/drag-drop";

@Injectable()
export class TaskEffects {

    @Effect()
    loadAllTasks$ = this.actions$.pipe(
        ofType<LoadAllTasksAction>(TaskActionTypes.LOAD_ALL_TASKS),
        mergeMap(() => {
            return this.taskService.loadAllTasks().pipe(
                map(tasks => new SetAllTasksAction(tasks)),
                catchError(() => {
                    this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.loadAllTasksFailed");
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    createTask$ = this.actions$.pipe(
        ofType<CreateTaskAction>(TaskActionTypes.CREATE_TASK),
        mergeMap((action) => {
            this.loadingChannel.showTaskViewLoading$.next(true);
            return this.taskService.createTask(action.payload).pipe(
                map((newTask) => new CreateTaskSuccessAction(newTask)),
                tap(() => {
                    this.loadingChannel.showTaskViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.SUCCESS, "toasts.success.createTask");
                    this.router.navigate(["home"]);
                }),
                catchError((err: HttpErrorResponse) => {
                    this.loadingChannel.showTaskViewLoading$.next(false);
                    if (err.error && err.error.code === 11000) {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.taskNameExists");
                    } else {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.createTaskFailed", [{
                            type: ToastActionTypes.RETRY,
                            actionHandler: () => this.store.dispatch(new CreateTaskAction(action.payload))
                        }]);
                    }
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    updateTask$ = this.actions$.pipe(
        ofType<UpdateTaskAction>(TaskActionTypes.UPDATE_TASK),
        mergeMap((action) => {
            this.loadingChannel.showTaskViewLoading$.next(true);
            return this.taskService.updateTask(action.payload).pipe(
                map((newTask) => new UpdateTaskSuccessAction(newTask)),
                tap(() => {
                    this.loadingChannel.showTaskViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.SUCCESS, "toasts.success.updateTask");
                    this.router.navigate(["home"]);
                }),
                catchError((err: HttpErrorResponse) => {
                    this.loadingChannel.showTaskViewLoading$.next(false);
                    if (err.error && err.error.code === 11000) {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.taskNameExists");
                    } else {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.updateTaskFailed", [{
                            type: ToastActionTypes.RETRY,
                            actionHandler: () => this.store.dispatch(new UpdateTaskAction(action.payload))
                        }]);
                    }
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    deleteTask$ = this.actions$.pipe(
        ofType<DeleteTaskAction>(TaskActionTypes.DELETE_TASK),
        mergeMap((action) => {
            this.loadingChannel.showMainViewLoading$.next(true);
            return this.taskService.deleteTask(action.payload).pipe(
                map((report) => {
                    if (report.ok) {
                        return new DeleteTaskSuccessAction(action.payload);
                    } else {
                        throw new Error();
                    }
                }),
                tap(() => {
                    this.loadingChannel.showMainViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.SUCCESS, "toasts.success.deleteTask");
                    this.router.navigate(["home"]);
                }),
                catchError(() => {
                    this.loadingChannel.showMainViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.deleteTaskFailed", [{
                        type: ToastActionTypes.RETRY,
                        actionHandler: () => this.store.dispatch(new DeleteTaskAction(action.payload))
                    }]);
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    deleteTasksOfModule$ = this.actions$.pipe(
        ofType<DeleteModuleSuccessAction>(ModuleActionTypes.DELETE_MODULE_SUCCESS),
        map(action => new DeleteModuleTasksAction(action.payload))
    );

    @Effect()
    updateTaskOnDragDrop$ = this.actions$.pipe(
        ofType<UpdateTaskOnDragDropAction>(TaskActionTypes.UPDATE_TASK_ON_DRAG_DROP),
        mergeMap((action) => {
            this.loadingChannel.showMainViewLoading$.next(true);
            const task = action.payload.dragDropEvent.item.data as KanbanTask;
            const newColumnId = action.payload.dragDropEvent.container.element.nativeElement.id.split("_")[1];
            task.column = newColumnId;
            return this.taskService.updateTask(task).pipe(
                map((updatedTask: KanbanTask) => {
                    this.loadingChannel.showMainViewLoading$.next(false);
                    return new UpdateTaskSuccessAction(updatedTask);
                }),
                catchError(() => {
                    this.loadingChannel.showMainViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.updateTaskFailed");
                    action.payload.errorHandler();
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    constructor(private actions$: Actions,
                private store: Store<AppState>,
                private loadingChannel: LoadingChannel,
                private taskService: TaskService,
                private toastrService: ToastrService,
                private router: Router) {
    }
}
