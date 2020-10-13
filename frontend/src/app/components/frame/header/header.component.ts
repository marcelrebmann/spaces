import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {NavigationItem} from "../../../shared/interfaces/navigation-item.interface";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger("openCloseTop", [
            state("open", style({
                transform: "translateY(8px) rotate(45deg)"
            })),
            state("closed", style({
                transform: "translateY(0px) rotate(0deg)"
            })),
            transition("open => closed", [
                animate("0.15s", style({
                    transform: "rotate(0deg) translateY(8px)"
                })),
                animate("0.15s", style({
                    transform: "rotate(0deg) translateY(0px)"
                }))
            ]),
            transition("closed => open", [
                animate("0.15s", style({
                    transform: "translateY(8px) rotate(0deg)"
                })),
                animate("0.15s", style({
                    transform: "translateY(8px) rotate(45deg)"
                }))
            ]),
        ]),
        trigger("openCloseBottom", [
            state("open", style({
                transform: "translateY(-8px) rotate(-45deg)"
            })),
            state("closed", style({
                transform: "translateY(0px) rotate(0deg)"
            })),
            transition("open => closed", [
                animate("0.15s", style({
                    transform: "rotate(0deg) translateY(-8px)"
                })),
                animate("0.15s", style({
                    transform: "rotate(0deg) translateY(0px)"
                }))
            ]),
            transition("closed => open", [
                animate("0.15s", style({
                    transform: "translateY(-8px) rotate(0deg)"
                })),
                animate("0.15s", style({
                    transform: "translateY(-8px) rotate(-45deg)"
                }))
            ]),
        ]),
        trigger("fadeOut", [
            state("open", style({
                opacity: 0
            })),
            state("closed", style({
                opacity: 1
            })),
            transition("open => closed", [
                animate("0.15s 0.15s", style({
                    opacity: 1
                }))
            ]),
            transition("closed => open", [
                animate("0.15s", style({
                    opacity: 0
                }))
            ]),
        ])
    ]
})
export class HeaderComponent implements OnChanges {

    @Input()
    items: NavigationItem[];

    @Input()
    activeRoute = "";

    @Output()
    selected = new EventEmitter<string>();

    activeMenuItemIndex = 0;

    mobileMenuIsOpen = false;

    constructor(private translateService: TranslateService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.activeRoute) {
            return;
        }
        for (let i = 0, len = this.items.length; i < len; i++) {
            const item = this.items[i];
            if (this.activeRoute.match(item.link)) {
                this.activeMenuItemIndex = i;
                return;
            }
        }
    }

    selectItem(item: NavigationItem): void {
        this.selected.emit(item.link);
        this.mobileMenuIsOpen = false;
    }

    changeLanguage(): void {
        this.translateService.currentLang === "de" ? this.translateService.use("en") : this.translateService.use("de");
    }

    toggleMobileMenu(): void {
        this.mobileMenuIsOpen = !this.mobileMenuIsOpen;
    }
}
