import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
    label: string;
    icon: string;
    route: string;
    badge?: number;
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    @Input() collapsed = false;
    @Output() collapsedChange = new EventEmitter<boolean>();

    currentRoute = '';

    navItems: NavItem[] = [
        { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
        { label: 'Workflows', icon: 'bolt', route: '/workflowlist' },
        { label: 'Apps', icon: 'apps', route: '/apps' },
        { label: 'History', icon: 'history', route: '/history' },
        { label: 'Settings', icon: 'settings', route: '/settings' }
    ];

    constructor(private router: Router) {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                this.currentRoute = event.urlAfterRedirects;
            });
    }

    toggleCollapse(): void {
        this.collapsed = !this.collapsed;
        this.collapsedChange.emit(this.collapsed);
    }

    isActive(route: string): boolean {
        return this.currentRoute.startsWith(route);
    }

    navigate(route: string): void {
        this.router.navigate([route]);
    }
}
