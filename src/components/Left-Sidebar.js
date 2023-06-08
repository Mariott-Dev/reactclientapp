import React, { useState, useEffect } from "react";
import axios from "axios";
import "./formComponents/FormInputs.css";

export default function LeftSidebar() {
  const [blockData, setBlockData] = useState(null);
  const [availableCategories, setAvailableCategories] = useState(null);

  // function to return unique categories, takes in array of filteredData
  const getUniqueCategories = (data) => {
    let categoriesArray = data.map((block) => {
      return (block.nameCat)
    });
    let uniqueCategories = [];
    let count = 0;
    let start = false;
    for (let j = 0; j < categoriesArray.length; j++) {
      for (let k = 0; k < uniqueCategories.length; k++) {
        if (categoriesArray[j] === uniqueCategories[k]) {
          start = true;
        }
      }
      count++;
      if (count === 1 && start === false) {
        uniqueCategories.push(categoriesArray[j]);
      }
      start = false;
      count = 0;
    }
    return uniqueCategories;
  };

  useEffect(() => {
    axios
      .get(`https://localhost:7030/Block`)
      .then((result) => {
        let data = result.data.parameters.blockDocs;
        data.forEach((block) => {
          let numb = 10;
          block.channels.forEach((channel, i) => {
            let position = numb;
            channel.handleStyle = { left: position };
            channel.id = i + 1; //add channel id
            numb = numb + 15;
          });
        });
        const filteredData = data.map((block) => {
          return {
            blockDocId: block.blockLibraryName,
            arguments: block.arguments,
            name: block.blockLibraryName,
            nameCat: block.blockLibraryName.split('.')[1],
            statistics: block.statistics,
            slots: block.slots,
            signals: block.signals,
            channels: block.channels,
            description: block.description,
          };
        });
        setAvailableCategories(getUniqueCategories(filteredData));
        setBlockData(filteredData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!blockData) return;

  const onDragStart = (event, nodeType, block) => {
    const data = { type: nodeType, block: block, id: block.id };
    event.dataTransfer.setData("application/reactflow", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <rux-container>
        {/* <p>Block Builder Instance Name</p> */}
        <div slot="header">
          <div>Blocks</div>
          <div className="subheader">BlockBuilder Instance Name</div>
        </div>
        <rux-accordion>
          {availableCategories.map((cat) => {
            return (
              <rux-accordion-item key={cat}><div slot="label">{cat}</div>
                {blockData.map((block) => {
                  if (block.nameCat === cat) {
                    return (
                      <div className="dndnode"
                        key={block.id}
                        onDragStart={(event) =>
                          onDragStart(event, "SelectableNode", block)
                        }
                        draggable
                      >
                        <div data={block} isConnectable={true}>
                          {block.name.split(".").pop()}
                        </div>
                      </div>
                    )
                  }
                  return "";
                })}
              </rux-accordion-item>
            )
          })}
        </rux-accordion>
      </rux-container>
    </aside>
  );
};
