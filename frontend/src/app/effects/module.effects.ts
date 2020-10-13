import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap, tap} from "rxjs/operators";
import {of} from "rxjs";
import {
    CreateModuleAction, CreateModuleSuccessAction, DeleteModuleAction, DeleteModuleSuccessAction,
    LoadAllModulesAction,
    ModuleActionTypes,
    SetAllModulesAction, UpdateModuleAction, UpdateModuleSuccessAction
} from "../actions/module.actions";
import {ModuleService} from "../services/module.service";
import {ToastActionTypes, ToastTypes} from "../components/toast/toast.component";
import {RequestFailedAction} from "../actions/meta.actions";
import {ToastrService} from "../services/toastr.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../reducers";
import {LoadingChannel} from "../channels/loading.channel";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class ModuleEffects {

    @Effect()
    loadAllModules$ = this.actions$.pipe(
        ofType<LoadAllModulesAction>(ModuleActionTypes.LOAD_ALL_MODULES),
        mergeMap(() => {
            return this.moduleService.loadAllModules().pipe(
                map(modules => new SetAllModulesAction(modules)),
                catchError(() => {
                    this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.loadAllModulesFailed");
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    createModule$ = this.actions$.pipe(
        ofType<CreateModuleAction>(ModuleActionTypes.CREATE_MODULE),
        tap(() => this.loadingChannel.showModuleViewLoading$.next(true)),
        mergeMap((action) => {
            return this.moduleService.createModule(action.payload).pipe(
                map((newModule) => new CreateModuleSuccessAction(newModule)),
                tap(() => {
                    this.loadingChannel.showModuleViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.SUCCESS, "toasts.success.createModule");
                    this.router.navigate(["home"]);
                }),
                catchError((err: HttpErrorResponse) => {
                    if (err.error && err.error.code === 11000) {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.moduleNameExists");
                    } else {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.createModuleFailed", [{
                            type: ToastActionTypes.RETRY,
                            actionHandler: () => this.store.dispatch(new CreateModuleAction(action.payload))
                        }]);
                    }
                    this.loadingChannel.showModuleViewLoading$.next(false);
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    updateModule$ = this.actions$.pipe(
        ofType<UpdateModuleAction>(ModuleActionTypes.UPDATE_MODULE),
        mergeMap((action) => {
            this.loadingChannel.showModuleViewLoading$.next(true);
            return this.moduleService.updateModule(action.payload).pipe(
                map((newModule) => new UpdateModuleSuccessAction(newModule)),
                tap(() => {
                    this.loadingChannel.showModuleViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.SUCCESS, "toasts.success.updateModule");
                    this.router.navigate(["home"]);
                }),
                catchError((err: HttpErrorResponse) => {
                    this.loadingChannel.showModuleViewLoading$.next(false);
                    if (err.error && err.error.code === 11000) {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.moduleNameExists");
                    } else {
                        this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.updateModuleFailed", [{
                            type: ToastActionTypes.RETRY,
                            actionHandler: () => this.store.dispatch(new UpdateModuleAction(action.payload))
                        }]);
                    }
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    @Effect()
    deleteModule$ = this.actions$.pipe(
        ofType<DeleteModuleAction>(ModuleActionTypes.DELETE_MODULE),
        mergeMap((action) => {
            this.loadingChannel.showMainViewLoading$.next(true);
            return this.moduleService.deleteModule(action.payload).pipe(
                map((report) => {
                    if (report.ok) {
                        return new DeleteModuleSuccessAction(action.payload);
                    } else {
                        throw new Error();
                    }
                }),
                tap(() => {
                    this.loadingChannel.showMainViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.SUCCESS, "toasts.success.deleteModule");
                }),
                catchError(() => {
                    this.loadingChannel.showMainViewLoading$.next(false);
                    this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.deleteModuleFailed", [{
                        type: ToastActionTypes.RETRY,
                        actionHandler: () => this.store.dispatch(new DeleteModuleAction(action.payload))
                    }]);
                    return of(new RequestFailedAction());
                })
            );
        })
    );

    constructor(private actions$: Actions,
                private store: Store<AppState>,
                private loadingChannel: LoadingChannel,
                private moduleService: ModuleService,
                private toastrService: ToastrService,
                private router: Router) {
    }
}
