import { ConnectorDefinition } from '../../models/connector.model';

/**
 * Telegram Connector Definition
 * 
 * Bot messaging capabilities:
 * - Triggers: New message, Command received
 * - Actions: Send message, Send photo, Send document
 */
export const TELEGRAM_CONNECTOR: ConnectorDefinition = {
    id: 'telegram',
    name: 'Telegram',
    description: 'Connect to Telegram for bot messaging',
    icon: 'send',
    color: '#0088CC',
    category: 'messaging',

    authType: 'api_key',

    triggers: [
        {
            id: 'new_message',
            name: 'New Message',
            description: 'Triggers when your bot receives a new message',
            configFields: [
                {
                    key: 'chatType',
                    label: 'Chat Type',
                    type: 'select',
                    required: false,
                    options: [
                        { value: 'all', label: 'All chats' },
                        { value: 'private', label: 'Private only' },
                        { value: 'group', label: 'Group only' }
                    ],
                    helpText: 'Filter by chat type'
                },
                {
                    key: 'commandFilter',
                    label: 'Command Filter',
                    type: 'text',
                    required: false,
                    placeholder: '/start',
                    helpText: 'Only trigger on specific command'
                }
            ]
        }
    ],

    actions: [
        {
            id: 'send_message',
            name: 'Send Message',
            description: 'Send a text message via your Telegram bot',
            configFields: [
                {
                    key: 'chatId',
                    label: 'Chat ID',
                    type: 'text',
                    required: true,
                    placeholder: '123456789',
                    helpText: 'Target chat ID or @username'
                },
                {
                    key: 'message',
                    label: 'Message',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Your message...',
                    helpText: 'Supports Markdown formatting'
                },
                {
                    key: 'parseMode',
                    label: 'Parse Mode',
                    type: 'select',
                    required: false,
                    defaultValue: 'Markdown',
                    options: [
                        { value: 'Markdown', label: 'Markdown' },
                        { value: 'HTML', label: 'HTML' },
                        { value: 'MarkdownV2', label: 'Markdown V2' }
                    ]
                }
            ]
        },
        {
            id: 'send_photo',
            name: 'Send Photo',
            description: 'Send an image via your Telegram bot',
            configFields: [
                {
                    key: 'chatId',
                    label: 'Chat ID',
                    type: 'text',
                    required: true,
                    placeholder: '123456789'
                },
                {
                    key: 'photoUrl',
                    label: 'Photo URL',
                    type: 'text',
                    required: true,
                    placeholder: 'https://example.com/image.jpg'
                },
                {
                    key: 'caption',
                    label: 'Caption',
                    type: 'text',
                    required: false,
                    placeholder: 'Image caption'
                }
            ]
        }
    ],

    version: '1.0.0',
    documentationUrl: 'https://core.telegram.org/bots/api',
    isEnabled: true
};
