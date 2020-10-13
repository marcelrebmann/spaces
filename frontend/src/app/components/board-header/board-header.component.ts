import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from "@angular/core";
import {KanbanColumnLimit} from "../../shared/interfaces/kanban-column.interface";

@Component({
    selector: "app-board-header",
    templateUrl: "./board-header.component.html",
    styleUrls: ["./board-header.component.scss"]
})
export class BoardHeaderComponent {

    @Input()
    columns: KanbanColumnLimit[];

    @Output()
    createModuleSelected = new EventEmitter<void>();

    @Output()
    createColumnSelected = new EventEmitter<void>();

    @Output()
    deleteColumnSelected = new EventEmitter<string>();

    @Output()
    editColumnSelected = new EventEmitter<string>();

    @ViewChild("menu", {static: true})
    menu: ElementRef;

    openedMenuId = -1;

    @HostListener("document:click", ["$event"])
    clickOutside(event) {
        if (this.openedMenuId === -1) {
            return;
        }
        const openedColumn = document.getElementsByClassName("column open")[0];
        if (!openedColumn) {
            return;
        }
        if (!openedColumn.contains(event.target)) {
            this.resetOpenedMenuId();
        }
    }

    constructor() {
    }

    emitCreateModule(): void {
        this.createModuleSelected.emit();
    }

    emitCreateColumn(): void {
        this.createColumnSelected.emit();
    }

    emitColumnDeleteSelection(column: string): void {
        this.deleteColumnSelected.emit(column);
        this.resetOpenedMenuId();
    }

    emitEditColumn(columnId: string): void {
        this.editColumnSelected.emit(columnId);
        this.resetOpenedMenuId();
    }

    toggleMenu(columnId: number): void {
        if (this.openedMenuId === columnId) {
            this.resetOpenedMenuId();
            return;
        }
        this.openedMenuId = columnId;
    }

    private resetOpenedMenuId(): void {
        this.openedMenuId = -1;
    }
}
