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
    { id: 1, workflowName: 'Workflow 1', workflowDescription: 'This is a sample workflow', status: 'Active' },
    { id: 2, workflowName: 'Workflow 2', workflowDescription: 'Another workflow example', status: 'Inactive' },
    { id: 3, workflowName: 'Workflow 3', workflowDescription: 'Yet another workflow', status: 'Active' },
    // Add more workflows as needed
  ];
  selectedWorkflow: any;
  selectWorkflow(workflow: any) {
    this.selectedWorkflow = workflow;
  }
  addWorkFlow(workflow:any) {
    //add workflow to backend, get it
    workflow = {userId:"1234", ...workflow} // hardcoding userid temporarily
    this.appService.addWorkflow(workflow).subscribe(data => {
      console.log(data)
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
       this.addWorkFlow(result)
      }
    });
  }
}
