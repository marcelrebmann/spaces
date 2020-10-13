import {Component, OnDestroy, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {NavigationEnd, Router} from "@angular/router";
import {filter, takeUntil, tap} from "rxjs/operators";
import {BehaviorSubject, Subject} from "rxjs";
import {NavigationItem} from "./shared/interfaces/navigation-item.interface";
import {Store} from "@ngrx/store";
import {AppState} from "./reducers";
import {LoadAllDataAction} from "./actions/meta.actions";
import {LoadingChannel} from "./channels/loading.channel";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {

    readonly navItems: NavigationItem[] = [
        {
            title: "navigation.home",
            link: "/home"
        },
        {
            title: "navigation.createModule",
            link: "/module"
        },
        {
            title: "navigation.createColumn",
            link: "/column"
        },
        {
            title: "navigation.createTask",
            link: "/task"
        }
    ];

    activeRoute$ = new BehaviorSubject<string>("");

    destroyed$ = new Subject<boolean>();

    constructor(private translateService: TranslateService,
                private router: Router,
                private store: Store<AppState>) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translateService.setDefaultLang("en");

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translateService.use("de");
    }

    ngOnInit(): void {
        this.store.dispatch(new LoadAllDataAction());

        this.router.events.pipe(
            takeUntil(this.destroyed$),
            filter(ev => ev instanceof NavigationEnd),
            tap((event: NavigationEnd) => this.activeRoute$.next(event.urlAfterRedirects))
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
    }

    navigateTo(link: string): void {
        this.router.navigateByUrl(link);
    }
}
