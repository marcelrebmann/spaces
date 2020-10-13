import {Actions, Effect, ofType} from "@ngrx/effects";
import {TaskService} from "../services/task.service";
import {ModuleService} from "../services/module.service";
import {ColumnService} from "../services/column.service";
import {Injectable} from "@angular/core";
import {LoadAllDataAction, MetaActionTypes, RequestFailedAction} from "../actions/meta.actions";
import {forkJoin, of} from "rxjs";
import {SetAllTasksAction} from "../actions/task.actions";
import {catchError, map, mergeMap, switchMap, tap, timeout} from "rxjs/operators";
import {SetAllModulesAction} from "../actions/module.actions";
import {SetAllColumnsAction} from "../actions/column.actions";
import {ToastrService} from "../services/toastr.service";
import {ToastActionTypes, ToastTypes} from "../components/toast/toast.component";
import {Store} from "@ngrx/store";
import {AppState} from "../reducers";
import {LoadingChannel} from "../channels/loading.channel";

@Injectable()
export class MetaEffects {

    @Effect()
    loadAllData$ = this.actions$.pipe(
        ofType<LoadAllDataAction>(MetaActionTypes.LOAD_ALL_DATA),
        mergeMap(() => {
            this.loadingChannel.showMainViewLoading$.next(true);
            return forkJoin([
                this.taskService.loadAllTasks(),
                this.moduleService.loadAllModules(),
                this.columnService.loadAllColumns()
            ]).pipe(
                timeout(5000)
            );
        }),
        switchMap(([tasks, modules, columns]) => {
            return [
                new SetAllColumnsAction(columns),
                new SetAllModulesAction(modules),
                new SetAllTasksAction(tasks)
            ];
        }),
        tap(() => this.loadingChannel.showMainViewLoading$.next(false)),
        catchError(() => {
            this.loadingChannel.showMainViewLoading$.next(false);
            this.toastrService.showToast(
                ToastTypes.FAILED,
                "toasts.error.loadAllDataFailed",
                [{
                    type: ToastActionTypes.RETRY,
                    actionHandler: () => this.store.dispatch(new LoadAllDataAction())
                }]
            );
            return of(new RequestFailedAction());
        })
    );

    constructor(private actions$: Actions,
                private store: Store<AppState>,
                private taskService: TaskService,
                private moduleService: ModuleService,
                private columnService: ColumnService,
                private toastrService: ToastrService,
                private loadingChannel: LoadingChannel) {
    }
}
