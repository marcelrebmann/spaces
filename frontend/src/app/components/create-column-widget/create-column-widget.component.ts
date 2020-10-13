import {Component, EventEmitter, Output} from "@angular/core";

@Component({
    selector: "app-create-column-widget",
    templateUrl: "./create-column-widget.component.html",
    styleUrls: ["./create-column-widget.component.scss"]
})
export class CreateColumnWidgetComponent {

    @Output()
    createCustomColumn = new EventEmitter<void>();

    @Output()
    createKanbanColumns = new EventEmitter<void>();

    constructor() {
    }

    emitCustomColumnSelection(): void {
        this.createCustomColumn.emit();
    }

    emitKanbanColumnsSelection(): void {
        this.createKanbanColumns.emit();
    }
}
