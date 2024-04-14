import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http:HttpClient) { }
  public addWorkflow(workflow:any):Observable<any>{
    return this.http.post("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",workflow);
  }
}
