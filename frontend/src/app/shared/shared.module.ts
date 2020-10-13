import {TranslateModule} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {ContainerHeaderComponent} from "../components/container-header/container-header.component";
import {LoadingSpinnerComponent} from "../components/loading-spinner/loading-spinner.component";
import {AutofocusDirective} from "../autofocus.directive";

@NgModule({
    declarations: [
        ContainerHeaderComponent,
        LoadingSpinnerComponent,
        AutofocusDirective
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        CommonModule,
        TranslateModule,
        ContainerHeaderComponent,
        LoadingSpinnerComponent,
        AutofocusDirective
    ]
})
export class SharedModule {
}
