import {ToastAction, ToastActionTypes, ToastComponent, ToastTypes} from "../components/toast/toast.component";
import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Injectable,
    Injector
} from "@angular/core";

@Injectable()
export class ToastrService {

    visibleToast: ComponentRef<ToastComponent>;
    destroyTimer;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private appRef: ApplicationRef,
                private injector: Injector) {
    }

    showToast(type: ToastTypes, message: string, actions: ToastAction[] = [], translateParams = {}, timeout = 6000) {

        if (this.visibleToast) {
            clearTimeout(this.destroyTimer);
            this.destroy(this.visibleToast);
            this.visibleToast = undefined;
        }

        // 1. Create a component reference from the component
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(ToastComponent)
            .create(this.injector);

        componentRef.instance.type = type;
        componentRef.instance.message = message;
        componentRef.instance.translateParams = translateParams;

        if (actions && actions.length) {
            componentRef.instance.actions = actions;
        } else {
            componentRef.instance.actions = [
                {
                    type: type === ToastTypes.SUCCESS ? ToastActionTypes.CONFIRM : ToastActionTypes.ABORT,
                    actionHandler: () => null
                }
            ];
        }

        componentRef.instance.clicked.subscribe(() => {
            clearTimeout(this.destroyTimer);
            this.destroy(componentRef);
        });

        // 2. Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);

        // 3. Get DOM element from component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        // 4. Append DOM element to the body
        document.body.appendChild(domElem);

        this.visibleToast = componentRef;

        if (timeout !== 0) {
            // 5. Wait some time and remove it from the component tree and from the DOM
            this.destroyTimer = setTimeout(() => {
                if (this.visibleToast) {
                    this.destroy(this.visibleToast);
                    this.visibleToast = undefined;
                }
            }, timeout);
        }
    }

    destroy(componentRef: ComponentRef<ToastComponent>): void {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }
}
