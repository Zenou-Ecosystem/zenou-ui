import React, { useEffect, useState } from "react";
import { LocalStore } from "../../utils/storage.utils";
import { TabMenu } from 'primereact/tabmenu';
import './index.scss';
import { useParams } from 'react-router-dom';

export default function DataDetails() {
  const [props, setProps] = useState<any>();
  const params = useParams()
  const lawItems = [
    {label: 'Action plan', icon: 'pi pi-sync'},
    {label: 'Control plan', icon: 'pi pi-th-large'},
    {label: 'Decrees', icon: 'pi pi-pencil'},
    {label: 'Orders', icon: 'pi pi-briefcase'},
    {label: 'Decisions', icon: 'pi pi-arrow-right-arrow-left'},
    {label: 'Domain of action', icon: 'pi pi-book'}
  ]
  const controlPlanItems = lawItems.filter(({label}) => ['Action plan'].includes(label))
  const actionPlanItems = lawItems.filter(({label}) => ['Control plan'].includes(label))
  const primaryItems = [{label: 'Primary info', icon: 'pi pi-home'},]
  const [items, setItems] = useState(primaryItems)
  useEffect(() => {
    const data = LocalStore.get("VIEWED_DATA");
    setProps(data ?? {});
    switch (true) {
      case params?.context && params?.context === 'laws':
        setItems([ ...primaryItems, ...lawItems])
        break;
      case params?.context && params?.context === 'actions':
        setItems([ ...primaryItems, ...actionPlanItems])
        break;
      case params?.context && params?.context === 'controls':
        setItems([ ...primaryItems, ...controlPlanItems])
        break;
    }
  }, []);

  const showPropDetail = (props: object) => {
    let elements: any = [];
    let detailElements: any = {};
    if(!props) {
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
        // Reformat key if necessary
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
                  <p className='py-2 text-gray-400 mt-2'>{value?.toString()?.replaceAll('_', ' ') || 'N/A'}</p>
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

  const [activeTab, setActiveTab] = useState<any>({value: primaryItems[0], index: 0});


  return (
    <section>
      <div className="header-frame h-48 items-center justify-center flex-col flex w-full">
        <h1 className='font-semibold text-2xl md:text-4xl'>{params?.context ? params?.context.slice(0, params.context.length - 1) : 'N/A'} details</h1>
        <p className="font-light text-gray-300 mt-1">Here are the details of the selected {params?.context ? params?.context.slice(0, params.context.length - 1) : 'N/A'}.</p>
      </div>
      <div className="overflow-hidden mt-2">
        <TabMenu className='tab-menu' model={items} activeIndex={activeTab.index} onTabChange={(e) => {
          console.log(e);
          setActiveTab({ value: e.value, index: e.index });
        }} />
        <div hidden={activeTab.value?.label !== 'Primary info'} className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {props ? showPropDetail(props).elements.map((prop:any) => prop) : ""}
          </div>
        </div>
        <div hidden={activeTab.value?.label !== 'Action plan'}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.action_plan &&
              showPropDetail(props)?.detailElements?.action_plan?.length > 0 ?
              showPropDetail(props)?.detailElements.action_plan?.map((data: string) =>
                  <div key={data}>{data}</div>
              ) : <div className='col-span-2 flex items-center h-48 w-full justify-center'>No action plan</div>
            }
          </div>
        </div>
        <div hidden={activeTab.value?.label !== 'Control plan'}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.control_plan &&
              showPropDetail(props)?.detailElements?.control_plan?.length ?
                showPropDetail(props)?.detailElements.control_plan?.map((data: any) => <div key={data}>{data}</div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>No control plan</div>
            }
          </div>
        </div>
        <div hidden={activeTab.value?.label !== 'Decrees'}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.decree &&
              showPropDetail(props)?.detailElements?.decree?.length?
                showPropDetail(props)?.detailElements.decree?.map((data: any) => <div key={data}>{data}</div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>No decree</div>
            }
          </div>
        </div>
        <div hidden={activeTab.value?.label !== 'Orders'}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.order &&
            showPropDetail(props)?.detailElements?.order?.length ?
                showPropDetail(props)?.detailElements.order?.map((data: any) => <div key={data}>{data}</div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>No order</div>
            }
          </div>
        </div>
        <div hidden={activeTab.value?.label !== 'Decisions'}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.decision &&
              showPropDetail(props)?.detailElements?.decision?.length ?
                showPropDetail(props)?.detailElements.decision?.map((data: any) => <div key={data}>{data}</div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>No decision</div>
            }
          </div>
        </div>
        <div hidden={activeTab.value?.label !== 'Domain of action'}>
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
