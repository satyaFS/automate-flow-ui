import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Execution {
    id: string;
    workflowId: string;
    workflowName: string;
    status: 'success' | 'error' | 'running' | 'pending';
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
    stepsCompleted: number;
    totalSteps: number;
    trigger: string;
    errorMessage?: string;
}

export interface ExecutionStep {
    id: string;
    name: string;
    connectorName: string;
    connectorIcon: string;
    status: 'success' | 'error' | 'running' | 'pending' | 'skipped';
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
    input?: any;
    output?: any;
    errorMessage?: string;
}

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    executions: Execution[] = [];
    filteredExecutions: Execution[] = [];
    selectedExecution: Execution | null = null;
    executionSteps: ExecutionStep[] = [];

    isLoading = true;
    isLoadingDetails = false;

    // Filters
    searchQuery = '';
    statusFilter: 'all' | 'success' | 'error' | 'running' = 'all';
    dateFilter: 'all' | 'today' | 'week' | 'month' = 'all';

    // Pagination
    currentPage = 1;
    pageSize = 10;
    totalPages = 1;

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.loadExecutions();
    }

    loadExecutions(): void {
        this.isLoading = true;

        // Simulate API call with mock data
        setTimeout(() => {
            this.executions = this.generateMockExecutions();
            this.applyFilters();
            this.isLoading = false;
        }, 500);
    }

    generateMockExecutions(): Execution[] {
        const workflows = [
            { id: 'wf-1', name: 'Email to Slack Notification' },
            { id: 'wf-2', name: 'Daily Report Generator' },
            { id: 'wf-3', name: 'Customer Feedback Classifier' },
            { id: 'wf-4', name: 'Telegram Alert Bot' }
        ];

        const statuses: ('success' | 'error' | 'running')[] = ['success', 'success', 'success', 'error', 'running'];
        const triggers = ['New Email', 'Schedule (Daily)', 'Webhook', 'New Message'];

        return Array.from({ length: 25 }, (_, i) => {
            const workflow = workflows[i % workflows.length];
            const status = statuses[i % statuses.length];
            const startedAt = new Date(Date.now() - i * 1000 * 60 * 30);
            const duration = Math.floor(Math.random() * 5000) + 500;

            return {
                id: `exec-${i + 1}`,
                workflowId: workflow.id,
                workflowName: workflow.name,
                status,
                startedAt,
                completedAt: status !== 'running' ? new Date(startedAt.getTime() + duration) : undefined,
                duration: status !== 'running' ? duration : undefined,
                stepsCompleted: status === 'success' ? 3 : (status === 'error' ? 2 : 1),
                totalSteps: 3,
                trigger: triggers[i % triggers.length],
                errorMessage: status === 'error' ? 'Connection timeout: Failed to connect to Slack API' : undefined
            };
        });
    }

    applyFilters(): void {
        let result = [...this.executions];

        // Search filter
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(e =>
                e.workflowName.toLowerCase().includes(query) ||
                e.trigger.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (this.statusFilter !== 'all') {
            result = result.filter(e => e.status === this.statusFilter);
        }

        // Date filter
        if (this.dateFilter !== 'all') {
            const now = new Date();
            const cutoff = new Date();

            switch (this.dateFilter) {
                case 'today':
                    cutoff.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    cutoff.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    cutoff.setMonth(now.getMonth() - 1);
                    break;
            }

            result = result.filter(e => e.startedAt >= cutoff);
        }

        this.totalPages = Math.ceil(result.length / this.pageSize);
        this.filteredExecutions = result.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
        );
    }

    onSearchChange(): void {
        this.currentPage = 1;
        this.applyFilters();
    }

    onStatusFilterChange(status: 'all' | 'success' | 'error' | 'running'): void {
        this.statusFilter = status;
        this.currentPage = 1;
        this.applyFilters();
    }

    onDateFilterChange(date: 'all' | 'today' | 'week' | 'month'): void {
        this.dateFilter = date;
        this.currentPage = 1;
        this.applyFilters();
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.applyFilters();
        }
    }

    selectExecution(execution: Execution): void {
        this.selectedExecution = execution;
        this.loadExecutionDetails(execution.id);
    }

    closeDetails(): void {
        this.selectedExecution = null;
        this.executionSteps = [];
    }

    loadExecutionDetails(executionId: string): void {
        this.isLoadingDetails = true;

        // Simulate API call
        setTimeout(() => {
            this.executionSteps = this.generateMockSteps();
            this.isLoadingDetails = false;
        }, 300);
    }

    generateMockSteps(): ExecutionStep[] {
        const isError = this.selectedExecution?.status === 'error';
        const isRunning = this.selectedExecution?.status === 'running';

        return [
            {
                id: 'step-1',
                name: 'Trigger: ' + (this.selectedExecution?.trigger || 'Unknown'),
                connectorName: 'Gmail',
                connectorIcon: 'email',
                status: 'success',
                startedAt: this.selectedExecution?.startedAt,
                completedAt: new Date((this.selectedExecution?.startedAt?.getTime() || 0) + 200),
                duration: 200,
                input: { event: 'new_email', from: 'user@example.com' },
                output: { emailId: 'msg-123', subject: 'Hello World' }
            },
            {
                id: 'step-2',
                name: 'Action: Classify with AI',
                connectorName: 'Gemini AI',
                connectorIcon: 'psychology',
                status: isRunning ? 'running' : 'success',
                startedAt: new Date((this.selectedExecution?.startedAt?.getTime() || 0) + 250),
                completedAt: isRunning ? undefined : new Date((this.selectedExecution?.startedAt?.getTime() || 0) + 1500),
                duration: isRunning ? undefined : 1250,
                input: { text: 'Hello World', model: 'gemini-pro' },
                output: isRunning ? undefined : { classification: 'greeting', confidence: 0.95 }
            },
            {
                id: 'step-3',
                name: 'Action: Send Slack Message',
                connectorName: 'Slack',
                connectorIcon: 'chat',
                status: isError ? 'error' : (isRunning ? 'pending' : 'success'),
                startedAt: isError || !isRunning ? new Date((this.selectedExecution?.startedAt?.getTime() || 0) + 1600) : undefined,
                completedAt: isError || !isRunning ? this.selectedExecution?.completedAt : undefined,
                duration: isError ? 3500 : (isRunning ? undefined : 800),
                input: { channel: '#notifications', message: 'New greeting received!' },
                output: isError ? undefined : { messageId: 'slack-456' },
                errorMessage: isError ? 'Connection timeout: Failed to connect to Slack API after 3 retries' : undefined
            }
        ];
    }

    retryExecution(execution: Execution): void {
        console.log('Retrying execution:', execution.id);
        // TODO: Implement retry API call
    }

    viewWorkflow(workflowId: string): void {
        this.router.navigate(['/workflow', workflowId]);
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'running': return 'sync';
            case 'pending': return 'schedule';
            case 'skipped': return 'skip_next';
            default: return 'help';
        }
    }

    formatDuration(ms?: number): string {
        if (!ms) return '-';
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    }

    getTimeAgo(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(this.totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }
}
