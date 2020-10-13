import {NgModule} from "@angular/core";
import {HomeContainerComponent} from "./home-container.component";
import {BoardHeaderComponent} from "../../components/board-header/board-header.component";
import {KanbanBoardComponent} from "../../components/kanban-board/kanban-board.component";
import {SwimlaneComponent} from "../../components/swimlane/swimlane.component";
import {TaskCardComponent} from "../../components/task-card/task-card.component";
import {SharedModule} from "../../shared/shared.module";
import {Route, RouterModule} from "@angular/router";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {CreateColumnWidgetComponent} from "../../components/create-column-widget/create-column-widget.component";
import {CreateModuleWidgetComponent} from "../../components/create-module-widget/create-module-widget.component";

const routes: Route[] = [
    {
        path: "", component: HomeContainerComponent
    }
];

@NgModule({
    declarations: [
        HomeContainerComponent,
        BoardHeaderComponent,
        KanbanBoardComponent,
        SwimlaneComponent,
        TaskCardComponent,
        CreateColumnWidgetComponent,
        CreateModuleWidgetComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        DragDropModule
    ],
    exports: []
})
export class HomeModule {
}
