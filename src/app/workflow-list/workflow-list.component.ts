import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { AddWorkflowDialogComponent } from '../add-workflow-dialog/add-workflow-dialog.component';
import { AppService } from '../app.service';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.scss']
})
export class WorkflowListComponent {
  constructor(private router:Router, public dialog: MatDialog, private appService:AppService){

  }
  workflows = [
    { id: 1, name: 'Workflow 1', description: 'This is a sample workflow', status: 'Active' },
    { id: 2, name: 'Workflow 2', description: 'Another workflow example', status: 'Inactive' },
    { id: 3, name: 'Workflow 3', description: 'Yet another workflow', status: 'Active' },
    // Add more workflows as needed
  ];
  selectedWorkflow: any;
  selectWorkflow(workflow: any) {
    this.selectedWorkflow = workflow;
  }
  addWorkFlow(workflow:any) {
    //add workflow to backend, get it
    this.appService.addWorkflow(workflow).subscribe(data => {
      this.workflows.push(data);
      this.router.navigate(['/workflow'])
    }
    );
  }
  openAddWorkflowDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '5%', // Set the top position of the dialog
    };
  

    const dialogRef = this.dialog.open(AddWorkflowDialogComponent, dialogConfig);
  
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the new workflow data
        const newWorkflow = {
          id: this.workflows.length + 1,
          ...result
        };
        this.workflows.push(newWorkflow);
      }
    });
  }
}
