import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";


const routes: Routes = [
    {
        path: "home",
        loadChildren: () => import("./views/home/home.module").then(m => m.HomeModule)
    },
    {
        path: "task",
        loadChildren: () => import("./views/task/task.module").then(m => m.TaskModule)
    },
    {
        path: "task/:id",
        loadChildren: () => import("./views/task/task.module").then(m => m.TaskModule)
    },
    {
        path: "module",
        loadChildren: () => import("./views/module/module.module").then(m => m.ModuleModule)
    },
    {
        path: "module/:id",
        loadChildren: () => import("./views/module/module.module").then(m => m.ModuleModule)
    },
    {
        path: "column",
        loadChildren: () => import("./views/column/column.module").then(m => m.ColumnModule)
    },
    {
        path: "column/:id",
        loadChildren: () => import("./views/column/column.module").then(m => m.ColumnModule)
    },
    {
        path: "**",
        redirectTo: "/home",
        pathMatch: "full"
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
