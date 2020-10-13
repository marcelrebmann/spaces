import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class LoadingChannel {

    showMainViewLoading$ = new BehaviorSubject<boolean>(false);
    showTaskViewLoading$ = new BehaviorSubject<boolean>(false);
    showModuleViewLoading$ = new BehaviorSubject<boolean>(false);
    showColumnViewLoading$ = new BehaviorSubject<boolean>(false);
}
