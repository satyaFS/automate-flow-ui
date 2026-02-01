import { ConnectorDefinition } from '../../models/connector.model';

/**
 * Slack Connector Definition
 * 
 * Provides messaging and notification capabilities:
 * - Triggers: New message, Reaction added, Channel created
 * - Actions: Send message, Create channel, Add reaction
 */
export const SLACK_CONNECTOR: ConnectorDefinition = {
    id: 'slack',
    name: 'Slack',
    description: 'Connect to Slack for team messaging and notifications',
    icon: 'chat',
    color: '#4A154B',
    category: 'messaging',

    authType: 'oauth2',
    oauth: {
        authUrl: 'https://slack.com/oauth/v2/authorize',
        tokenUrl: 'https://slack.com/api/oauth.v2.access',
        scopes: [
            'channels:read',
            'chat:write',
            'users:read'
        ]
    },

    triggers: [
        {
            id: 'new_message',
            name: 'New Message',
            description: 'Triggers when a new message is posted in a channel',
            configFields: [
                {
                    key: 'channel',
                    label: 'Channel',
                    type: 'select',
                    required: true,
                    placeholder: 'Select channel',
                    options: [], // Populated dynamically
                    helpText: 'Channel to monitor for new messages'
                },
                {
                    key: 'includeBot',
                    label: 'Include Bot Messages',
                    type: 'boolean',
                    required: false,
                    defaultValue: false,
                    helpText: 'Whether to trigger on messages from bots'
                }
            ],
            outputSchema: {
                type: 'object',
                properties: {
                    messageId: { type: 'string' },
                    channel: { type: 'string' },
                    user: { type: 'string' },
                    text: { type: 'string' },
                    timestamp: { type: 'string' }
                }
            }
        }
    ],

    actions: [
        {
            id: 'send_message',
            name: 'Send Message',
            description: 'Send a message to a Slack channel or user',
            configFields: [
                {
                    key: 'channel',
                    label: 'Channel',
                    type: 'select',
                    required: true,
                    placeholder: 'Select channel',
                    options: [], // Populated dynamically
                    helpText: 'Channel or user to send the message to'
                },
                {
                    key: 'message',
                    label: 'Message',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Your message here...',
                    helpText: 'Supports Slack markdown formatting'
                },
                {
                    key: 'attachments',
                    label: 'Attachments (JSON)',
                    type: 'json',
                    required: false,
                    placeholder: '[]',
                    helpText: 'Optional rich message attachments'
                }
            ]
        },
        {
            id: 'create_channel',
            name: 'Create Channel',
            description: 'Create a new Slack channel',
            configFields: [
                {
                    key: 'name',
                    label: 'Channel Name',
                    type: 'text',
                    required: true,
                    placeholder: 'new-channel',
                    validationPattern: '^[a-z0-9-]+$',
                    helpText: 'Lowercase letters, numbers, and hyphens only'
                },
                {
                    key: 'isPrivate',
                    label: 'Private Channel',
                    type: 'boolean',
                    required: false,
                    defaultValue: false
                },
                {
                    key: 'description',
                    label: 'Description',
                    type: 'text',
                    required: false,
                    placeholder: 'Channel description'
                }
            ]
        }
    ],

    version: '1.0.0',
    documentationUrl: 'https://api.slack.com/docs',
    isEnabled: true
};
