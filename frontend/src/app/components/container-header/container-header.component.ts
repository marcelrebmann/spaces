import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

@Component({
    selector: "app-container-header",
    templateUrl: "./container-header.component.html",
    styleUrls: ["./container-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerHeaderComponent {

    @Input()
    titleKey = "";

    @Input()
    showSubheader = false;

    @Input()
    subheaderIconClass = "mdi mdi-cube-outline";

    @Input()
    subheaderText = "";

    constructor() {
    }
}
