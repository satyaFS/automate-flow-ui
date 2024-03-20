import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Action } from './action.interface';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {
  form: FormGroup;
  triggerTypes = ['Webhook']; // Initially Webhook only{}
  actionRequestTypes = ['GET', 'POST', 'PUT', 'DELETE']
actionTypes: any;
  constructor(private fb:FormBuilder){
    this.form = this.fb.group({
      trigger: this.fb.group({ // Separate FormGroup for the trigger
        triggerType: ['Webhook', Validators.required],
        url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]]
      }),
      actions: this.fb.array([]) // FormArray for actions
    });
  }
  ngOnInit() {
   
    // Dynamically control 'url' field visibility
    this.form.get('triggerType')?.valueChanges.subscribe(selectedType => {
      if (selectedType === 'Webhook') {
        this.form.get('url')?.enable();
      } else {
        this.form.get('url')?.disable();
        this.form.get('url')?.reset(); // Clear on type change
      }
    });
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
      actionType: ['Webhook', Validators.required], // Assume 'Webhook' for simplicity, extend as needed
      url: ['', [Validators.required, Validators.pattern(/http:\/\/|https:\/\//)]],
      passPrevData:[''],
      requestType: ['', Validators.required]
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

}
