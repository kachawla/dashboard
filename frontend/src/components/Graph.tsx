import ReactFlow, { Background, Controls } from 'reactflow';
import { Application } from './ApplicationView';
import 'reactflow/dist/style.css';

import ResourceNode from './nodes/ResourceNode';

const nodeTypes = { resource: ResourceNode }

function Graph(
    props: {
        application: Application
    }
) {
    let yOffsetMap: { [key: string]: number } = {};
    let xOffset = 4;
    let yOffset = 1;

    const nodes = props.application.resources.map((resource, index) => {
        if (resource.type === 'Applications.Core/containers') {
            xOffset = 1;
            if (!yOffsetMap[resource.type]) {
                yOffsetMap[resource.type] = 1;
            }
            else {
                yOffsetMap[resource.type] += 1;
            }
            yOffset = yOffsetMap[resource.type];
        }
        else if (resource.type === 'Applications.Core/httpRoutes') {
            xOffset = 2;
            if (!yOffsetMap[resource.type]) {
                yOffsetMap[resource.type] = 1;
            }
            else {
                yOffsetMap[resource.type] += 1;
            }
            yOffset = yOffsetMap[resource.type];
        }
        else {
            xOffset = 3;
            if (!yOffsetMap['other']) {
                yOffsetMap['other'] = 1;
            }
            else {
                yOffsetMap['other'] += 1;
            }
            yOffset = yOffsetMap['other'];
        }

        return {
            id: resource.id,
            position: { x: xOffset * 500, y: yOffset * 100 },
            type: 'resource',
            data: {
                label: resource.name + ' (' + resource.type + ')',
                name: resource.name,
                type: resource.type
            },
        }
    });

    const edges = props.application.resources.flatMap((resource) => {
        const connections = resource.properties.connections;
        if (!connections) {
            return [];
        }

        return Object.entries(connections).map(([key, value]) => {
            return {
                id: 'edge-' + resource.name + '-' + key,
                source: resource.id,
                target: value.source,
                arrowHeadType: 'arrowclosed',
                label: key,
            }
        })
    });

    return (
        <div style={{ height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}

export default Graph;