import {CdkDragDrop} from "@angular/cdk/drag-drop";

export interface RevertableDropEvent<T> {
    dragDropEvent: CdkDragDrop<T>;
    errorHandler: () => void;
}
