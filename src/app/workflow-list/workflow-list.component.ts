import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddWorkflowDialogComponent } from '../add-workflow-dialog/add-workflow-dialog.component';
import { AppService } from '../app.service';

interface Workflow {
  workflowId: string;
  workflowName: string;
  workflowDescription: string;
  status: 'Active' | 'Inactive';
  lastRun?: Date;
  runCount?: number;
  errorCount?: number;
}

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.scss']
})
export class WorkflowListComponent implements OnInit {
  workflows: Workflow[] = [];
  filteredWorkflows: Workflow[] = [];
  selectedWorkflow: Workflow | null = null;
  userId = 1234;

  // UI State
  isLoading = true;
  viewMode: 'grid' | 'list' = 'grid';
  searchQuery = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getWorkflows();
  }

  getWorkflows(): void {
    this.isLoading = true;
    this.appService.getWorkFlowsByUserId(this.userId).subscribe({
      next: (data) => {
        this.workflows = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load workflows:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.workflows];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(w =>
        w.workflowName.toLowerCase().includes(query) ||
        w.workflowDescription?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      result = result.filter(w =>
        w.status.toLowerCase() === this.statusFilter
      );
    }

    this.filteredWorkflows = result;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  selectWorkflow(workflow: Workflow): void {
    this.selectedWorkflow = workflow;
  }

  addWorkflow(workflow: any): void {
    workflow = { userId: '1234', ...workflow };
    this.appService.addWorkflow(workflow).subscribe({
      next: (data) => {
        this.workflows.push(data);
        this.applyFilters();
        this.router.navigate(['/workflow', data.workflowId]);
      },
      error: (err) => {
        console.error('Failed to add workflow:', err);
      }
    });
  }

  openAddWorkflowDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = { top: '10%' };
    dialogConfig.width = '500px';
    dialogConfig.panelClass = 'modern-dialog';

    const dialogRef = this.dialog.open(AddWorkflowDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addWorkflow(result);
      }
    });
  }

  navigateToWorkflow(id: string): void {
    this.router.navigate(['/workflow', id]);
  }

  toggleWorkflowStatus(workflow: Workflow, event: Event): void {
    event.stopPropagation();
    // TODO: Implement status toggle API call
    workflow.status = workflow.status === 'Active' ? 'Inactive' : 'Active';
  }

  deleteWorkflow(workflow: Workflow, event: Event): void {
    event.stopPropagation();
    // TODO: Implement delete with confirmation
    console.log('Delete workflow:', workflow.workflowId);
  }

  duplicateWorkflow(workflow: Workflow, event: Event): void {
    event.stopPropagation();
    // TODO: Implement duplicate
    console.log('Duplicate workflow:', workflow.workflowId);
  }

  getActiveCount(): number {
    return this.workflows.filter(w => w.status === 'Active').length;
  }

  getInactiveCount(): number {
    return this.workflows.filter(w => w.status === 'Inactive').length;
  }
}
