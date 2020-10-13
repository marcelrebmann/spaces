import {Component, OnDestroy, OnInit} from "@angular/core";
import {ViewMode} from "../../shared/view-mode.enum";
import {KanbanModule} from "../../shared/interfaces/kanban-module.interface";
import {select, Store} from "@ngrx/store";
import {AppState, selectAllModules, selectFirstLoadingStatus} from "../../reducers";
import {CreateModuleAction, UpdateModuleAction} from "../../actions/module.actions";
import {combineLatest, Observable, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {ToastTypes} from "../../components/toast/toast.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "../../services/toastr.service";
import {LoadingChannel} from "../../channels/loading.channel";

@Component({
    selector: "app-module-container",
    templateUrl: "./module-container.component.html",
    styleUrls: ["./module-container.component.scss"]
})
export class ModuleContainerComponent implements OnInit, OnDestroy {

    mode: ViewMode = ViewMode.CREATE;

    moduleModel = {
        name: ""
    } as KanbanModule;

    containerTitleKey = "module.create.title";

    readonly viewMode = ViewMode;

    showLoading = false;

    allModules$: Observable<KanbanModule[]> = this.store.pipe(
        select(selectAllModules)
    );

    initialLoadHappened$: Observable<boolean> = this.store.pipe(
        select(selectFirstLoadingStatus),
        distinctUntilChanged()
    );

    destroyed$ = new Subject<boolean>();

    constructor(private store: Store<AppState>,
                private loadingChannel: LoadingChannel,
                private router: Router,
                private route: ActivatedRoute,
                private toastrService: ToastrService) {
    }

    ngOnInit(): void {
        this.loadingChannel.showModuleViewLoading$.pipe(
            takeUntil(this.destroyed$),
            debounceTime(50),
            tap((showLoading) => this.showLoading = showLoading)
        ).subscribe();

        const data = window.history.state.data as KanbanModule;
        if (data) {
            this.moduleModel = data;
            this.mode = ViewMode.EDIT;
            this.containerTitleKey = "module.edit.title";
            return;
        }

        this.initialLoadHappened$.pipe(
            takeUntil(this.destroyed$),
            filter(loaded => !!loaded),
            switchMap(() => combineLatest(this.route.paramMap, this.allModules$)),
            filter(([params, modules]) => !!params.get("id")),
            map(([params, modules]) => {
                const searchedId = params.get("id");
                for (let i = 0, len = modules.length; i < len; i++) {
                    const existingModule = modules[i];
                    if (existingModule._id === searchedId) {
                        this.moduleModel = existingModule;
                        this.containerTitleKey = "module.edit.title";
                        this.mode = ViewMode.EDIT;
                        return;
                    }
                }
                this.router.navigate(["module"]);
                this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.noModuleFound", [], {moduleId: searchedId});
            })
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    handleSubmit() {
        if (this.mode === ViewMode.EDIT) {
            this.updateModule();
        } else if (this.mode === ViewMode.CREATE) {
            this.createNewModule();
        }
    }

    updateModule(): void {
        this.store.dispatch(new UpdateModuleAction(this.moduleModel));
    }

    createNewModule(): void {
        this.store.dispatch(new CreateModuleAction(this.moduleModel));
    }
}
