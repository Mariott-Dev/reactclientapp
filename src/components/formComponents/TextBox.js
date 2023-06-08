import { useEffect, useRef, useState } from "react";

const TextBox = (props) => {
  const { argument, blockId, updateNode } = props;
  const inputRef = useRef();
  const [type, setType] = useState("text");
  const [error, setError] = useState(false);

  const onChange = (event) => {
    if (type === "number" && event.target.value === "") setError(true);
    else setError(false);
    updateNode(blockId, argument.name, event.target.value);
  };

  useEffect(() => {
    setType(argument.dataType.includes("int") || argument.dataType.includes("size") || argument.dataType.includes("float") ? "number" : "text");
    inputRef.current?.addEventListener('ruxinput', onChange);
    return () => {
      inputRef.current?.removeEventListener('ruxinput', onChange);
    };
  }, [blockId, argument.name, type]);

  const inputId = `${blockId}-${argument.name}`;

  return (
    <>
      <label htmlFor={inputId} className="label">{argument.name}</label><br />
      <rux-input
        type={type}
        id={inputId}
        value={argument.customValue ?? argument.default}
        ref={inputRef}
        autoComplete=""
        size="medium"
      ></rux-input>
      <div style={{color: "rgb(236, 103, 103)"}}>
        {error ? "error" : ""}
      </div>
      <br />
    </>
  );
};

export default TextBox;
