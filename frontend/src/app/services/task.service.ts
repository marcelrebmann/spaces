import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {KanbanTask} from "../shared/interfaces/kanban-task.interface";
import {DeletionReport} from "../shared/interfaces/deletion-report.interface";

export class TaskService {

    private readonly TASK_ENDPOINT = `${environment.backendUrl}/tasks`;

    constructor(private http: HttpClient) {
    }

    loadAllTasks(): Observable<KanbanTask[]> {
        return this.http.get<KanbanTask[]>(this.TASK_ENDPOINT);
    }

    loadTask(taskId: number): Observable<KanbanTask> {
        return this.http.get<KanbanTask>(`${this.TASK_ENDPOINT}/${taskId}`);
    }

    createTask(task: KanbanTask): Observable<KanbanTask> {
        return this.http.post<KanbanTask>(`${this.TASK_ENDPOINT}`, task);
    }

    updateTask(task: KanbanTask): Observable<KanbanTask> {
        return this.http.put<KanbanTask>(`${this.TASK_ENDPOINT}/${task._id}`, task);
    }

    deleteTask(taskId: string): Observable<DeletionReport> {
        return this.http.delete<DeletionReport>(`${this.TASK_ENDPOINT}/${taskId}`);
    }
}
