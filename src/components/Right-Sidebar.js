import { useContext } from "react";
import EditorContext from "./rightEditor-context";
import TextBox from "./formComponents/TextBox";
import CheckBox from "./formComponents/CheckBox";
import ComboBox from './formComponents/ComboBox';
import { Tooltip } from "react-tooltip";
import "./formComponents/FormInputs.css";

const RightSideBar = ({ nodes, setNodes }) => {
  // Define the updateNode function here, and pass it down to TextBox
  const updateNode = (blockId, argumentName, newValue) => {
    const newNodes = nodes.map(node => {
      if (node.id === blockId) {
        const block = node.data.blockData.arguments.find(a => a.name === argumentName);
        block.customValue = newValue;
      }
      return node;
    });

    setNodes(newNodes);
    sessionStorage.setItem('flow', JSON.stringify(newNodes));
  };

  const editorCtx = useContext(EditorContext);

  if (!editorCtx.blockData) return;

  let blockArguments, statistics, slots, signals;

  blockArguments = editorCtx.blockData.blockData.arguments;
  statistics = editorCtx.blockData.blockData.statistics;
  slots = editorCtx.blockData.blockData.slots;
  signals = editorCtx.blockData.blockData.signals;

  const name = editorCtx.blockData.blockData.newNodeName;
  const blockType = editorCtx.blockData.name;
  const blockId = editorCtx.blockData.id;
  const OVERFLOW = 31

  return (
    <aside>
      <rux-container>
        <div slot="header">
          <div className={name ? "" : "errorText"}>{name ? name : "Unnamed"}</div>
          <div className="subheader" data-tooltip-id="block-type" data-tooltip-content={blockType}>
            {blockType}
            {blockType.length > OVERFLOW ?
              <Tooltip id="block-type"
                place="left"
              /> : ""}
          </div>
        </div>

        <rux-accordion-item>
          <div slot="label">General</div>
          {blockArguments.map((argument) => {
            if (argument.controlType === "textBox") {
              return <TextBox argument={argument} blockId={blockId} updateNode={updateNode}></TextBox>;
            }
            if (argument.controlType === "checkBox") {
              return <CheckBox argument={argument} blockId={blockId} updateNode={updateNode}></CheckBox>;
            }
            if (argument.controlType === "comboBox") {
              return (
                <ComboBox argument={argument} blockId={blockId} updateNode={updateNode}></ComboBox>
              );
            }
            return "";
          })}
        </rux-accordion-item>

        <rux-accordion-item>
          <div slot="label">Statistics</div>
          {statistics.length === 0 ?
            'empty stats'
            : statistics.map((stat) => {
              return (
                <>
                  <label htmlFor={stat.name} className="label">
                    {stat.name}
                  </label>
                  <rux-input
                    type="text"
                    id={stat.name}
                    autocomplete=""
                    size="medium"
                    className="textspace"
                    value="value"
                    disabled
                  ></rux-input>
                </>
              );
            })}
        </rux-accordion-item>

        <rux-accordion-item>
          <div slot="label">Slots</div>
          {slots.length === 0 ?
            'empty slots'
            : slots.map((slot) => {
              return (
                <>
                  <label htmlFor={slot.name} className="label">
                    {slot.name}
                  </label>
                  <rux-input
                    type="text"
                    id={slot.name}
                    autocomplete=""
                    size="medium"
                    className="textspace"
                    value="value"
                    disabled
                  ></rux-input>
                </>
              );
            })}
        </rux-accordion-item>

        <rux-accordion-item>
          <div slot="label">Signals</div>
          {signals.length === 0 ?
            'empty signals'
            : signals.map((signal) => {
              return (
                <>
                  <label htmlFor={signal.name} className="label">
                    {signal.name}
                  </label>
                  <rux-input
                    type="text"
                    id={signal.name}
                    autocomplete=""
                    size="medium"
                    className="textspace"
                    value="value"
                    disabled
                  ></rux-input>
                </>
              );
            })}
        </rux-accordion-item>
      </rux-container>
    </aside>
  );
}

export default RightSideBar;
