import React, { useState, useRef, useCallback, useMemo, useContext, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Background,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";
import "./index.css";

import LeftSidebar from "./components/Left-Sidebar";
import RightSidebar from "./components/Right-Sidebar";
import SelectableNode from "./components/SelectableNode";
import EditorContext from "./components/rightEditor-context"
import CustomPanel from "./components/CustomPanel";

//check if local storage has existing flow
const initialNodes = sessionStorage.getItem('flow') ? JSON.parse(sessionStorage.getItem('flow')).nodes : [];
const initialEdges = sessionStorage.getItem('flow') ? JSON.parse(sessionStorage.getItem('flow')).edges : [];

// const getNodeId = (block) => `dnd_node.${block.id}.${Math.random(7)}`;

const DnDFlow = () => {
  const nodeTypes = useMemo(() => ({
    SelectableNode: SelectableNode
  }), []);

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [variant, setVariant] = useState('cross');
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const editorCtx = useContext(EditorContext);

  useEffect(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      sessionStorage.setItem('flow', JSON.stringify(flow));
    }
  }, [nodes, edges]);

  const onConnect = useCallback((params) => setEdges((eds) => {
    const { source, target } = params;
    const newEdge = {
      source,
      target,
      markerEnd: {
        type: MarkerType.Arrow,
        width: 35,
        height: 35,
      },
    }
    const updatedEdges = addEdge(newEdge, eds)
    return updatedEdges
  }
  ), []);

  const handlePaneClick = (event) => {
    const isNode = nodes.some((node) => node.id === event.target.id);
    if (!isNode) {
      editorCtx.setBlockData(null);
    }
  }

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const type = data.type;
      const block = data.block;

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      let name = prompt(`Enter a name for the new "${data.block.name.split(".").pop()}" node:`);
      if (name != null) {

        while (name === "") {
          name = prompt("A name is required. Please enter a different name:")
        }
        // Check if the name entered by the user is already in use
        while (nodes.some((node) => node.id === name)) {
          name = prompt(`The name "${name}" is already in use. Please enter a different name:`);
        }
        const newNode = {
          id: name,
          type,
          position,
          data: { name: block.name, id: name, blockData: { ...block, newNodeName: name } },
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, nodes]
  );

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <LeftSidebar />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            onPaneClick={handlePaneClick}
          >
            <Background color="#ccc" variant={variant} />
            <Panel position="bottom-left">
              <rux-button-group h-align="right">
                <rux-button onClick={() => setVariant('dots')}>dots</rux-button>
                <rux-button onClick={() => setVariant('lines')}>lines</rux-button>
                <rux-button onClick={() => setVariant('cross')}>cross</rux-button>
              </rux-button-group>
            </Panel>
            <CustomPanel setNodes={setNodes} setEdges={setEdges}></CustomPanel>
          </ReactFlow>
        </div>
        <RightSidebar nodes={nodes} setNodes={setNodes} />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
