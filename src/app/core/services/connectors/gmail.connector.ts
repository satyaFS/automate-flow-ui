import { ConnectorDefinition } from '../../models/connector.model';

/**
 * Gmail Connector Definition
 * 
 * Provides email automation capabilities:
 * - Triggers: New email, Email updated, Label added
 * - Actions: Send email, Create draft, Add label
 */
export const GMAIL_CONNECTOR: ConnectorDefinition = {
    id: 'gmail',
    name: 'Gmail',
    description: 'Connect to Gmail to send and receive emails',
    icon: 'email',
    color: '#EA4335',
    category: 'email',

    authType: 'oauth2',
    oauth: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        scopes: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.modify'
        ]
    },

    triggers: [
        {
            id: 'new_email',
            name: 'New Email Received',
            description: 'Triggers when a new email arrives in your inbox',
            configFields: [
                {
                    key: 'labelFilter',
                    label: 'Label Filter',
                    type: 'select',
                    required: false,
                    placeholder: 'All emails',
                    options: [
                        { value: 'INBOX', label: 'Inbox' },
                        { value: 'IMPORTANT', label: 'Important' },
                        { value: 'STARRED', label: 'Starred' }
                    ],
                    helpText: 'Only trigger for emails with this label'
                },
                {
                    key: 'fromFilter',
                    label: 'From Address',
                    type: 'text',
                    required: false,
                    placeholder: 'user@example.com',
                    helpText: 'Only trigger for emails from this address'
                }
            ],
            outputSchema: {
                type: 'object',
                properties: {
                    messageId: { type: 'string' },
                    from: { type: 'string' },
                    to: { type: 'string' },
                    subject: { type: 'string' },
                    body: { type: 'string' },
                    receivedAt: { type: 'string', format: 'date-time' }
                }
            }
        }
    ],

    actions: [
        {
            id: 'send_email',
            name: 'Send Email',
            description: 'Send an email from your Gmail account',
            configFields: [
                {
                    key: 'to',
                    label: 'To',
                    type: 'text',
                    required: true,
                    placeholder: 'recipient@example.com',
                    helpText: 'Email address of the recipient'
                },
                {
                    key: 'subject',
                    label: 'Subject',
                    type: 'text',
                    required: true,
                    placeholder: 'Email subject'
                },
                {
                    key: 'body',
                    label: 'Body',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Email content...',
                    helpText: 'Supports HTML formatting'
                },
                {
                    key: 'cc',
                    label: 'CC',
                    type: 'text',
                    required: false,
                    placeholder: 'cc@example.com'
                }
            ],
            inputSchema: {
                type: 'object',
                required: ['to', 'subject', 'body'],
                properties: {
                    to: { type: 'string' },
                    subject: { type: 'string' },
                    body: { type: 'string' },
                    cc: { type: 'string' }
                }
            }
        },
        {
            id: 'create_draft',
            name: 'Create Draft',
            description: 'Create a draft email without sending',
            configFields: [
                {
                    key: 'to',
                    label: 'To',
                    type: 'text',
                    required: true,
                    placeholder: 'recipient@example.com'
                },
                {
                    key: 'subject',
                    label: 'Subject',
                    type: 'text',
                    required: true,
                    placeholder: 'Email subject'
                },
                {
                    key: 'body',
                    label: 'Body',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Email content...'
                }
            ]
        }
    ],

    version: '1.0.0',
    documentationUrl: 'https://developers.google.com/gmail/api',
    isEnabled: true
};
