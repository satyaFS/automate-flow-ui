import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Action } from './action.interface';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {
  form: FormGroup;
  triggerTypes = ['Webhook']; // Initially Webhook only{}
  actionRequestTypes = ['GET', 'POST', 'PUT', 'DELETE']
  actionTypes = ['REST API'];
  workflowId = ''

  constructor(private fb:FormBuilder, private activatedRout:ActivatedRoute, private appService:AppService){
    this.form = this.fb.group({
      trigger: this.fb.group({ // Separate FormGroup for the trigger
        triggerType: ['Webhook', Validators.required],
        url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]]
      }),
      actions: this.fb.array([]) // FormArray for actions
    });
  }
  ngOnInit() {
   
    this.activatedRout.paramMap.subscribe(it=>{
       this.workflowId= it.get("id") || ''
       console.log(this.workflowId)
       if(this.workflowId != '') {
        this.initTriggerData();
       }

    })
    this.addAction()
  }

  get trigger() {
    return this.form.get('trigger') as FormGroup;
  }

  get actions() {
    return this.form.get('actions') as FormArray;
  }
  addAction(index?:number) {
    const actionGroup = this.fb.group({
      actionType: ['REST API', Validators.required],
      url: ['', [Validators.required, Validators.pattern(/http:\/\/|https:\/\//)]],
      passPrevData:[''],
      requestType: ['', Validators.required],
      payLoad:['', Validators.required]
    });
    if (index !== undefined) {
      this.actions.insert(index, actionGroup);
    } else {
      this.actions.push(actionGroup);
    }
  }
  removeAction(index: number) {
    console.log(index)
    if(index==0) return
    this.actions.removeAt(index);
  }
  
  onSubmit() {
    if (this.form.valid) {
      // Process form data
    }
  }

  initTriggerData() {
    this.appService.getTriggerByWorkflowId(this.workflowId).subscribe(data=>{
      console.log(data)
      this.trigger.get('url')?.setValue(data.url);
    })
  }

}
