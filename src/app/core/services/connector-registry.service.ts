import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
    ConnectorDefinition,
    TriggerDefinition,
    ActionDefinition,
    ConnectedAccount,
    getConnectorColor,
    getConnectorIcon
} from '../models/connector.model';
import { ConnectorApiService } from './connector-api.service';

/**
 * ConnectorRegistryService
 * 
 * Provides access to connectors from the backend API.
 * This is the primary service that components should use.
 * 
 * It wraps ConnectorApiService and provides convenience methods.
 */
@Injectable({
    providedIn: 'root'
})
export class ConnectorRegistryService {

    constructor(private api: ConnectorApiService) { }

    // ========== Observable Streams ==========

    /**
     * Get all connectors as an observable
     */
    getConnectors$(): Observable<ConnectorDefinition[]> {
        return this.api.connectors$;
    }

    /**
     * Get user connections as an observable
     */
    getConnections$(): Observable<ConnectedAccount[]> {
        return this.api.connections$;
    }

    /**
     * Loading state
     */
    get loading$(): Observable<boolean> {
        return this.api.loading$;
    }

    /**
     * Error state
     */
    get error$(): Observable<string | null> {
        return this.api.error$;
    }

    // ========== Query Methods ==========

    /**
     * Get all connectors (snapshot)
     */
    getAllConnectors(): ConnectorDefinition[] {
        return this.api.getConnectors();
    }

    /**
     * Get a specific connector by ID
     */
    getConnector(id: string): ConnectorDefinition | undefined {
        return this.api.getConnector(id);
    }

    /**
     * Get connectors by category
     */
    getConnectorsByCategory(category: string): ConnectorDefinition[] {
        return this.api.getConnectorsByCategory(category);
    }

    /**
     * Get connectors that have triggers
     */
    getConnectorsWithTriggers(): ConnectorDefinition[] {
        return this.api.getConnectorsWithTriggers();
    }

    /**
     * Get connectors that have actions
     */
    getConnectorsWithActions(): ConnectorDefinition[] {
        return this.api.getConnectorsWithActions();
    }

    /**
     * Search connectors by name or description
     */
    searchConnectors(query: string): ConnectorDefinition[] {
        return this.api.searchConnectors(query);
    }

    // ========== Trigger & Action Helpers ==========

    /**
     * Get all triggers for a connector
     */
    getTriggers(connectorId: string): TriggerDefinition[] {
        return this.getConnector(connectorId)?.triggers || [];
    }

    /**
     * Get a specific trigger
     */
    getTrigger(connectorId: string, triggerId: string): TriggerDefinition | undefined {
        return this.getTriggers(connectorId).find(t => t.id === triggerId);
    }

    /**
     * Get all actions for a connector
     */
    getActions(connectorId: string): ActionDefinition[] {
        return this.getConnector(connectorId)?.actions || [];
    }

    /**
     * Get a specific action
     */
    getAction(connectorId: string, actionId: string): ActionDefinition | undefined {
        return this.getActions(connectorId).find(a => a.id === actionId);
    }

    // ========== Connection Methods ==========

    /**
     * Check if user has connection for connector
     */
    isConnected(connectorId: string): boolean {
        return this.api.isConnected(connectorId);
    }

    /**
     * Get connections for a connector
     */
    getConnectionsForConnector(connectorId: string): ConnectedAccount[] {
        return this.api.getConnectionsForConnector(connectorId);
    }

    /**
     * Start OAuth flow
     */
    connectOAuth(connectorId: string): void {
        this.api.startOAuthFlow(connectorId);
    }

    /**
     * Save API key
     */
    connectApiKey(connectorId: string, apiKey: string): Observable<{ success: boolean; message: string }> {
        return this.api.saveApiKey(connectorId, apiKey);
    }

    /**
     * Disconnect
     */
    disconnect(connectionId: string): Observable<void> {
        return this.api.disconnect(connectionId);
    }

    /**
     * Refresh connectors from backend
     */
    refresh(): void {
        this.api.loadConnectors();
        this.api.loadConnections();
    }
}
