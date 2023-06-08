import React, { useRef, useEffect } from "react";
import './FormInputs.css';

const ComboBox = ({ argument, blockId, updateNode }) => {
  const selectRef = useRef();

  const onChange = (event) => {
    console.log(event);
    updateNode(blockId, argument.name, event.target.value);
  };

  useEffect(() => {
    selectRef.current?.addEventListener('ruxchange', onChange);
    return () => {
      selectRef.current?.removeEventListener('ruxchange', onChange);
    };
  }, [blockId, argument.name]);


  const selectId = `${blockId}-${argument.name}`;

  return (
    <div>
      <label htmlFor={selectId} className="label">{argument.name}</label>
      <rux-select
        input-id={selectId}
        name={argument.name}
        size="medium"
        value={argument.customValue ?? argument.default}
        ref={selectRef}>
        <rux-option value="" label="Select an option"></rux-option>
        {argument.options.map((option, index) => (
          <rux-option key={index} value={option} label={option}></rux-option>
        ))}
      </rux-select>
      <br />
    </div>
  );
};

export default ComboBox;
