import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {
    ApiConnectorDefinition,
    ApiTriggerDefinition,
    ApiActionDefinition,
    ConnectorDefinition,
    TriggerDefinition,
    ActionDefinition,
    ConfigField,
    FieldSchema,
    UserConnection,
    ConnectedAccount,
    getConnectorColor,
    getConnectorIcon
} from '../models/connector.model';

/**
 * ConnectorApiService
 * 
 * Fetches connectors from the backend Auth Service API.
 * Maps backend schema to frontend-friendly format.
 * 
 * Backend API: https://localhost:8085/api/connectors
 */
@Injectable({
    providedIn: 'root'
})
export class ConnectorApiService {
    private readonly baseUrl = 'https://localhost:8085';

    private connectorsSubject = new BehaviorSubject<ConnectorDefinition[]>([]);
    private connectionsSubject = new BehaviorSubject<ConnectedAccount[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<string | null>(null);

    connectors$ = this.connectorsSubject.asObservable();
    connections$ = this.connectionsSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();
    error$ = this.errorSubject.asObservable();

    // Current user ID (would come from auth service in production)
    private userId = 'demo-user';

    constructor(private http: HttpClient) {
        this.loadConnectors();
        this.loadConnections();
    }

    // ========== Connectors ==========

    /**
     * Load all connectors from backend
     */
    loadConnectors(): void {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);

        this.http.get<ApiConnectorDefinition[]>(`${this.baseUrl}/api/connectors`)
            .pipe(
                map(connectors => connectors.map(c => this.mapConnector(c))),
                catchError(error => {
                    console.error('Failed to load connectors:', error);
                    this.errorSubject.next('Failed to load connectors. Using fallback data.');
                    // Return fallback connectors for development
                    return of(this.getFallbackConnectors());
                }),
                tap(() => this.loadingSubject.next(false))
            )
            .subscribe(connectors => {
                this.connectorsSubject.next(connectors);
            });
    }

    /**
     * Get all connectors (snapshot)
     */
    getConnectors(): ConnectorDefinition[] {
        return this.connectorsSubject.getValue();
    }

    /**
     * Get a specific connector by ID
     */
    getConnector(id: string): ConnectorDefinition | undefined {
        return this.getConnectors().find(c => c.id === id);
    }

    /**
     * Get connectors by category
     */
    getConnectorsByCategory(category: string): ConnectorDefinition[] {
        return this.getConnectors().filter(c =>
            c.category.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Get connectors that have triggers
     */
    getConnectorsWithTriggers(): ConnectorDefinition[] {
        return this.getConnectors().filter(c => c.triggers.length > 0);
    }

    /**
     * Get connectors that have actions
     */
    getConnectorsWithActions(): ConnectorDefinition[] {
        return this.getConnectors().filter(c => c.actions.length > 0);
    }

    /**
     * Search connectors by name or description
     */
    searchConnectors(query: string): ConnectorDefinition[] {
        const lowerQuery = query.toLowerCase();
        return this.getConnectors().filter(c =>
            c.name.toLowerCase().includes(lowerQuery) ||
            c.description.toLowerCase().includes(lowerQuery)
        );
    }

    // ========== User Connections ==========

    /**
     * Load user's connected accounts
     */
    loadConnections(): void {
        this.http.get<UserConnection[]>(
            `${this.baseUrl}/api/connectors/connections?userId=${this.userId}`
        ).pipe(
            map(connections => connections.map(c => this.mapConnection(c))),
            catchError(error => {
                console.error('Failed to load connections:', error);
                return of([]);
            })
        ).subscribe(connections => {
            this.connectionsSubject.next(connections);
        });
    }

    /**
     * Get connections for a specific connector
     */
    getConnectionsForConnector(connectorId: string): ConnectedAccount[] {
        return this.connectionsSubject.getValue().filter(c => c.connectorId === connectorId);
    }

    /**
     * Check if user has connection for connector
     */
    isConnected(connectorId: string): boolean {
        return this.getConnectionsForConnector(connectorId).length > 0;
    }

    /**
     * Start OAuth flow for a connector
     */
    startOAuthFlow(connectorId: string): void {
        const authUrl = `${this.baseUrl}/oauth/${connectorId}/authorize?userId=${this.userId}`;
        window.open(authUrl, '_blank', 'width=600,height=700');
    }

    /**
     * Save API key for a connector
     */
    saveApiKey(connectorId: string, apiKey: string): Observable<{ success: boolean; message: string }> {
        return this.http.post<{ success: boolean; message: string }>(
            `${this.baseUrl}/oauth/${connectorId}/apikey?userId=${this.userId}`,
            { apiKey }
        ).pipe(
            tap(() => this.loadConnections())
        );
    }

    /**
     * Disconnect a user connection
     */
    disconnect(connectionId: string): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/api/connectors/connections/${connectionId}`
        ).pipe(
            tap(() => this.loadConnections())
        );
    }

    // ========== Mapping Functions ==========

    /**
     * Map backend connector to frontend format
     */
    private mapConnector(api: ApiConnectorDefinition): ConnectorDefinition {
        return {
            id: api.id,
            name: api.name,
            description: api.description,
            icon: getConnectorIcon(api.id, api.icon),
            category: api.category,
            authType: api.authType.toLowerCase() as 'oauth2' | 'api_key' | 'none',
            oauth: api.oauth,
            apiKeyHeader: api.apiKeyHeader,
            color: getConnectorColor(api.id),
            triggers: api.triggers.map(t => this.mapTrigger(t)),
            actions: api.actions.map(a => this.mapAction(a)),
            isEnabled: true
        };
    }

    /**
     * Map backend trigger to frontend format
     */
    private mapTrigger(api: ApiTriggerDefinition): TriggerDefinition {
        return {
            id: api.id,
            name: api.name,
            description: api.description,
            configFields: this.schemaToConfigFields(api.outputSchema || {}),
            outputSchema: api.outputSchema
        };
    }

    /**
     * Map backend action to frontend format
     */
    private mapAction(api: ApiActionDefinition): ActionDefinition {
        return {
            id: api.id,
            name: api.name,
            description: api.description,
            configFields: this.schemaToConfigFields(api.inputSchema || {}),
            inputSchema: api.inputSchema,
            outputSchema: api.outputSchema
        };
    }

    /**
     * Convert backend FieldSchema to frontend ConfigField array
     */
    private schemaToConfigFields(schema: Record<string, FieldSchema>): ConfigField[] {
        return Object.entries(schema).map(([key, field]) => ({
            key,
            label: field.label,
            type: this.mapFieldType(field.type, field.enumValues),
            required: field.required || false,
            defaultValue: field.defaultValue,
            options: field.enumValues?.map(v => ({ value: v, label: v })),
            placeholder: `Enter ${field.label.toLowerCase()}`
        }));
    }

    /**
     * Map backend field type to frontend type
     */
    private mapFieldType(type: string, hasEnum?: string[]): ConfigField['type'] {
        if (hasEnum && hasEnum.length > 0) return 'select';
        switch (type) {
            case 'string': return 'text';
            case 'number': return 'number';
            case 'boolean': return 'boolean';
            case 'object': return 'json';
            case 'array': return 'json';
            default: return 'text';
        }
    }

    /**
     * Map backend connection to frontend format
     */
    private mapConnection(api: UserConnection): ConnectedAccount {
        return {
            id: api.id,
            connectorId: api.connectorId,
            userId: api.userId,
            accountName: api.metadata?.['email'] || api.metadata?.['name'] || 'Connected Account',
            accountEmail: api.metadata?.['email'],
            status: api.status,
            isActive: api.status === 'ACTIVE',
            createdAt: new Date(api.createdAt),
            metadata: api.metadata
        };
    }

    // ========== Fallback Data ==========

    /**
     * Fallback connectors for when backend is unavailable
     */
    private getFallbackConnectors(): ConnectorDefinition[] {
        return [
            {
                id: 'gmail',
                name: 'Gmail',
                description: 'Read and send emails via Gmail',
                icon: 'email',
                category: 'Email',
                authType: 'oauth2',
                color: '#EA4335',
                triggers: [{
                    id: 'new_email',
                    name: 'New Email Received',
                    description: 'Triggers when a new email arrives',
                    configFields: []
                }],
                actions: [{
                    id: 'send_email',
                    name: 'Send Email',
                    description: 'Send an email',
                    configFields: [
                        { key: 'to', label: 'To', type: 'text', required: true },
                        { key: 'subject', label: 'Subject', type: 'text', required: true },
                        { key: 'body', label: 'Body', type: 'textarea', required: true }
                    ]
                }],
                isEnabled: true
            },
            {
                id: 'slack',
                name: 'Slack',
                description: 'Send messages to Slack channels',
                icon: 'chat',
                category: 'Communication',
                authType: 'oauth2',
                color: '#4A154B',
                triggers: [],
                actions: [{
                    id: 'send_message',
                    name: 'Send Message',
                    description: 'Send a message to a Slack channel',
                    configFields: [
                        { key: 'channel', label: 'Channel', type: 'text', required: true },
                        { key: 'text', label: 'Message', type: 'textarea', required: true }
                    ]
                }],
                isEnabled: true
            },
            {
                id: 'telegram',
                name: 'Telegram',
                description: 'Send messages via Telegram bot',
                icon: 'send',
                category: 'Communication',
                authType: 'api_key',
                color: '#0088CC',
                triggers: [],
                actions: [{
                    id: 'send_message',
                    name: 'Send Message',
                    description: 'Send a text message',
                    configFields: [
                        { key: 'chatId', label: 'Chat ID', type: 'text', required: true },
                        { key: 'text', label: 'Message', type: 'textarea', required: true }
                    ]
                }],
                isEnabled: true
            },
            {
                id: 'gemini',
                name: 'Google Gemini AI',
                description: 'AI-powered text analysis and generation',
                icon: 'psychology',
                category: 'AI',
                authType: 'api_key',
                color: '#4285F4',
                triggers: [],
                actions: [{
                    id: 'analyze_email',
                    name: 'Analyze Email',
                    description: 'Analyze if an email is a hiring/recruiter email',
                    configFields: [
                        { key: 'subject', label: 'Subject', type: 'text', required: true },
                        { key: 'body', label: 'Email Body', type: 'textarea', required: true }
                    ]
                }],
                isEnabled: true
            }
        ];
    }
}
