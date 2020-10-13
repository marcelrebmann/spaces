import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {KanbanModule} from "../shared/interfaces/kanban-module.interface";
import {DeletionReport} from "../shared/interfaces/deletion-report.interface";

@Injectable()
export class ModuleService {

    private readonly MODULE_ENDPOINT = `${environment.backendUrl}/modules`;

    constructor(private http: HttpClient) {
    }

    loadAllModules(): Observable<KanbanModule[]> {
        return this.http.get<KanbanModule[]>(this.MODULE_ENDPOINT);
    }

    loadModule(moduleId: number): Observable<KanbanModule> {
        return this.http.get<KanbanModule>(`${this.MODULE_ENDPOINT}/${moduleId}`);
    }

    createModule(module: KanbanModule): Observable<KanbanModule> {
        return this.http.post<KanbanModule>(`${this.MODULE_ENDPOINT}`, module);
    }

    updateModule(module: KanbanModule): Observable<KanbanModule> {
        return this.http.put<KanbanModule>(`${this.MODULE_ENDPOINT}/${module._id}`, module);
    }

    deleteModule(moduleId: string): Observable<DeletionReport> {
        return this.http.delete<DeletionReport>(`${this.MODULE_ENDPOINT}/${moduleId}`);
    }
}
