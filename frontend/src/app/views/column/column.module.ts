import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {Route, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ColumnContainerComponent} from "./column-container.component";

const routes: Route[] = [
    {
        path: "", component: ColumnContainerComponent
    }
];

@NgModule({
    declarations: [
        ColumnContainerComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormsModule
    ],
    exports: []
})
export class ColumnModule {
}
