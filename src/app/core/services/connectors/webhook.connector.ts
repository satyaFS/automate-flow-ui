import { ConnectorDefinition } from '../../models/connector.model';

/**
 * Webhook Connector Definition
 * 
 * Developer tool for custom integrations:
 * - Triggers: Receive webhook
 * - Actions: Send HTTP request (GET, POST, PUT, DELETE)
 */
export const WEBHOOK_CONNECTOR: ConnectorDefinition = {
    id: 'webhook',
    name: 'Webhook',
    description: 'Receive incoming webhooks and make HTTP requests',
    icon: 'webhook',
    color: '#6366F1',
    category: 'developer',

    authType: 'none',

    triggers: [
        {
            id: 'receive_webhook',
            name: 'Receive Webhook',
            description: 'Triggers when this workflow receives an HTTP request',
            configFields: [
                {
                    key: 'method',
                    label: 'HTTP Method',
                    type: 'select',
                    required: false,
                    defaultValue: 'POST',
                    options: [
                        { value: 'GET', label: 'GET' },
                        { value: 'POST', label: 'POST' },
                        { value: 'PUT', label: 'PUT' }
                    ]
                },
                {
                    key: 'authType',
                    label: 'Authentication',
                    type: 'select',
                    required: false,
                    defaultValue: 'none',
                    options: [
                        { value: 'none', label: 'None' },
                        { value: 'basic', label: 'Basic Auth' },
                        { value: 'bearer', label: 'Bearer Token' },
                        { value: 'signature', label: 'Signature Validation' }
                    ]
                }
            ],
            outputSchema: {
                type: 'object',
                properties: {
                    headers: { type: 'object' },
                    body: { type: 'object' },
                    query: { type: 'object' }
                }
            }
        }
    ],

    actions: [
        {
            id: 'http_request',
            name: 'HTTP Request',
            description: 'Make an HTTP request to any URL',
            configFields: [
                {
                    key: 'url',
                    label: 'URL',
                    type: 'text',
                    required: true,
                    placeholder: 'https://api.example.com/endpoint'
                },
                {
                    key: 'method',
                    label: 'Method',
                    type: 'select',
                    required: true,
                    defaultValue: 'GET',
                    options: [
                        { value: 'GET', label: 'GET' },
                        { value: 'POST', label: 'POST' },
                        { value: 'PUT', label: 'PUT' },
                        { value: 'PATCH', label: 'PATCH' },
                        { value: 'DELETE', label: 'DELETE' }
                    ]
                },
                {
                    key: 'headers',
                    label: 'Headers (JSON)',
                    type: 'json',
                    required: false,
                    placeholder: '{"Content-Type": "application/json"}'
                },
                {
                    key: 'body',
                    label: 'Request Body',
                    type: 'textarea',
                    required: false,
                    placeholder: '{"key": "value"}'
                },
                {
                    key: 'timeout',
                    label: 'Timeout (ms)',
                    type: 'number',
                    required: false,
                    defaultValue: 30000
                }
            ],
            outputSchema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    headers: { type: 'object' },
                    body: { type: 'object' }
                }
            }
        }
    ],

    version: '1.0.0',
    isEnabled: true
};
