import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {StoreModule} from "@ngrx/store";
import {reducers} from "./reducers";
import {environment} from "../environments/environment";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {EffectsModule} from "@ngrx/effects";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HeaderComponent} from "./components/frame/header/header.component";
import {ModuleService} from "./services/module.service";
import {ColumnService} from "./services/column.service";
import {TaskService} from "./services/task.service";
import {ColumnEffects} from "./effects/column.effects";
import {ModuleEffects} from "./effects/module.effects";
import {TaskEffects} from "./effects/task.effects";
import {ToastrService} from "./services/toastr.service";
import {ToastComponent} from "./components/toast/toast.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MetaEffects} from "./effects/meta.effects";
import {LoadingChannel} from "./channels/loading.channel";
import {HttpTimeoutInterceptor} from "./shared/http-timeout.interceptor";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ToastComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        StoreModule.forRoot(reducers),
        environment.production ? [] : StoreDevtoolsModule.instrument({
            maxAge: 25
        }),
        EffectsModule.forRoot([
            ColumnEffects,
            ModuleEffects,
            TaskEffects,
            MetaEffects
        ]),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        ModuleService,
        ColumnService,
        TaskService,
        ToastrService,
        LoadingChannel,
        { provide: HTTP_INTERCEPTORS, useClass:
            HttpTimeoutInterceptor, multi: true }
    ],
    entryComponents: [
        ToastComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
