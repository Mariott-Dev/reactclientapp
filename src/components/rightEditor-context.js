import { useState, createContext } from 'react';

const EditorContext = createContext({
  blockData: null,
  setBlockData: () => {},
  updateBlockData: () => {},
});

export const EditorContextProvider = (props) => {
    const [blockData, setBlockData] = useState(null);

    const updateBlockData = (nodeData) => {
        setBlockData(nodeData);
    };

    const editorContextValue = {
        blockData,
        setBlockData, updateBlockData,
    }

    return (
        <EditorContext.Provider value={editorContextValue}>
            {props.children}
        </EditorContext.Provider>
    )
};

export default EditorContext;
