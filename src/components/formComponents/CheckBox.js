import React, { useRef, useEffect } from "react";
import './FormInputs.css';

const CheckBox = ({ argument, blockId, updateNode }) => {
  const checkboxRef = useRef();

  const onChange = (event) => {
    console.log(event);
    const newValue = event.target.checked ? 'true' : 'false';
    updateNode(blockId, argument.name, newValue);
  };

  useEffect(() => {
    checkboxRef.current?.addEventListener('ruxchange', onChange);
    return () => {
      checkboxRef.current?.removeEventListener('ruxchange', onChange);
    };
  }, [blockId, argument.name]);



  const checkboxId = `${blockId}-${argument.name}`;

  return (
    <>
      <label htmlFor={checkboxId} className="checkboxlabel">
        <rux-checkbox
          name="checkbox"
          id={checkboxId}
          className="checkbox"
          checked={argument.customValue === 'true'}
          ref={checkboxRef}>
        </rux-checkbox>
        {argument.name}
      </label>
      <br />
    </>
  );
};

export default CheckBox;
