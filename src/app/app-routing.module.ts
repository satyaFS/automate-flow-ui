import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowComponent } from './workflow/workflow.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';

const routes: Routes = [
  // Dashboard will be added as a feature module
  { path: 'dashboard', redirectTo: '/workflowlist', pathMatch: 'full' },

  // Workflow routes
  { path: 'workflowlist', component: WorkflowListComponent },
  { path: 'workflow/new', component: WorkflowComponent },
  { path: 'workflow/:id', component: WorkflowComponent },

  // Future routes (placeholders)
  { path: 'apps', redirectTo: '/workflowlist', pathMatch: 'full' },
  { path: 'history', redirectTo: '/workflowlist', pathMatch: 'full' },
  { path: 'settings', redirectTo: '/workflowlist', pathMatch: 'full' },

  // Default redirect
  { path: '', redirectTo: '/workflowlist', pathMatch: 'full' },
  { path: '**', redirectTo: '/workflowlist', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
