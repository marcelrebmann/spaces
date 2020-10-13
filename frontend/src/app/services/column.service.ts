import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {KanbanColumn} from "../shared/interfaces/kanban-column.interface";
import {DeletionReport} from "../shared/interfaces/deletion-report.interface";

@Injectable()
export class ColumnService {

    private readonly COLUMN_ENDPOINT = `${environment.backendUrl}/columns`;

    constructor(private http: HttpClient) {
    }

    loadAllColumns(): Observable<KanbanColumn[]> {
        return this.http.get<KanbanColumn[]>(this.COLUMN_ENDPOINT);
    }

    loadColumn(columnId: number): Observable<KanbanColumn> {
        return this.http.get<KanbanColumn>(`${this.COLUMN_ENDPOINT}/${columnId}`);
    }

    createColumn(column: KanbanColumn): Observable<KanbanColumn> {
        return this.http.post<KanbanColumn>(`${this.COLUMN_ENDPOINT}`, column);
    }

    updateColumn(column: KanbanColumn): Observable<KanbanColumn> {
        return this.http.put<KanbanColumn>(`${this.COLUMN_ENDPOINT}/${column._id}`, column);
    }

    deleteColumn(columnId: string): Observable<DeletionReport> {
        return this.http.delete<DeletionReport>(`${this.COLUMN_ENDPOINT}/${columnId}`);
    }
}
