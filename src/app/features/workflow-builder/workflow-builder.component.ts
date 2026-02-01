import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WorkflowBuilderService, WorkflowNode, CanvasState } from './services/workflow-builder.service';
import { AppService } from '../../app.service';

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

    // Available connectors
    connectors = [
        { id: 'gmail', name: 'Gmail', icon: 'email', category: 'email', color: '#EA4335' },
        { id: 'slack', name: 'Slack', icon: 'chat', category: 'messaging', color: '#4A154B' },
        { id: 'telegram', name: 'Telegram', icon: 'send', category: 'messaging', color: '#0088CC' },
        { id: 'gemini', name: 'Gemini AI', icon: 'psychology', category: 'ai', color: '#4285F4' },
        { id: 'webhook', name: 'Webhook', icon: 'webhook', category: 'developer', color: '#6366F1' },
        { id: 'http', name: 'HTTP Request', icon: 'http', category: 'developer', color: '#F97316' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public builderService: WorkflowBuilderService,
        private appService: AppService
    ) { }

    ngOnInit(): void {
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
                this.selectedNode = this.builderService.getSelectedNode();
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

    openAppGallery(type: 'trigger' | 'action'): void {
        this.addingNodeType = type;
        this.showAppGallery = true;
    }

    closeAppGallery(): void {
        this.showAppGallery = false;
        this.addingNodeType = null;
    }

    selectConnector(connector: any): void {
        if (this.addingNodeType) {
            this.builderService.addNode(
                this.addingNodeType,
                connector.id,
                connector.name
            );
            this.closeAppGallery();
        }
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
}
