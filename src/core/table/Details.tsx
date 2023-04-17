
import React, { useEffect, useState } from 'react';
import { Panel, PanelHeaderTemplateOptions } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import { LocalStore } from '../../utils/storage.utils';
import { InputText } from "primereact/inputtext";


export default function DataDetails() {

    const [props, setProps] = useState<any>();
    useEffect(() => {
        const data = LocalStore.get('VIEWED_DATA');
        setProps(data ?? {});
    }, [])

    const template = (options: PanelHeaderTemplateOptions) => {

        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
        const className = `${options.className} justify-content-start`;
        const titleClassName = `${options.titleClassName} ml-2 text-primary`;
        const style = { fontSize: '1.25rem' };

        return (
            <div className={className}>
                <button className={options.togglerClassName} onClick={options.onTogglerClick}>
                    <span className={toggleIcon}></span>
                    <Ripple />
                </button>
                <span className={titleClassName} style={style}>Resource View</span>
            </div>
        );
    };

    const showPropDetail = (props: object) => {
        let elements = [];
        for (let [key, value] of Object.entries(props)) {
            key = key == 'id' ? 'Signature' : key;
            if (typeof value == "object") {
                showPropDetail(value);
            } else {
                // Reformat key if neccessary
                key = key.includes('_') ? key.replace('_', ' ') : key;
                elements.push(
                    <div key={key} className="capitalize w-full mx-4 
                    flex flex-col flex-wrap justify-center items-center">
                        <p className="py-4 px-10 flex justify-evenly items-center w-full">
                            <strong className="w-1/4">{key} : </strong>
                            {
                                key.startsWith('link')
                                    ? <a className="w-2/3 underline text-blue-700 " href={value}> Click to view file details</a>
                                    : <InputText readOnly placeholder={value} className="w-2/3" />
                            }
                        </p>
                    </div>
                )
            }
        }
        return elements;
    }

    return (
        <section>
            <Panel headerTemplate={template} toggleable>
                {
                    props ? showPropDetail(props).map(prop => prop) : ''
                }
            </Panel>

        </section>
    )
}
