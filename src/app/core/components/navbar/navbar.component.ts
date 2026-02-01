import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    searchQuery = '';
    notificationCount = 3;

    constructor(
        private router: Router,
        public themeService: ThemeService
    ) { }

    onSearch(): void {
        if (this.searchQuery.trim()) {
            // TODO: Implement search functionality
            console.log('Searching for:', this.searchQuery);
        }
    }

    createWorkflow(): void {
        this.router.navigate(['/workflow', 'new']);
    }

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }

    openNotifications(): void {
        // TODO: Implement notifications panel
        console.log('Opening notifications');
    }

    openUserMenu(): void {
        // TODO: Implement user menu dropdown
        console.log('Opening user menu');
    }
}
