import {Component, OnDestroy, OnInit} from "@angular/core";
import {ViewMode} from "../../shared/view-mode.enum";
import {select, Store} from "@ngrx/store";
import {AppState, selectAllColumns, selectFirstLoadingStatus} from "../../reducers";
import {combineLatest, Observable, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {ToastTypes} from "../../components/toast/toast.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "../../services/toastr.service";
import {KanbanColumn} from "../../shared/interfaces/kanban-column.interface";
import {CreateColumnAction, UpdateColumnAction} from "../../actions/column.actions";
import {LoadingChannel} from "../../channels/loading.channel";

@Component({
    selector: "app-column-container",
    templateUrl: "./column-container.component.html",
    styleUrls: ["./column-container.component.scss"]
})
export class ColumnContainerComponent implements OnInit, OnDestroy {

    mode: ViewMode = ViewMode.CREATE;

    columnModel: KanbanColumn = {
        name: "",
        limit: 0
    };

    containerTitleKey = "column.create.title";

    readonly viewMode = ViewMode;

    showLoading = false;

    allColumns$: Observable<KanbanColumn[]> = this.store.pipe(
        select(selectAllColumns)
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
        this.loadingChannel.showColumnViewLoading$.pipe(
            takeUntil(this.destroyed$),
            debounceTime(50),
            tap((showLoading) => this.showLoading = showLoading)
        ).subscribe();

        const data = window.history.state.data as KanbanColumn;
        if (data) {
            this.columnModel = data;
            this.mode = ViewMode.EDIT;
            this.containerTitleKey = "column.edit.title";
            return;
        }

        this.initialLoadHappened$.pipe(
            takeUntil(this.destroyed$),
            filter(loaded => !!loaded),
            switchMap(() => combineLatest(this.route.paramMap, this.allColumns$)),
            filter(([params, columns]) => !!params.get("id")),
            map(([params, columns]) => {
                const searchedId = params.get("id");
                for (let i = 0, len = columns.length; i < len; i++) {
                    const existingColumn = columns[i];
                    if (existingColumn._id === searchedId) {
                        this.columnModel = existingColumn;
                        this.containerTitleKey = "column.edit.title";
                        this.mode = ViewMode.EDIT;
                        return;
                    }
                }
                this.router.navigate(["column"]);
                this.toastrService.showToast(ToastTypes.FAILED, "toasts.error.noColumnFound", [], {columnId: searchedId});
            })
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    handleSubmit() {
        if (this.mode === ViewMode.EDIT) {
            this.updateColumn();
        } else if (this.mode === ViewMode.CREATE) {
            this.createNewColumn();
        }
    }

    updateColumn(): void {
        this.store.dispatch(new UpdateColumnAction(this.columnModel));
    }

    createNewColumn(): void {
        this.store.dispatch(new CreateColumnAction(this.columnModel));
    }
}
