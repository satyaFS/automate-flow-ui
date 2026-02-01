import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AutomateFlow';
  sidebarCollapsed = false;

  constructor(private themeService: ThemeService) {
    // Theme service is initialized automatically
  }
}
