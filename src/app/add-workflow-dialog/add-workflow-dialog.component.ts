import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-workflow-dialog',
  templateUrl: './add-workflow-dialog.component.html',
  styleUrls: ['./add-workflow-dialog.component.scss']
})
export class AddWorkflowDialogComponent implements OnInit {
  workflowForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddWorkflowDialogComponent>,
    private fb: FormBuilder
  ) {
    this.workflowForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
   }

  ngOnInit() {
   
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}