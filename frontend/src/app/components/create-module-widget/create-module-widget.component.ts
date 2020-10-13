import {Component, EventEmitter, Output} from "@angular/core";

@Component({
    selector: "app-create-module-widget",
    templateUrl: "./create-module-widget.component.html",
    styleUrls: ["./create-module-widget.component.scss"]
})
export class CreateModuleWidgetComponent {

    @Output()
    createModule = new EventEmitter<void>();

    constructor() {
    }

    emitCreateModuleSelection(): void {
        this.createModule.emit();
    }
}
