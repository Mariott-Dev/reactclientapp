import React, { memo, useContext, useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";
import EditorContext from "./rightEditor-context";
import "./Node.css";
import { Tooltip } from "react-tooltip";

export default memo(({ data, isConnectable }) => {
  const [channelNameInput, setChannelNameInput] = useState("");
  const [channelNameOutput, setChannelNameOutput] = useState("");
  const editorCtx = useContext(EditorContext);
  const inputRef = useRef();
  const channelSize = 8;

  // adding the custom onChangeEvent to the rux-input in order to add a custom name to the block data
  useEffect(() => {
    const handleRuxChange = (event) => {
      if (editorCtx.blockData) {
        const dataObject = editorCtx.blockData;
        dataObject.blockData.newNodeName = event.target.value;
        editorCtx.setBlockData(dataObject);
      }
    };
    const inputElem = inputRef.current;
    inputElem.addEventListener('ruxchange', handleRuxChange);
    return () => {
      inputElem.removeEventListener('ruxchange', handleRuxChange);
    };
  }, [editorCtx, editorCtx.blockData]); // as soon as the blockData context is ready it will mount this onChange event handler

  return (
    <div className="node" onClick={() => {
      editorCtx.setBlockData(data)
    }}>
      {data.blockData.channels.map((channel) => {
        if (channel.direction === "input") {
          return (
            <Handle
              type="target"
              position={Position.Top}
              isConnectable={isConnectable}
              onMouseEnter={() => setChannelNameInput(channel.name)}
              onMouseLeave={() => setChannelNameInput("")}
              data-tooltip-id="channel-name-input" data-tooltip-content={channelNameInput}
              style={{ height: channelSize, width: channelSize }}
            >
              <Tooltip id="channel-name-input" />
            </Handle>
          );
        }
        if (channel.direction === "output") {
          return (
            <Handle
              type="source"
              position={Position.Bottom}
              isConnectable={isConnectable}
              onMouseEnter={() => setChannelNameOutput(channel.name)}
              onMouseLeave={() => setChannelNameOutput("")}
              data-tooltip-id="channel-name-output" data-tooltip-content={channelNameOutput}
              style={{ height: channelSize, width: channelSize }}
            >
              <Tooltip
                id="channel-name-output"
                place='bottom'
              />
            </Handle>
          );
        }
        return "";
      })}
      <rux-input
        ref={inputRef}
        type="text"
        id="newname"
        name="newname"
        placeholder="Block name"
        value={data.blockData.newNodeName || ""}
        defaultValue={data.blockData.newNodeName || ""}
      ></rux-input>
      <div>{data.name.split('.').pop()}</div>
    </div>
  );
});
