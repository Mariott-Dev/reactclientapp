import * as builder from 'xmlbuilder';
// import { parseString } from 'xml2js';
import { XMLParser } from 'fast-xml-parser';

/**
* Convert a JSON object representing a flow to an XML string.
*
* @param {Object} flowJson - The JSON object representing the flow.
* @returns {string} The XML representation of the flow.
*/
export const jsonToXml = (flowJson) => { 
    // error catching
    try {
        // Create the root 'BLUEPRINT' element
        let xml = builder.create('BLUEPRINT', { encoding: 'utf-8' });

        // Create a 'CHAIN' element as a child of 'BLUEPRINT'
        let chain = xml.ele('CHAIN')
            .att('name', 'SatrnSecondary'); // TODO: Update this to allow them to name chains

        // Convert each node in the JSON object to a 'BLOCK' element in the XML
        flowJson.nodes.forEach((node) => {
            let block = chain.ele('BLOCK')
                .att('name', node.data.blockData.newNodeName)
                .att('libname', node.data.name.split('.').slice(1).join('.'));

            // Create 'UIMETADATA' inside of 'BLOCK' containing extra block flow data
            let blockMetadata = block.ele('UIMETADATA');
            blockMetadata.element('ARGUMENT')
                .att('name', 'ID')
                .att('val', node.id);

            blockMetadata.ele('ARGUMENT')
                .att('name', 'PositionX')
                .att('val', node.position.x);

            blockMetadata.ele('ARGUMENT')
                .att('name', 'PositionY')
                .att('val', node.position.y);


            // Convert each argument in the node to an 'ARGUMENT' element in the XML
            node.data.blockData.arguments.forEach((arg) => {
                block.ele('ARGUMENT')
                    .att('name', arg.name)
                    .att('val', arg.default); //TODO: Change this to the actual value of the argument
            });
        });


        // Convert each edge in the JSON object to a 'CONNECT' element in the XML
        flowJson.edges.forEach((edge) => {
            chain.ele('CONNECT')
                .att('outblock', flowJson.nodes.find(node => node.id === edge.source).data.blockData.newNodeName)
                .att('outchannel', 'output')
                .att('inblock', flowJson.nodes.find(node => node.id === edge.target).data.blockData.newNodeName)
                .att('inchannel', 'input');
        });

        // Add 'UIMETADATA' containing chain UI data
        let connectMetadata = chain.ele('UIMETADATA');
        connectMetadata.ele('ARGUMENT')
            .att('name', 'MarkerEndType')
            .att('val', 'Arrow');

        connectMetadata.ele('ARGUMENT')
            .att('name', 'MarkerEndWidth')
            .att('val', '35');

        connectMetadata.ele('ARGUMENT')
            .att('name', 'MarkerEndHeight')
            .att('val', '35');

        connectMetadata.ele('ARGUMENT')
            .att('name', 'ViewportX')
            .att('val', flowJson.viewport.x);

        connectMetadata.ele('ARGUMENT')
            .att('name', 'ViewportY')
            .att('val', flowJson.viewport.y);

        connectMetadata.ele('ARGUMENT')
            .att('name', 'ViewportZoom')
            .att('val', flowJson.viewport.zoom);

        // Convert the XML object to a string with indentation for readability
        return xml.end({ pretty: true });
    }
    catch (error) {
        console.log(error);
        console.log(flowJson)
    }
}

// /**
// * Convert an XML blueprint string into a JSON flow.
// *
// * @param {string} xmlString - The XML string of the blueprint.
// * @returns {Object} The JSON flow representation of the blueprint.
// */
// export const xmlToJson = (xmlString) => {
//     const returnJson = {};
//     const xmlJson = parseString(xmlString);

//     // testing just to see what the json looks like
//     console.log(xmlJson);

//     // TODO: Add Chain name to flow object

//     // Add nodes to flow object
//     returnJson.nodes = xmlJson.BLUEPRINT.CHAIN[0].BLOCK.map((block) => {
//         const node = {};
//         node.id = block.UIMETADATA[0].ARGUMENT.find(arg => arg.$.name === 'ID').$.val;
//         node.position = {
//             x: block.UIMETADATA[0].ARGUMENT.find(arg => arg.$.name === 'PositionX').$.val,
//             y: block.UIMETADATA[0].ARGUMENT.find(arg => arg.$.name === 'PositionY').$.val
//         };
//         node.data = {
//             name: block.$.libname,
//             blockData: {
//                 newNodeName: block.$.name,
//                 arguments: block.ARGUMENT.map((arg) => {
//                     return {
//                         name: arg.$.name,
//                         default: arg.$.val
//                     }
//                 })
//             }
//         };
//         return node;
//     });

//     // Add edges to flow object
//     returnJson.edges = xmlJson.BLUEPRINT.CHAIN[0].CONNECT.map((connect) => {
//         return {
//             source: returnJson.nodes.find(node => node.data.blockData.newNodeName === connect.$.outblock).id,
//             target: returnJson.nodes.find(node => node.data.blockData.newNodeName === connect.$.inblock).id
//         }
//     }
//     );

//     // Add viewport to flow object
//     returnJson.viewport = {
//         x: xmlJson.BLUEPRINT.CHAIN[0].UIMETADATA[0].ARGUMENT.find(arg => arg.$.name === 'ViewportX').$.val,
//         y: xmlJson.BLUEPRINT.CHAIN[0].UIMETADATA[0].ARGUMENT.find(arg => arg.$.name === 'ViewportY').$.val,
//         zoom: xmlJson.BLUEPRINT.CHAIN[0].UIMETADATA[0].ARGUMENT.find(arg => arg.$.name === 'ViewportZoom').$.val
//     };

//     return returnJson;
// }

/**
* Convert an XML blueprint string into a JSON flow.
*
* @param {string} xmlString - The XML string of the blueprint.
* @returns {Object} The JSON flow representation of the blueprint.
*/
export const xmlToJson = (xmlString) => {
    // TODO: Add validation here to make sure the XML is valid

    const options = {
        attributeNamePrefix: "",
        attrNodeName: "attr",
        textNodeName: "#text",
        ignoreAttributes: false,
        ignoreNameSpace: true,
        allowBooleanAttributes: true,
        parseNodeValue: true,
        parseAttributeValue: true,
        trimValues: true,
        cdataTagName: "__cdata",
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: false,
        arrayMode: false,
        stopNodes: ["parse-me-as-string"],
        attributeValueProcessor: (val) => (val === "" ? null : val),
      };
      


    console.log(xmlString);
    const parser = new XMLParser();
    const xmlJson = parser.parse(xmlString, options);
    console.log(xmlJson);
    localStorage.setItem('xmlJson', JSON.stringify(xmlJson));

    // const returnJson = {
    //     nodes: [],
    //     edges: [],
    //     viewport: {}
    // };

    // // Add nodes to flow object
    // xmlJson.BLUEPRINT.CHAIN.BLOCK.forEach((block) => {
    //     const node = {
    //         id: "",
    //         position: {},
    //         data: {
    //             name: "",
    //             blockData: {
    //                 newNodeName: "",
    //                 arguments: []
    //             }
    //         }
    //     };

    //     block.UIMETADATA.ARGUMENT.forEach((arg) => {
    //         switch (arg.name) {
    //             case 'ID':
    //                 node.id = arg.val;
    //                 break;
    //             case 'PositionX':
    //                 node.position.x = arg.val;
    //                 break;
    //             case 'PositionY':
    //                 node.position.y = arg.val;
    //                 break;
    //             default:
    //                 break;
    //         }
    //     });

    //     node.data.name = block.libname;
    //     node.data.blockData.newNodeName = block.name;

    //     block.ARGUMENT.forEach((arg) => {
    //         node.data.blockData.arguments.push({
    //             name: arg.name,
    //             default: arg.val
    //         });
    //     });

    //     returnJson.nodes.push(node);
    // });

    // // Add edges to flow object
    // xmlJson.BLUEPRINT.CHAIN.CONNECT.forEach((connect) => {
    //     returnJson.edges.push({
    //         source: returnJson.nodes.find(node => node.data.blockData.newNodeName === connect.outblock).id,
    //         target: returnJson.nodes.find(node => node.data.blockData.newNodeName === connect.inblock).id
    //     });
    // });

    // // Add viewport to flow object
    // xmlJson.BLUEPRINT.CHAIN.UIMETADATA.ARGUMENT.forEach((arg) => {
    //     switch (arg.name) {
    //         case 'ViewportX':
    //             returnJson.viewport.x = arg.val;
    //             break;
    //         case 'ViewportY':
    //             returnJson.viewport.y = arg.val;
    //             break;
    //         case 'ViewportZoom':
    //             returnJson.viewport.zoom = arg.val;
    //             break;
    //         default:
    //             break;
    //     }
    // });

    // return returnJson;
}