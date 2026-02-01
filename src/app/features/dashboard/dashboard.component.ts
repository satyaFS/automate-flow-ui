import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';

interface StatCard {
    title: string;
    value: number | string;
    subtitle: string;
    icon: string;
    color: 'primary' | 'success' | 'warning' | 'error';
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
}

interface ExecutionItem {
    id: string;
    workflowName: string;
    status: 'success' | 'error' | 'running' | 'pending';
    timestamp: Date;
    duration?: string;
}

interface ConnectedApp {
    id: string;
    name: string;
    icon: string;
    connected: boolean;
    lastUsed?: Date;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    isLoading = true;

    stats: StatCard[] = [
        {
            title: 'Total Workflows',
            value: 0,
            subtitle: '0 active',
            icon: 'bolt',
            color: 'primary'
        },
        {
            title: 'Executions Today',
            value: 0,
            subtitle: 'Last 24 hours',
            icon: 'play_circle',
            color: 'success',
            trend: { value: 12, direction: 'up' }
        },
        {
            title: 'Success Rate',
            value: '0%',
            subtitle: 'Last 7 days',
            icon: 'check_circle',
            color: 'success'
        },
        {
            title: 'Connected Apps',
            value: 0,
            subtitle: 'Active integrations',
            icon: 'apps',
            color: 'primary'
        }
    ];

    recentExecutions: ExecutionItem[] = [];

    connectedApps: ConnectedApp[] = [
        { id: 'gmail', name: 'Gmail', icon: 'email', connected: false },
        { id: 'slack', name: 'Slack', icon: 'chat', connected: false },
        { id: 'telegram', name: 'Telegram', icon: 'send', connected: false },
        { id: 'gemini', name: 'Gemini AI', icon: 'psychology', connected: false }
    ];

    constructor(
        private router: Router,
        private appService: AppService
    ) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.isLoading = true;

        // Load workflows to calculate stats
        this.appService.getWorkFlowsByUserId(1234).subscribe({
            next: (workflows) => {
                const activeCount = workflows.filter((w: any) => w.status === 'Active').length;

                this.stats[0].value = workflows.length;
                this.stats[0].subtitle = `${activeCount} active`;

                // Simulate connected apps count (would come from auth service)
                const connectedCount = this.connectedApps.filter(a => a.connected).length;
                this.stats[3].value = connectedCount;

                // Generate mock recent executions for demo
                this.generateMockExecutions(workflows);

                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load dashboard data:', err);
                this.isLoading = false;
                // Generate mock data for demo
                this.generateMockExecutions([]);
            }
        });

        // Simulate some stats
        this.stats[1].value = Math.floor(Math.random() * 50) + 10;
        this.stats[2].value = '98.5%';
    }

    generateMockExecutions(workflows: any[]): void {
        const statuses: ('success' | 'error' | 'running')[] = ['success', 'success', 'success', 'error', 'running'];
        const workflowNames = workflows.length > 0
            ? workflows.map((w: any) => w.workflowName)
            : ['Email Automation', 'Slack Notifications', 'Daily Report', 'AI Classification'];

        this.recentExecutions = Array.from({ length: 5 }, (_, i) => ({
            id: `exec-${i}`,
            workflowName: workflowNames[i % workflowNames.length],
            status: statuses[i % statuses.length],
            timestamp: new Date(Date.now() - i * 1000 * 60 * (Math.random() * 60 + 1)),
            duration: `${(Math.random() * 2 + 0.5).toFixed(1)}s`
        }));
    }

    navigateToWorkflows(): void {
        this.router.navigate(['/workflowlist']);
    }

    navigateToApps(): void {
        this.router.navigate(['/apps']);
    }

    navigateToHistory(): void {
        this.router.navigate(['/history']);
    }

    createWorkflow(): void {
        this.router.navigate(['/workflow', 'new']);
    }

    viewExecution(execution: ExecutionItem): void {
        // TODO: Navigate to execution detail
        console.log('View execution:', execution.id);
    }

    retryExecution(execution: ExecutionItem): void {
        // TODO: Implement retry
        console.log('Retry execution:', execution.id);
    }

    connectApp(app: ConnectedApp): void {
        // TODO: Implement OAuth flow
        console.log('Connect app:', app.id);
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'running': return 'sync';
            case 'pending': return 'schedule';
            default: return 'help';
        }
    }

    getTimeAgo(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}
