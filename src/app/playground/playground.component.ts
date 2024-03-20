import { Component } from '@angular/core';
import { Link } from '../models/Link';
import { Node } from '../models/Node';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent {
  form: FormGroup;
  triggerTypes = ['Webhook']; // Initially Webhook only{}
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
