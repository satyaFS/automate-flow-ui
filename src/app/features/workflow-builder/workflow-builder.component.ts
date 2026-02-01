import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WorkflowBuilderService, WorkflowNode, CanvasState } from './services/workflow-builder.service';
import { AppService } from '../../app.service';
import { ConnectorRegistryService } from '../../core/services/connector-registry.service';
import { ConnectorDefinition, TriggerDefinition, ActionDefinition, ConfigField } from '../../core/models/connector.model';

@Component({
    selector: 'app-workflow-builder',
    templateUrl: './workflow-builder.component.html',
    styleUrls: ['./workflow-builder.component.scss']
})
export class WorkflowBuilderComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    workflowId: string | null = null;
    workflowName = 'Untitled Workflow';
    workflowDescription = '';
    isNewWorkflow = true;
    isSaving = false;

    canvasState: CanvasState = {
        nodes: [],
        connections: [],
        zoom: 1,
        pan: { x: 0, y: 0 }
    };

    selectedNode: WorkflowNode | null = null;
    showAppGallery = false;
    addingNodeType: 'trigger' | 'action' | null = null;
    gallerySearchQuery = '';

    // Connectors from registry
    connectors: ConnectorDefinition[] = [];
    filteredConnectors: ConnectorDefinition[] = [];

    // Selected node config
    selectedConnector: ConnectorDefinition | null = null;
    selectedTriggerOrAction: TriggerDefinition | ActionDefinition | null = null;
    nodeConfig: Record<string, any> = {};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public builderService: WorkflowBuilderService,
        private appService: AppService,
        private connectorRegistry: ConnectorRegistryService
    ) { }

    ngOnInit(): void {
        // Load connectors from registry
        this.connectorRegistry.getConnectors$()
            .pipe(takeUntil(this.destroy$))
            .subscribe(connectors => {
                this.connectors = connectors;
                this.filteredConnectors = connectors;
            });

        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id && id !== 'new') {
                this.workflowId = id;
                this.isNewWorkflow = false;
                this.loadWorkflow(id);
            } else {
                this.isNewWorkflow = true;
                this.builderService.clearCanvas();
            }
        });

        this.builderService.state$
            .pipe(takeUntil(this.destroy$))
            .subscribe(state => {
                this.canvasState = state;
                const newSelectedNode = this.builderService.getSelectedNode();

                // Update selected node config when selection changes
                if (newSelectedNode?.id !== this.selectedNode?.id) {
                    this.selectedNode = newSelectedNode;
                    this.loadNodeConfig();
                } else {
                    this.selectedNode = newSelectedNode;
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadWorkflow(id: string): void {
        this.appService.getWorkFlowById(id).subscribe({
            next: (workflow: any) => {
                this.workflowName = workflow.workflowName || 'Untitled';
                this.workflowDescription = workflow.workflowDescription || '';
                this.builderService.initializeFromWorkflow(workflow);
            },
            error: (err) => {
                console.error('Failed to load workflow:', err);
                this.router.navigate(['/workflowlist']);
            }
        });
    }

    @HostListener('document:keydown', ['$event'])
    handleKeydown(event: KeyboardEvent): void {
        // Delete selected node
        if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedNode) {
            event.preventDefault();
            this.deleteNode(this.selectedNode.id);
        }

        // Deselect on Escape
        if (event.key === 'Escape') {
            this.builderService.selectNode(null);
            this.showAppGallery = false;
        }

        // Save with Ctrl+S
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            this.saveWorkflow();
        }
    }

    onNodeSelect(nodeId: string): void {
        this.builderService.selectNode(nodeId);
    }

    onNodeDrag(event: { nodeId: string; position: { x: number; y: number } }): void {
        this.builderService.updateNodePosition(event.nodeId, event.position);
    }

    onCanvasClick(): void {
        this.builderService.selectNode(null);
    }

    closeAppGallery(): void {
        this.showAppGallery = false;
        this.addingNodeType = null;
        this.gallerySearchQuery = '';
    }

    deleteNode(nodeId: string): void {
        this.builderService.deleteNode(nodeId);
    }

    onZoomChange(delta: number): void {
        const newZoom = this.canvasState.zoom + delta;
        this.builderService.setZoom(newZoom);
    }

    fitToScreen(): void {
        this.builderService.setZoom(1);
        this.builderService.setPan({ x: 0, y: 0 });
    }

    updateNodeConfig(config: Record<string, any>): void {
        if (this.selectedNode) {
            this.builderService.updateNodeConfig(this.selectedNode.id, config);
        }
    }

    saveWorkflow(): void {
        this.isSaving = true;
        const workflowData = {
            workflowName: this.workflowName,
            workflowDescription: this.workflowDescription,
            userId: '1234',
            ...this.builderService.exportToWorkflow()
        };

        const request$ = this.isNewWorkflow
            ? this.appService.addWorkflow(workflowData)
            : this.appService.updateWorkflow(this.workflowId!, workflowData);

        request$.subscribe({
            next: (result: any) => {
                this.isSaving = false;
                if (this.isNewWorkflow && result.workflowId) {
                    this.workflowId = result.workflowId;
                    this.isNewWorkflow = false;
                    this.router.navigate(['/workflow', result.workflowId]);
                }
            },
            error: (err) => {
                console.error('Failed to save workflow:', err);
                this.isSaving = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/workflowlist']);
    }

    testWorkflow(): void {
        // TODO: Implement test execution
        console.log('Testing workflow...');
    }

    getCanvasTransform(): string {
        const { zoom, pan } = this.canvasState;
        return `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
    }

    hasTrigger(): boolean {
        return this.canvasState.nodes.some(n => n.type === 'trigger');
    }

    getConnectionPath(connection: any): string {
        const sourceNode = this.canvasState.nodes.find(n => n.id === connection.sourceId);
        const targetNode = this.canvasState.nodes.find(n => n.id === connection.targetId);

        if (!sourceNode || !targetNode) return '';

        // Node dimensions
        const nodeWidth = 180;
        const nodeHeight = 56;

        // Calculate connection points (center bottom to center top)
        const startX = sourceNode.position.x + nodeWidth / 2;
        const startY = sourceNode.position.y + nodeHeight;
        const endX = targetNode.position.x + nodeWidth / 2;
        const endY = targetNode.position.y;

        // Calculate bezier control points for smooth curve
        const midY = (startY + endY) / 2;

        return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
    }

    // ========== Connector Registry Integration ==========

    /**
     * Load configuration for selected node
     */
    loadNodeConfig(): void {
        if (!this.selectedNode) {
            this.selectedConnector = null;
            this.selectedTriggerOrAction = null;
            this.nodeConfig = {};
            return;
        }

        const connectorId = this.selectedNode.data.connectorId;
        this.selectedConnector = this.connectorRegistry.getConnector(connectorId) || null;

        if (this.selectedConnector) {
            if (this.selectedNode.type === 'trigger') {
                // Get first trigger or specific one from node config
                const triggerId = this.selectedNode.data.triggerId || this.selectedConnector.triggers[0]?.id;
                this.selectedTriggerOrAction = this.connectorRegistry.getTrigger(connectorId, triggerId) || null;
            } else {
                // Get first action or specific one from node config
                const actionId = this.selectedNode.data.actionId || this.selectedConnector.actions[0]?.id;
                this.selectedTriggerOrAction = this.connectorRegistry.getAction(connectorId, actionId) || null;
            }
        }

        // Load existing config from node
        this.nodeConfig = { ...this.selectedNode.data.config } || {};
    }

    /**
     * Get config fields for currently selected trigger/action
     */
    getConfigFields(): ConfigField[] {
        return this.selectedTriggerOrAction?.configFields || [];
    }

    /**
     * Get available triggers for selected connector
     */
    getAvailableTriggers(): TriggerDefinition[] {
        return this.selectedConnector?.triggers || [];
    }

    /**
     * Get available actions for selected connector
     */
    getAvailableActions(): ActionDefinition[] {
        return this.selectedConnector?.actions || [];
    }

    /**
     * Handle trigger/action selection change
     */
    onTriggerOrActionChange(id: string): void {
        if (!this.selectedConnector || !this.selectedNode) return;

        if (this.selectedNode.type === 'trigger') {
            this.selectedTriggerOrAction = this.connectorRegistry.getTrigger(this.selectedConnector.id, id) || null;
            this.builderService.updateNodeConfig(this.selectedNode.id, {
                ...this.selectedNode.data,
                triggerId: id
            });
        } else {
            this.selectedTriggerOrAction = this.connectorRegistry.getAction(this.selectedConnector.id, id) || null;
            this.builderService.updateNodeConfig(this.selectedNode.id, {
                ...this.selectedNode.data,
                actionId: id
            });
        }

        // Reset config when changing trigger/action
        this.nodeConfig = {};
    }

    /**
     * Update a config field value
     */
    onConfigFieldChange(key: string, value: any): void {
        this.nodeConfig[key] = value;

        if (this.selectedNode) {
            this.builderService.updateNodeConfig(this.selectedNode.id, {
                ...this.selectedNode.data,
                config: this.nodeConfig
            });
        }
    }

    /**
     * Filter connectors in gallery based on search and type
     */
    filterGalleryConnectors(): void {
        let filtered = this.connectors;

        // Filter by type (triggers only show connectors with triggers, etc.)
        if (this.addingNodeType === 'trigger') {
            filtered = this.connectorRegistry.getConnectorsWithTriggers();
        } else if (this.addingNodeType === 'action') {
            filtered = this.connectorRegistry.getConnectorsWithActions();
        }

        // Apply search filter
        if (this.gallerySearchQuery.trim()) {
            const query = this.gallerySearchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.description.toLowerCase().includes(query) ||
                c.category.toLowerCase().includes(query)
            );
        }

        this.filteredConnectors = filtered;
    }

    /**
     * Handle gallery search input
     */
    onGallerySearchChange(): void {
        this.filterGalleryConnectors();
    }

    /**
     * Open app gallery with proper filtering
     */
    openAppGallery(type: 'trigger' | 'action'): void {
        this.addingNodeType = type;
        this.gallerySearchQuery = '';
        this.filterGalleryConnectors();
        this.showAppGallery = true;
    }

    /**
     * Select connector and add node to canvas
     */
    selectConnector(connector: ConnectorDefinition): void {
        if (!this.addingNodeType) return;

        // Determine icon from connector
        const icon = connector.icon;

        // Add node with connector metadata
        this.builderService.addNode(
            this.addingNodeType,
            connector.id,
            connector.name,
            {
                icon,
                color: connector.color,
                triggerId: connector.triggers[0]?.id,
                actionId: connector.actions[0]?.id
            }
        );

        this.closeAppGallery();
    }
}
