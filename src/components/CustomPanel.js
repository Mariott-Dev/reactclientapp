import {useContext} from 'react';
import {Panel} from "reactflow";
import "./CustomPanel.css";
import convertToXml from '../xmlConverter';
import EditorContext from "./rightEditor-context";
import {jsonToXml, xmlToJson} from '../xmlConverter';


const CustomPanel = (props) => {
    const editorCtx = useContext(EditorContext);

    const onResetHandler = (e) => {
        e.preventDefault();
        //insert an alert confirming that they want to reset & will lose data
        //clear local storage
        sessionStorage.setItem("flow", []);
        //set state
        props.setEdges([]);
        props.setNodes([]);
        //clear right panel
        editorCtx.setBlockData(null);
    };

    // download file as JSON
    const saveFlowJson = () => {
        // manually download the flow as a JSON file on your computer
        const data = sessionStorage.getItem("flow");//(05/31/2023) changed from local to sessionStorage
        const blob = new Blob([data], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "flow.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // download file as XML
    const saveFlowXml = () => {
        // get the flow from local storage
        const jsonFlowData = sessionStorage.getItem("flow");

        // convert the JSON flow data to XML
        const xmlFlowData = jsonToXml(JSON.parse(jsonFlowData));

        // manually download the flow as an XML file on your computer
        const blob = new Blob([xmlFlowData], {
            type: "application/xml",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "flow.xml";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function uploadFlow(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (!file) return;

        reader.onload = function (event) {
            try {
                if (file.type === "application/json") {
                const data = JSON.parse(event.target.result);
                sessionStorage.setItem("flow", JSON.stringify(data));
                window.location.reload();}

                // convert XML to JSON
                else if (file.type === "application/xml" || file.type === "text/xml") {
                const data = xmlToJson(event.target.result);
                sessionStorage.setItem("flow", data);
                window.location.reload();}

            } catch (error) {
                console.log("Error: ", error);
            }
        };
        reader.readAsText(file);
    }

    const onUploadButtonClick = () => {
        document.getElementById('file-input').click();
    }

    return (
        <Panel position="top-left">
            <div className="firstDiv">
                <div className="example-container">
                    <rux-button-group h-align="right">
                        <rux-button secondary="" className="reset-button" onClick={onResetHandler}>Reset</rux-button>
                        <rux-button onClick={saveFlowJson}>Save JSON</rux-button>
                        <rux-button onClick={saveFlowXml}>Save XML</rux-button>
                        <rux-button id="upload-button" onClick={onUploadButtonClick}>Upload (JSON/XML)</rux-button>
                    </rux-button-group>
                    <input
                        id="file-input"
                        className="input"
                        type="file"
                        accept="application/json, application/xml"
                        onChange={uploadFlow}
                    ></input>
                </div>
            </div>
        </Panel>

    )
};

export default CustomPanel;
