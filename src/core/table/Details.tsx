import React, { useEffect, useState } from "react";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { Ripple } from "primereact/ripple";
import { LocalStore } from "../../utils/storage.utils";
import { InputText } from "primereact/inputtext";
import { TabMenu } from 'primereact/tabmenu';
import './index.scss';

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
    let elements: any = [];
    let detailElements: any = {};
    if(!props) {
      console.log(props, 'no props')
     return { elements, detailElements };
    }
    for (let [key, value] of Object.entries(props)) {
      key = key === "id" ? "Signature" : key;
      if (typeof value === "object" || ["action_plan", "control_plan"].includes(key)) {
        if (!Array.isArray(value)) {
          detailElements = { ...detailElements, ...value };
        } else {
          detailElements[key] = value;
        }
      } else {
        // Reformat key if neccessary
        key = key?.replaceAll("_", " ").toLowerCase();
        if( ["text of law", "article"].includes(key)){
          elements.unshift(
              <div
                  key={key}
                  className={`w-full ${
                      ["text of law", "article"].includes(key)
                          ? "col-span-2"
                          : ""
                  }`}
              >
                <div className='py-2'>
                  <p className='border-b pb-2'>{key}:</p>
                  <p className='py-2 text-gray-400 mt-2'>{value?.replaceAll('_', ' ')}</p>
                </div>
              </div>
          )
        } else {
          elements.push(
              <div
                  key={key}
                  className={`w-full ${
                      ["text of law", "article"].includes(key.toLowerCase())
                          ? "col-span-2"
                          : ""
                  }`}
              >
                <div className='py-2'>
                  <p className='border-b pb-2'>{key?.replaceAll('_', ' ')}:</p>
                  <p className='py-2 text-gray-400 mt-2'>{value?.replaceAll('_', ' ')}</p>
                  {key.startsWith("link") ? (
                      <a className="w-2/3 underline text-blue-700 " href={value}>
                        {" "}
                        Click to view file details
                      </a>): ''
                  }
                </div>
              </div>
          );

        }
      }
    }
    return { elements, detailElements };
  };

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const items = [
    {label: 'Basic info', icon: 'pi pi-home'},
    {label: 'Action plan', icon: 'pi pi-sync'},
    {label: 'Control plan', icon: 'pi pi-th-large'},
    {label: 'Decrees', icon: 'pi pi-pencil'},
    {label: 'Orders', icon: 'pi pi-briefcase'},
    {label: 'Decisions', icon: 'pi pi-arrow-right-arrow-left'},
    {label: 'Domain of action', icon: 'pi pi-book'}
  ];

  return (
    <section>
      <div className="header-frame h-48 items-center justify-center flex-col flex w-full">
        <h1 className='font-semibold text-2xl md:text-4xl'>Law details</h1>
        <p className="font-light text-gray-300 mt-1">Here are the details of this law.</p>
      </div>
      <div className="overflow-hidden mt-2">
        <TabMenu className='tab-menu' model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
        <div hidden={activeIndex !== 0} className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {props ? showPropDetail(props).elements.map((prop:any) => prop) : ""}
          </div>
        </div>
        <div hidden={activeIndex !== 1}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.action_plan &&
              showPropDetail(props)?.detailElements?.action_plan?.length > 0 ?
              showPropDetail(props)?.detailElements.action_plan?.map((data: string) =>
                  <div key={data}>{data}</div>
              ) : <div className='col-span-2 flex items-center h-48 w-full justify-center'>No action plan</div>
            }
          </div>
        </div>
        <div hidden={activeIndex !== 2}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.control_plan &&
              showPropDetail(props)?.detailElements?.control_plan?.length ?
                showPropDetail(props)?.detailElements.control_plan?.map((data: any) => <div key={data}>{data}</div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>No control plan</div>
            }
          </div>
        </div>
        <div hidden={activeIndex !== 3}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.decree &&
              showPropDetail(props)?.detailElements?.decree?.length?
                showPropDetail(props)?.detailElements.decree?.map((data: any) => <div key={data}>{data}</div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>No decree</div>
            }
          </div>
        </div>
        <div hidden={activeIndex !== 4}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.order &&
            showPropDetail(props)?.detailElements?.order?.length ?
                showPropDetail(props)?.detailElements.order?.map((data: any) => <div key={data}>{data}</div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>No order</div>
            }
          </div>
        </div>
        <div hidden={activeIndex !== 5}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.decision &&
              showPropDetail(props)?.detailElements?.decision?.length ?
                showPropDetail(props)?.detailElements.decision?.map((data: any) => <div key={data}>{data}</div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>No decision</div>
            }
          </div>
        </div>
        <div hidden={activeIndex !== 6}>
          <div className='p-6'>
            { showPropDetail(props)?.detailElements?.domains &&
              showPropDetail(props)?.detailElements?.domains?.length ?
                showPropDetail(props)?.detailElements?.domains?.map((data: any) => <div key={data}>{data}</div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>No domains</div>
            }
          </div>
        </div>
      </div>
    </section>
  );
}
