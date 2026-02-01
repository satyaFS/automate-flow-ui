import { ConnectorDefinition } from '../../models/connector.model';

/**
 * Gemini AI Connector Definition
 * 
 * AI/ML capabilities:
 * - Actions: Generate text, Classify content, Extract data
 */
export const GEMINI_CONNECTOR: ConnectorDefinition = {
    id: 'gemini',
    name: 'Gemini AI',
    description: 'Use Google Gemini AI for text generation and analysis',
    icon: 'psychology',
    color: '#4285F4',
    category: 'ai',

    authType: 'api_key',

    triggers: [], // AI connectors typically don't have triggers

    actions: [
        {
            id: 'generate_text',
            name: 'Generate Text',
            description: 'Generate text using Gemini AI',
            configFields: [
                {
                    key: 'prompt',
                    label: 'Prompt',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Enter your prompt here...',
                    helpText: 'The instruction for the AI model'
                },
                {
                    key: 'model',
                    label: 'Model',
                    type: 'select',
                    required: false,
                    defaultValue: 'gemini-pro',
                    options: [
                        { value: 'gemini-pro', label: 'Gemini Pro' },
                        { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' }
                    ]
                },
                {
                    key: 'temperature',
                    label: 'Temperature',
                    type: 'number',
                    required: false,
                    defaultValue: 0.7,
                    helpText: '0 = deterministic, 1 = creative'
                },
                {
                    key: 'maxTokens',
                    label: 'Max Tokens',
                    type: 'number',
                    required: false,
                    defaultValue: 1024,
                    helpText: 'Maximum length of generated response'
                }
            ],
            outputSchema: {
                type: 'object',
                properties: {
                    text: { type: 'string' },
                    usage: {
                        type: 'object',
                        properties: {
                            promptTokens: { type: 'number' },
                            completionTokens: { type: 'number' }
                        }
                    }
                }
            }
        },
        {
            id: 'classify_text',
            name: 'Classify Text',
            description: 'Classify text into categories using AI',
            configFields: [
                {
                    key: 'text',
                    label: 'Text to Classify',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Text to be classified...'
                },
                {
                    key: 'categories',
                    label: 'Categories',
                    type: 'text',
                    required: true,
                    placeholder: 'positive, negative, neutral',
                    helpText: 'Comma-separated list of categories'
                }
            ],
            outputSchema: {
                type: 'object',
                properties: {
                    category: { type: 'string' },
                    confidence: { type: 'number' }
                }
            }
        },
        {
            id: 'extract_data',
            name: 'Extract Structured Data',
            description: 'Extract structured data from text using AI',
            configFields: [
                {
                    key: 'text',
                    label: 'Source Text',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Text to extract data from...'
                },
                {
                    key: 'schema',
                    label: 'Output Schema (JSON)',
                    type: 'json',
                    required: true,
                    placeholder: '{"name": "string", "email": "string"}',
                    helpText: 'JSON schema defining the data to extract'
                }
            ]
        }
    ],

    version: '1.0.0',
    documentationUrl: 'https://ai.google.dev/docs',
    isEnabled: true
};
