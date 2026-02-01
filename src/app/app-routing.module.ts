import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowComponent } from './workflow/workflow.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { WorkflowBuilderComponent } from './features/workflow-builder/workflow-builder.component';
import { HistoryComponent } from './features/history/history.component';
import { AppsComponent } from './features/apps/apps.component';

const routes: Routes = [
  // Dashboard - Home page
  { path: 'dashboard', component: DashboardComponent },

  // Workflow routes
  { path: 'workflowlist', component: WorkflowListComponent },
  { path: 'workflow/new', component: WorkflowBuilderComponent },
  { path: 'workflow/:id', component: WorkflowBuilderComponent },

  // Legacy route (for backwards compatibility)
  { path: 'workflow-old/:id', component: WorkflowComponent },

  // History page
  { path: 'history', component: HistoryComponent },

  // Apps page - Manage connected integrations
  { path: 'apps', component: AppsComponent },
  { path: 'settings', redirectTo: '/dashboard', pathMatch: 'full' },

  // Default redirect to dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
