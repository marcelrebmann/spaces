import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {Route, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ModuleContainerComponent} from "./module-container.component";

const routes: Route[] = [
    {
        path: "", component: ModuleContainerComponent
    }
];

@NgModule({
    declarations: [
        ModuleContainerComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormsModule
    ],
})
export class ModuleModule {
}
