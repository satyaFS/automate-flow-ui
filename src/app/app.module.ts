import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Modules
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Third-party Modules
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Feature Components
import { PlaygroundComponent } from './playground/playground.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { AddWorkflowDialogComponent } from './add-workflow-dialog/add-workflow-dialog.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { WorkflowBuilderComponent } from './features/workflow-builder/workflow-builder.component';

// Core Components
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';

// Services
import { ThemeService } from './core/services/theme.service';

@NgModule({
  declarations: [
    AppComponent,
    WorkflowComponent,
    PlaygroundComponent,
    WorkflowListComponent,
    AddWorkflowDialogComponent,
    DashboardComponent,
    WorkflowBuilderComponent,
    SidebarComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Angular Material
    MatRadioModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,

    // Third-party
    NgxGraphModule,
    DragDropModule,
  ],
  providers: [
    ThemeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
