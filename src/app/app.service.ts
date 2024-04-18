import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  workflowBaseUrl = "http://localhost:8082/workflow"

  constructor(private http:HttpClient) { }
  public addWorkflow(workflow:any):Observable<any>{
    return this.http.post(this.workflowBaseUrl,workflow);
  }

  public getWorkFlowsByUserId(userId:any) {
    return this.http.get<any>(this.workflowBaseUrl+"/user/" + userId);
  }
}
