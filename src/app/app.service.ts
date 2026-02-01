import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  workflowBaseUrl = "http://localhost:8082/workflow"
  triggerBaseUrl = "http://localhost:8083/triggers"
  actionBaseUrl = "http://localhost:8084/actions"

  constructor(private http:HttpClient) { }
  public addWorkflow(workflow:any):Observable<any>{
    return this.http.post(this.workflowBaseUrl,workflow);
  }

  public getWorkFlowsByUserId(userId:any) {
    return this.http.get<any>(this.workflowBaseUrl+"/user/" + userId);
  }

  //trigger 
  public getTriggerByWorkflowId(triggerId:string) {
    return this.http.get<any>(this.triggerBaseUrl+"/workflow/"+triggerId);
  }
  public saveAction(action:any) {
    return this.http.post<any>(this.actionBaseUrl, action);
  }
}
