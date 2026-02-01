import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowComponent } from './workflow/workflow.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { WorkflowBuilderComponent } from './features/workflow-builder/workflow-builder.component';

const routes: Routes = [
  // Dashboard - Home page
  { path: 'dashboard', component: DashboardComponent },

  // Workflow routes
  { path: 'workflowlist', component: WorkflowListComponent },
  { path: 'workflow/new', component: WorkflowBuilderComponent },
  { path: 'workflow/:id', component: WorkflowBuilderComponent },

  // Legacy route (for backwards compatibility)
  { path: 'workflow-old/:id', component: WorkflowComponent },

  // Future routes (placeholders - redirect to workflow list for now)
  { path: 'apps', redirectTo: '/workflowlist', pathMatch: 'full' },
  { path: 'history', redirectTo: '/workflowlist', pathMatch: 'full' },
  { path: 'settings', redirectTo: '/workflowlist', pathMatch: 'full' },

  // Default redirect to dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
