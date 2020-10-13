import {NgModule} from "@angular/core";
import {TaskContainerComponent} from "./task-container.component";
import {SharedModule} from "../../shared/shared.module";
import {Route, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

const routes: Route[] = [
    {
        path: "", component: TaskContainerComponent
    }
];

@NgModule({
    declarations: [
        TaskContainerComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormsModule
    ],
    exports: [
    ]
})
export class TaskModule {
}
