/**
 * Connector Models - Aligned with Backend API Contracts
 * 
 * These interfaces match the backend API response from:
 * GET /api/connectors (Auth Service on port 8085)
 * 
 * UI-specific properties (color, etc.) are added via mapping layer.
 */

// ========== Backend API Types ==========

/** Field schema from backend */
export interface FieldSchema {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    label: string;
    required?: boolean;
    defaultValue?: string;
    enumValues?: string[];
}

/** OAuth configuration from backend */
export interface OAuthConfig {
    authUrl: string;
    tokenUrl: string;
    scopes: string[];
}

/** Trigger definition from backend */
export interface ApiTriggerDefinition {
    id: string;
    name: string;
    description: string;
    outputSchema: Record<string, FieldSchema>;
}

/** Action definition from backend */
export interface ApiActionDefinition {
    id: string;
    name: string;
    description: string;
    inputSchema: Record<string, FieldSchema>;
    outputSchema?: Record<string, FieldSchema>;
}

/** Connector definition from backend API */
export interface ApiConnectorDefinition {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    authType: 'OAUTH2' | 'API_KEY';
    oauth?: OAuthConfig;
    apiKeyHeader?: string;
    triggers: ApiTriggerDefinition[];
    actions: ApiActionDefinition[];
}

/** User connection from backend */
export interface UserConnection {
    id: string;
    userId: string;
    connectorId: string;
    status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
    metadata?: Record<string, string>;
    createdAt: string;
    updatedAt: string;
}

// ========== Frontend Enhanced Types ==========

/** Enhanced trigger with UI-friendly config fields */
export interface TriggerDefinition {
    id: string;
    name: string;
    description: string;
    icon?: string;
    configFields: ConfigField[];
    outputSchema?: Record<string, FieldSchema>;
}

/** Enhanced action with UI-friendly config fields */
export interface ActionDefinition {
    id: string;
    name: string;
    description: string;
    icon?: string;
    configFields: ConfigField[];
    inputSchema?: Record<string, FieldSchema>;
    outputSchema?: Record<string, FieldSchema>;
}

/** UI-friendly config field (transformed from FieldSchema) */
export interface ConfigField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'json' | 'mapping';
    required: boolean;
    placeholder?: string;
    defaultValue?: any;
    options?: { value: string; label: string }[];
    helpText?: string;
    validationPattern?: string;
}

/** Enhanced connector for frontend use */
export interface ConnectorDefinition {
    // From API
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    authType: 'oauth2' | 'api_key' | 'none';
    oauth?: OAuthConfig;
    apiKeyHeader?: string;

    // Enhanced for UI
    color: string;
    triggers: TriggerDefinition[];
    actions: ActionDefinition[];

    // UI metadata
    version?: string;
    documentationUrl?: string;
    isEnabled?: boolean;
    isBeta?: boolean;
}

/** Connected account (user's authenticated connection) */
export interface ConnectedAccount {
    id: string;
    connectorId: string;
    userId: string;
    accountName: string;
    accountEmail?: string;
    status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
    isActive: boolean;
    createdAt: Date;
    lastUsedAt?: Date;
    expiresAt?: Date;
    metadata?: Record<string, string>;
}

// ========== Connector Categories ==========

export type ConnectorCategory =
    | 'Email'
    | 'Communication'
    | 'AI'
    | 'Developer'
    | 'Productivity'
    | 'CRM'
    | 'Marketing'
    | 'Database'
    | 'Storage'
    | 'Social'
    | 'Other';

export interface CategoryInfo {
    id: string;
    name: string;
    icon: string;
    order: number;
}

// ========== Mapping Utilities ==========

/** Color map for connectors (UI enhancement) */
export const CONNECTOR_COLORS: Record<string, string> = {
    'gmail': '#EA4335',
    'slack': '#4A154B',
    'telegram': '#0088CC',
    'gemini': '#4285F4',
    'webhook': '#6366F1',
    'schedule': '#F97316',
    'http': '#10B981',
    'notion': '#000000',
    'github': '#181717',
    'sheets': '#34A853'
};

/** Icon map for connectors */
export const CONNECTOR_ICONS: Record<string, string> = {
    'gmail': 'email',
    'slack': 'chat',
    'telegram': 'send',
    'gemini': 'psychology',
    'webhook': 'webhook',
    'schedule': 'schedule',
    'http': 'http'
};

/** Get color for connector, with fallback */
export function getConnectorColor(connectorId: string): string {
    return CONNECTOR_COLORS[connectorId.toLowerCase()] || '#6366F1';
}

/** Get icon for connector, with fallback */
export function getConnectorIcon(connectorId: string, defaultIcon?: string): string {
    return CONNECTOR_ICONS[connectorId.toLowerCase()] || defaultIcon || 'extension';
}
