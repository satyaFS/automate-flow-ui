import { ConnectorDefinition } from '../../models/connector.model';

/**
 * Schedule Connector Definition
 * 
 * Time-based triggers:
 * - Triggers: Cron schedule, Interval, Specific time
 */
export const SCHEDULE_CONNECTOR: ConnectorDefinition = {
    id: 'schedule',
    name: 'Schedule',
    description: 'Run workflows on a schedule',
    icon: 'schedule',
    color: '#F97316',
    category: 'developer',

    authType: 'none',

    triggers: [
        {
            id: 'cron',
            name: 'Cron Schedule',
            description: 'Trigger based on a cron expression',
            configFields: [
                {
                    key: 'cronExpression',
                    label: 'Cron Expression',
                    type: 'text',
                    required: true,
                    placeholder: '0 9 * * MON-FRI',
                    helpText: 'Standard cron format (min hour day month weekday)'
                },
                {
                    key: 'timezone',
                    label: 'Timezone',
                    type: 'select',
                    required: false,
                    defaultValue: 'UTC',
                    options: [
                        { value: 'UTC', label: 'UTC' },
                        { value: 'America/New_York', label: 'Eastern Time' },
                        { value: 'America/Los_Angeles', label: 'Pacific Time' },
                        { value: 'Europe/London', label: 'London' },
                        { value: 'Asia/Kolkata', label: 'India' }
                    ]
                }
            ],
            outputSchema: {
                type: 'object',
                properties: {
                    triggeredAt: { type: 'string', format: 'date-time' },
                    scheduledAt: { type: 'string', format: 'date-time' }
                }
            }
        },
        {
            id: 'interval',
            name: 'Interval',
            description: 'Trigger at regular intervals',
            configFields: [
                {
                    key: 'interval',
                    label: 'Interval',
                    type: 'number',
                    required: true,
                    defaultValue: 60,
                    helpText: 'Interval in minutes'
                },
                {
                    key: 'unit',
                    label: 'Unit',
                    type: 'select',
                    required: true,
                    defaultValue: 'minutes',
                    options: [
                        { value: 'minutes', label: 'Minutes' },
                        { value: 'hours', label: 'Hours' },
                        { value: 'days', label: 'Days' }
                    ]
                }
            ]
        }
    ],

    actions: [],

    version: '1.0.0',
    isEnabled: true
};
