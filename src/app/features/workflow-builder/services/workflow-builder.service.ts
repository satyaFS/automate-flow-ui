import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Position {
    x: number;
    y: number;
}

export interface WorkflowNode {
    id: string;
    type: 'trigger' | 'action' | 'condition';
    position: Position;
    data: {
        connectorId: string;
        connectorName: string;
        actionId?: string;
        actionName?: string;
        triggerId?: string;
        triggerName?: string;
        icon: string;
        config: Record<string, any>;
    };
    selected?: boolean;
}

export interface Connection {
    id: string;
    sourceId: string;
    targetId: string;
}

export interface CanvasState {
    nodes: WorkflowNode[];
    connections: Connection[];
    zoom: number;
    pan: Position;
}

@Injectable({
    providedIn: 'root'
})
export class WorkflowBuilderService {
    private stateSubject = new BehaviorSubject<CanvasState>({
        nodes: [],
        connections: [],
        zoom: 1,
        pan: { x: 0, y: 0 }
    });

    state$ = this.stateSubject.asObservable();

    private nodeIdCounter = 0;
    private connectionIdCounter = 0;

    get currentState(): CanvasState {
        return this.stateSubject.value;
    }

    initializeFromWorkflow(workflow: any): void {
        const nodes: WorkflowNode[] = [];
        const connections: Connection[] = [];

        // Create trigger node if exists
        if (workflow.trigger) {
            nodes.push({
                id: 'trigger-1',
                type: 'trigger',
                position: { x: 100, y: 100 },
                data: {
                    connectorId: workflow.trigger.triggerType?.toLowerCase() || 'webhook',
                    connectorName: workflow.trigger.triggerType || 'Webhook',
                    triggerId: workflow.trigger.triggerId,
                    triggerName: workflow.trigger.triggerType,
                    icon: this.getConnectorIcon(workflow.trigger.triggerType),
                    config: workflow.trigger
                }
            });
        }

        // Create action nodes
        if (workflow.actions && Array.isArray(workflow.actions)) {
            workflow.actions.forEach((action: any, index: number) => {
                const nodeId = `action-${index + 1}`;
                nodes.push({
                    id: nodeId,
                    type: 'action',
                    position: { x: 100, y: 250 + (index * 150) },
                    data: {
                        connectorId: action.actionType?.toLowerCase() || 'http',
                        connectorName: action.actionType || 'HTTP',
                        actionId: action.actionId,
                        actionName: action.actionType,
                        icon: this.getConnectorIcon(action.actionType),
                        config: action
                    }
                });

                // Create connections
                const sourceId = index === 0 ? 'trigger-1' : `action-${index}`;
                connections.push({
                    id: `conn-${index}`,
                    sourceId,
                    targetId: nodeId
                });
            });
        }

        this.stateSubject.next({
            nodes,
            connections,
            zoom: 1,
            pan: { x: 0, y: 0 }
        });
    }

    addNode(
        type: 'trigger' | 'action' | 'condition',
        connectorId: string,
        connectorName: string,
        extraData?: { icon?: string; color?: string; triggerId?: string; actionId?: string }
    ): WorkflowNode {
        const state = this.currentState;
        const id = `${type}-${++this.nodeIdCounter}`;

        const newNode: WorkflowNode = {
            id,
            type,
            position: this.getNextNodePosition(type),
            data: {
                connectorId,
                connectorName,
                icon: extraData?.icon || this.getConnectorIcon(connectorId),
                triggerId: extraData?.triggerId,
                actionId: extraData?.actionId,
                config: {}
            }
        };

        // Auto-connect to last node if it's an action
        const connections = [...state.connections];
        if (type === 'action' && state.nodes.length > 0) {
            const lastNode = state.nodes[state.nodes.length - 1];
            connections.push({
                id: `conn-${++this.connectionIdCounter}`,
                sourceId: lastNode.id,
                targetId: id
            });
        }

        this.stateSubject.next({
            ...state,
            nodes: [...state.nodes, newNode],
            connections
        });

        return newNode;
    }

    updateNodePosition(nodeId: string, position: Position): void {
        const state = this.currentState;
        const nodes = state.nodes.map(node =>
            node.id === nodeId ? { ...node, position } : node
        );
        this.stateSubject.next({ ...state, nodes });
    }

    updateNodeConfig(nodeId: string, config: Record<string, any>): void {
        const state = this.currentState;
        const nodes = state.nodes.map(node =>
            node.id === nodeId
                ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
                : node
        );
        this.stateSubject.next({ ...state, nodes });
    }

    selectNode(nodeId: string | null): void {
        const state = this.currentState;
        const nodes = state.nodes.map(node => ({
            ...node,
            selected: node.id === nodeId
        }));
        this.stateSubject.next({ ...state, nodes });
    }

    deleteNode(nodeId: string): void {
        const state = this.currentState;
        const nodes = state.nodes.filter(n => n.id !== nodeId);
        const connections = state.connections.filter(
            c => c.sourceId !== nodeId && c.targetId !== nodeId
        );
        this.stateSubject.next({ ...state, nodes, connections });
    }

    addConnection(sourceId: string, targetId: string): void {
        const state = this.currentState;
        const connection: Connection = {
            id: `conn-${++this.connectionIdCounter}`,
            sourceId,
            targetId
        };
        this.stateSubject.next({
            ...state,
            connections: [...state.connections, connection]
        });
    }

    deleteConnection(connectionId: string): void {
        const state = this.currentState;
        const connections = state.connections.filter(c => c.id !== connectionId);
        this.stateSubject.next({ ...state, connections });
    }

    setZoom(zoom: number): void {
        const state = this.currentState;
        const clampedZoom = Math.max(0.25, Math.min(2, zoom));
        this.stateSubject.next({ ...state, zoom: clampedZoom });
    }

    setPan(pan: Position): void {
        const state = this.currentState;
        this.stateSubject.next({ ...state, pan });
    }

    clearCanvas(): void {
        this.stateSubject.next({
            nodes: [],
            connections: [],
            zoom: 1,
            pan: { x: 0, y: 0 }
        });
        this.nodeIdCounter = 0;
        this.connectionIdCounter = 0;
    }

    getSelectedNode(): WorkflowNode | null {
        return this.currentState.nodes.find(n => n.selected) || null;
    }

    private getNextNodePosition(type: string): Position {
        const state = this.currentState;
        const nodesOfType = state.nodes.filter(n =>
            type === 'trigger' ? n.type === 'trigger' : n.type !== 'trigger'
        );
        const yOffset = nodesOfType.length * 150;

        return {
            x: 100,
            y: type === 'trigger' ? 100 : 250 + yOffset
        };
    }

    private getConnectorIcon(connectorId: string): string {
        const iconMap: Record<string, string> = {
            'gmail': 'email',
            'slack': 'chat',
            'telegram': 'send',
            'gemini': 'psychology',
            'webhook': 'webhook',
            'http': 'http',
            'schedule': 'schedule'
        };
        return iconMap[connectorId?.toLowerCase()] || 'extension';
    }

    exportToWorkflow(): any {
        const state = this.currentState;
        const triggerNode = state.nodes.find(n => n.type === 'trigger');
        const actionNodes = state.nodes.filter(n => n.type === 'action');

        return {
            trigger: triggerNode ? {
                triggerType: triggerNode.data.connectorName,
                ...triggerNode.data.config
            } : null,
            actions: actionNodes.map(node => ({
                actionType: node.data.connectorName,
                ...node.data.config
            }))
        };
    }
}
