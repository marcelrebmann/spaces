import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap, tap} from "rxjs/operators";
import {forkJoin, of} from "rxjs";
import {ColumnService} from "../services/column.service";
import {
    ColumnActionTypes,
    CreateColumnAction,
    CreateColumnSuccessAction, CreateKanbanLayoutAction, CreateKanbanLayoutSuccessAction,
    DeleteColumnAction,
    DeleteColumnSuccessAction,
    LoadAllColumnsAction,
    SetAllColumnsAction,
    UpdateColumnAction,
    UpdateColumnSuccessAction
} from "../actions/column.actions";
import {ToastActionTypes, ToastTypes} from "../components/toast/toast.component";
import {RequestFailedAction} from "../actions/meta.actions";
import {ToastrService} from "../services/toastr.service";
import {Router} from "@angular/router";
import {AppState} from "../reducers";
import {Store} from "@ngrx/store";
import {HttpErrorResponse} from "@angular/common/http";
import {LoadingChannel} from "../channels/loading.channel";

@Injectable()
export class ColumnEffects {

    @Effect()
    loadAllColumns$ = this.actions$.pipe(
        ofType<LoadAllColumnsAction>(ColumnActionTypes.LOAD_ALL_COLUMNS),
        mergeMap(() => {
            return this.columnService.loadAllColumns().pipe(
                map(columns => new SetAllColumnsAction(columns)),
                catchError(() => {
                    this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.loadAllColumnsFailed");
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    createColumn$ = this.actions$.pipe(
        ofType<CreateColumnAction>(ColumnActionTypes.CREATE_COLUMN),
        mergeMap((action) => {
            this.loadingChannel.showColumnViewLoading$.next(true);
            return this.columnService.createColumn(action.payload).pipe(
                map((newMpdule) => new CreateColumnSuccessAction(newMpdule)),
                tap(() => {
                    this.loadingChannel.showColumnViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.SUCCESS, "toasts.success.createColumn");
                    this.router.navigate(["home"]);
                }),
                catchError((err: HttpErrorResponse) => {
                    this.loadingChannel.showColumnViewLoading$.next(false);
                    if (err.error && err.error.code === 11000) {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.columnNameExists");
                    } else {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.createColumnFailed", [{
                            type: ToastActionTypes.RETRY,
                            actionHandler: () => this.store.dispatch(new CreateColumnAction(action.payload))
                        }]);
                    }
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    updateColumn$ = this.actions$.pipe(
        ofType<UpdateColumnAction>(ColumnActionTypes.UPDATE_COLUMN),
        mergeMap((action) => {
            this.loadingChannel.showColumnViewLoading$.next(true);
            return this.columnService.updateColumn(action.payload).pipe(
                map((newColumn) => new UpdateColumnSuccessAction(newColumn)),
                tap(() => {
                    this.loadingChannel.showColumnViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.SUCCESS, "toasts.success.updateColumn");
                    this.router.navigate(["home"]);
                }),
                catchError((err: HttpErrorResponse) => {
                    this.loadingChannel.showColumnViewLoading$.next(false);
                    if (err.error && err.error.code === 11000) {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.columnNameExists");
                    } else {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.updateColumnFailed", [{
                            type: ToastActionTypes.RETRY,
                            actionHandler: () => this.store.dispatch(new UpdateColumnAction(action.payload))
                        }]);
                    }

                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    deleteColumn$ = this.actions$.pipe(
        ofType<DeleteColumnAction>(ColumnActionTypes.DELETE_COLUMN),
        mergeMap((action) => {
            this.loadingChannel.showMainViewLoading$.next(true);
            return this.columnService.deleteColumn(action.payload).pipe(
                map((report) => {
                    if (report.ok) {
                        return new DeleteColumnSuccessAction(action.payload);
                    } else {
                        throw new Error();
                    }
                }),
                tap(() => {
                    this.loadingChannel.showMainViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.SUCCESS, "toasts.success.deleteColumn");
                    this.router.navigate(["home"]);
                }),
                catchError((err: HttpErrorResponse) => {
                    this.loadingChannel.showMainViewLoading$.next(false);
                    if (err.status === 403) {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.columnContainsEntries");
                    } else {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.deleteColumnFailed", [{
                            type: ToastActionTypes.RETRY,
                            actionHandler: () => this.store.dispatch(new DeleteColumnAction(action.payload))
                        }]);
                    }
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    createKanbanLayout$ = this.actions$.pipe(
        ofType<CreateKanbanLayoutAction>(ColumnActionTypes.CREATE_KANBAN_LAYOUT),
        mergeMap(() => {
            this.loadingChannel.showMainViewLoading$.next(true);
            return forkJoin([
                this.columnService.createColumn({name: "Todo", limit: 0}),
                this.columnService.createColumn({name: "In Progress", limit: 0}),
                this.columnService.createColumn({name: "Done", limit: 0})
            ]);
        }),
        map((columns) => {
            this.loadingChannel.showMainViewLoading$.next(false);
            this.toastrService.showToast(ToastTypes.SUCCESS, "toasts.success.kanbanColumnsCreated");
            return new CreateKanbanLayoutSuccessAction(columns);
        }),
        catchError(() => {
            this.loadingChannel.showMainViewLoading$.next(false);
            this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.createKanbanColumnsFailed");
            return of(new RequestFailedAction());
        })
    );

    constructor(private actions$: Actions,
                private store: Store<AppState>,
                private loadingChannel: LoadingChannel,
                private columnService: ColumnService,
                private toastrService: ToastrService,
                private router: Router) {
    }
}
