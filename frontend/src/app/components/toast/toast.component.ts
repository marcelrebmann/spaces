import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";

export enum ToastTypes {
    SUCCESS = "success",
    FAILED = "failed",
    INFO = "info"
}

export enum ToastActionTypes {
    RETRY = "RETRY",
    CONFIRM = "CONFIRM",
    ABORT = "ABORT"
}

export interface ToastAction {
    type: ToastActionTypes;
    actionHandler: () => void;
}

@Component({
    selector: "app-toast",
    templateUrl: "./toast.component.html",
    styleUrls: ["./toast.component.scss"]
})
export class ToastComponent implements AfterViewInit {

    @Input()
    duration = 3000;

    @Input()
    message: string;

    @Input()
    translateParams = {};

    @Input()
    type: ToastTypes = ToastTypes.INFO;

    @Input()
    actions: ToastAction[] = [{
        type: ToastActionTypes.ABORT,
        actionHandler: () => null
    }];

    @Output()
    clicked = new EventEmitter<unknown>();

    @ViewChild("durationLine", {static: false})
    durationLine: ElementRef;

    actionIconMap = {
        RETRY: "mdi mdi-refresh",
        CONFIRM: "mdi mdi-check",
        ABORT: "mdi mdi-close"
    };

    constructor() {
    }

    ngAfterViewInit(): void {
        if (this.duration) {
            this.durationLine.nativeElement.style.width = "0";
        }
    }

    performAction(index: number) {
        this.actions[index].actionHandler();
        this.clicked.emit();
    }
}
