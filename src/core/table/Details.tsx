import React, { useEffect, useState } from "react";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Ripple } from "primereact/ripple";
import { LocalStore } from "../../utils/storage.utils";
import { InputText } from "primereact/inputtext";

export default function DataDetails() {
  const [props, setProps] = useState<any>();
  useEffect(() => {
    const data = LocalStore.get("VIEWED_DATA");
    console.log(data)
    setProps(data ?? {});
  }, []);

  const template = (options: PanelHeaderTemplateOptions) => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} justify-content-start`;
    const titleClassName = `${options.titleClassName} ml-2 text-primary`;
    const style = { fontSize: "1.25rem", fontWeight: "500" };

    return (
      <div className={className}>
        <span className={titleClassName} style={style}>
          Resource view
        </span>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    );
  };

  const showPropDetail = (props: object) => {
    let elements = [];
    let detailElements: any = {};
    for (let [key, value] of Object.entries(props)) {
      key = key === "id" ? "Signature" : key;
      if (typeof value === "object") {
        if (!Array.isArray(value)) {
          detailElements = { ...detailElements, ...value };
        } else {
          detailElements[key] = value;
        }
      } else {
        // Reformat key if neccessary
        key = key.includes("_") ? key.replace("_", " ") : key;
        elements.push(
          <div
            key={key}
            className={`capitalize w-full ${
              ["theme", "description"].includes(key.toLowerCase())
                ? "col-span-2"
                : ""
            }`}
          >
            <div className="py-4 px-10 w-full flex justify-evenly flex-col items-start">
              <strong>{key} : </strong>
              {key.startsWith("link") ? (
                <a className="w-2/3 underline text-blue-700 " href={value}>
                  {" "}
                  Click to view file details
                </a>
              ) : (
                <InputText
                  disabled
                  placeholder={value}
                  className="capitalize w-full"
                />
              )}
            </div>
          </div>
        );
      }
    }
    return { elements, detailElements };
  };

  const displayDetails = (props: object) => {
    let elements: any = props;
    return (
      <div>
        {elements ? (
          <div>
            {Object.entries(elements).map(([key, values]) => {
              if (!(values as any[]).length) {
                delete elements[key];
              }
              return (
                <div key={key}>
                  {(values as any[]).length ? (
                    <Panel
                      toggleable
                      className="mt-6"
                      header={key.replaceAll("_", " ")}
                    >
                      {(values as unknown as any[]).map((items, idx) => {
                        return (
                          <div
                            key={idx}
                            className="w-full
                    grid grid-cols-1 md:grid-cols-2"
                          >
                            {Object.entries(items).map(
                              ([itemKey, itemValue]) => {
                                itemKey =
                                  itemKey === "id" ? "Signature" : itemKey;
                                if (typeof itemValue === "object") {
                                  return <></>;
                                }
                                return (
                                  <div key={itemKey}>
                                    <div className="capitalize w-full">
                                      <div className="py-4 px-10 w-full flex justify-evenly flex-col items-start">
                                        <p>{itemKey.replaceAll("_", " ")} : </p>
                                        {itemKey.startsWith("link") ? (
                                          <a
                                            className="w-2/3 underline text-blue-700 "
                                            href={itemValue as string}
                                          >
                                            {" "}
                                            Click to view file details
                                          </a>
                                        ) : (
                                          <InputText
                                            disabled
                                            placeholder={itemValue as string}
                                            className="capitalize w-full"
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        );
                      })}
                    </Panel>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <section>
      <Panel headerTemplate={template} toggleable>
        <div
          className="w-full
                    grid grid-cols-1 md:grid-cols-2"
        >
          {props ? showPropDetail(props).elements.map((prop) => prop) : ""}
        </div>
      </Panel>
      <div>
        {props ? displayDetails(showPropDetail(props).detailElements) : ""}
      </div>
    </section>
  );
}
