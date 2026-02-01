import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConnectorRegistryService } from '../../core/services/connector-registry.service';
import { ConnectorDefinition, ConnectedAccount } from '../../core/models/connector.model';

@Component({
    selector: 'app-apps',
    templateUrl: './apps.component.html',
    styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    connectors: ConnectorDefinition[] = [];
    filteredConnectors: ConnectorDefinition[] = [];
    connections: ConnectedAccount[] = [];

    isLoading = false;
    error: string | null = null;

    searchQuery = '';
    selectedCategory = 'all';

    // API Key dialog state
    showApiKeyDialog = false;
    apiKeyConnector: ConnectorDefinition | null = null;
    apiKeyInput = '';

    categories = [
        { id: 'all', name: 'All Apps', icon: 'apps' },
        { id: 'Email', name: 'Email', icon: 'email' },
        { id: 'Communication', name: 'Messaging', icon: 'chat' },
        { id: 'AI', name: 'AI & ML', icon: 'psychology' },
        { id: 'Developer', name: 'Developer', icon: 'code' }
    ];

    constructor(private connectorRegistry: ConnectorRegistryService) { }

    ngOnInit(): void {
        // Subscribe to connectors
        this.connectorRegistry.getConnectors$()
            .pipe(takeUntil(this.destroy$))
            .subscribe(connectors => {
                this.connectors = connectors;
                this.filterConnectors();
            });

        // Subscribe to connections
        this.connectorRegistry.getConnections$()
            .pipe(takeUntil(this.destroy$))
            .subscribe(connections => {
                this.connections = connections;
            });

        // Subscribe to loading state
        this.connectorRegistry.loading$
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.isLoading = loading;
            });

        // Subscribe to errors
        this.connectorRegistry.error$
            .pipe(takeUntil(this.destroy$))
            .subscribe(error => {
                this.error = error;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    filterConnectors(): void {
        let result = this.connectors;

        // Category filter
        if (this.selectedCategory !== 'all') {
            result = result.filter(c =>
                c.category.toLowerCase() === this.selectedCategory.toLowerCase()
            );
        }

        // Search filter
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.description.toLowerCase().includes(query)
            );
        }

        this.filteredConnectors = result;
    }

    onSearchChange(): void {
        this.filterConnectors();
    }

    onCategoryChange(category: any): void {
        this.selectedCategory = category;
        this.filterConnectors();
    }

    getConnectedAccounts(connectorId: string): ConnectedAccount[] {
        return this.connections.filter(c => c.connectorId === connectorId);
    }

    isConnected(connectorId: string): boolean {
        return this.getConnectedAccounts(connectorId).length > 0;
    }

    connectApp(connector: ConnectorDefinition): void {
        if (connector.authType === 'oauth2') {
            // Start OAuth flow - opens popup
            this.connectorRegistry.connectOAuth(connector.id);
        } else if (connector.authType === 'api_key') {
            // Show API key dialog
            this.apiKeyConnector = connector;
            this.apiKeyInput = '';
            this.showApiKeyDialog = true;
        }
    }

    submitApiKey(): void {
        if (!this.apiKeyConnector || !this.apiKeyInput.trim()) return;

        this.connectorRegistry.connectApiKey(this.apiKeyConnector.id, this.apiKeyInput)
            .subscribe({
                next: (result) => {
                    console.log('API key saved:', result.message);
                    this.closeApiKeyDialog();
                },
                error: (err) => {
                    console.error('Failed to save API key:', err);
                }
            });
    }

    closeApiKeyDialog(): void {
        this.showApiKeyDialog = false;
        this.apiKeyConnector = null;
        this.apiKeyInput = '';
    }

    disconnectApp(connectorId: string, accountId: string): void {
        this.connectorRegistry.disconnect(accountId).subscribe({
            next: () => {
                console.log('Disconnected:', connectorId);
            },
            error: (err) => {
                console.error('Failed to disconnect:', err);
            }
        });
    }

    getAuthTypeText(authType: string): string {
        switch (authType) {
            case 'oauth2': return 'OAuth 2.0';
            case 'api_key': return 'API Key';
            case 'basic': return 'Username/Password';
            case 'none': return 'No Auth Required';
            default: return authType;
        }
    }

    refreshConnectors(): void {
        this.connectorRegistry.refresh();
    }
}
