import React, { useEffect, useState } from "react";
import { LocalStore } from "../../utils/storage.utils";
import { TabMenu } from 'primereact/tabmenu';
import './index.scss';
import { useParams } from 'react-router-dom';
import { singularize } from '../../utils/singularize.util';
import { currentLanguageValue, translationService } from '../../services/translation.service';

export default function DataDetails() {
  const [props, setProps] = useState<any>();
  const params = useParams();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  const lawItems = [
    {label: translationService(currentLanguage,'LAW.ADD.FORM.ACTION_PLANS'), icon: 'pi pi-sync'},
    {label: translationService(currentLanguage,'LAW.ADD.FORM.SECTORS_OF_ACTIVITY'), icon: 'pi pi-book'}
  ];

  const controlPlanItems = lawItems.filter(({label}) => [translationService(currentLanguage,'LAW.ADD.FORM.ACTION_PLANS')].includes(label))
  const actionPlanItems = lawItems.filter(({label}) => ['Control plan'].includes(label))
  const primaryItems = [{label: translationService(currentLanguage,'PRIMARY_INFO'), icon: 'pi pi-home'},]
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
      if (typeof value === "object" || ["action_plans"].includes(key)) {
        if (!Array.isArray(value)) {
          detailElements = { ...detailElements, ...value };
        } else {
          detailElements[key] = value;
        }
      } else {
        // Reformat key if necessary
        const optionsTranslation = ['yes', 'no', 'information', 'weak', 'medium', 'major', 'critical', 'true', 'false']
        const textArray = ["products_or_services_concerned", "expertise", "purpose_and_scope_of_text", "requirements"]
        // key = key?.replaceAll("_", " ").toLowerCase();
        if( textArray.includes(key)){
          elements.unshift(
              <div
                  key={key}
                  className={`w-full ${
                      textArray.includes(key)
                          ? "col-span-2"
                          : ""
                  }`}
              >
                <div className='py-2'>
                  <div className='border-b pb-2'>{ params.context ? translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.ADD.FORM.${key.toUpperCase()}`): key}:</div>
                  <div className='py-2 text-gray-400 mt-2' dangerouslySetInnerHTML={{ __html :value as any }}></div>
                </div>
              </div>
          )
        } else {
          elements.push(
              <div
                  key={key}
                  className={`w-full ${
                      textArray.includes(key.toLowerCase())
                          ? "col-span-2"
                          : ""
                  }`}
              >
                <div className='py-2'>
                  <p className='border-b pb-2'>{ params.context ? translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.ADD.FORM.${key.toUpperCase()}`): key}:</p>
                  <p className='py-2 text-gray-400 mt-2'>{
                    optionsTranslation.includes(value?.toString().toLowerCase())? translationService(currentLanguage,`OPTIONS.${value?.toString().toUpperCase()}`) :
                    value?.toString()?.replaceAll('_', ' ') || 'N/A'}</p>
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
        <h1 className='font-semibold text-2xl md:text-4xl'>{ params?.context  ? translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.DETAILS.TITLE`): 'N?A'}</h1>
        <p className="font-light text-gray-300 mt-1">{ params?.context  ? translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.DETAILS.DESCRIPTION`): 'N?A'}</p>

        <div
          className={`justify-center items-center mt-2 gap-1 font-medium py-1 px-2 ${params?.context === 'laws' ? 'flex': 'hidden' } rounded-full border ${!props?.is_analysed ? 'bg-red-100 border-red-500 text-red-500' : 'bg-green-100 text-green-500 border-green-500'}`}>
          <small className="font-light">{translationService(currentLanguage,'LAW.ADD.FORM.IS_ANALYSED')}:</small>
          <i className={`pi pi-${props?.is_analysed?'check':'times'}`}></i>
        </div>

        <div
          className={`justify-center items-center mt-2 gap-1 font-medium py-1 px-2 ${params?.context === 'laws' && props?.is_analysed  ? 'flex': 'hidden' } rounded-full border ${!props?.compliant ? 'bg-red-100 border-red-500 text-red-500' : 'bg-green-100 text-green-500 border-green-500'}`}>
          <small className="font-light">{translationService(currentLanguage,'ANALYSIS_STATUS')}:</small>
          <i className={`pi pi-${props?.compliant?'check':'times'}`}></i>
        </div>

      </div>
      <div className="overflow-hidden mt-2">
        <TabMenu className='tab-menu' model={items} activeIndex={activeTab.index} onTabChange={(e) => {
          setActiveTab({ value: e.value, index: e.index });
        }} />
        <div hidden={activeTab.value?.label !== items[0]?.label} className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {props ? showPropDetail(props).elements.map((prop:any) => prop) : ""}
          </div>
        </div>
        <div hidden={activeTab.value?.label !== translationService(currentLanguage,'LAW.ADD.FORM.ACTION_PLANS')}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.action_plan &&
              showPropDetail(props)?.detailElements?.action_plan?.length > 0 ?
              showPropDetail(props)?.detailElements.action_plan?.map((data: string) =>
                  <div key={data}>{data}</div>
              ) : <div className='col-span-2 flex items-center h-48 w-full justify-center'>{translationService(currentLanguage,`TABLE.NO_RESULT_FOUND`)}</div>
            }
          </div>
        </div>
        <div hidden={activeTab.value?.label !== translationService(currentLanguage,'LAW.ADD.FORM.CONTROL_PLANS')}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            { showPropDetail(props)?.detailElements?.control_plan &&
              showPropDetail(props)?.detailElements?.control_plan?.length ?
                showPropDetail(props)?.detailElements.control_plan?.map((data: any) => <div key={data}>{data}</div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>{translationService(currentLanguage,`TABLE.NO_RESULT_FOUND`)}</div>
            }
          </div>
        </div>
        {/*<div hidden={activeTab.value?.label !== 'Decrees'}>*/}
        {/*  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>*/}
        {/*    { showPropDetail(props)?.detailElements?.decree &&*/}
        {/*      showPropDetail(props)?.detailElements?.decree?.length?*/}
        {/*        showPropDetail(props)?.detailElements.decree?.map((data: any) => <div key={data}>{data}</div> ):*/}
        {/*        <div className='col-span-2 flex items-center h-48 w-full justify-center'>No decree</div>*/}
        {/*    }*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div hidden={activeTab.value?.label !== 'Orders'}>*/}
        {/*  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>*/}
        {/*    { showPropDetail(props)?.detailElements?.order &&*/}
        {/*    showPropDetail(props)?.detailElements?.order?.length ?*/}
        {/*        showPropDetail(props)?.detailElements.order?.map((data: any) => <div key={data}>{data}</div> ):*/}
        {/*        <div className='col-span-2 flex items-center h-48 w-full justify-center'>No order</div>*/}
        {/*    }*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div hidden={activeTab.value?.label !== 'Decisions'}>*/}
        {/*  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>*/}
        {/*    { showPropDetail(props)?.detailElements?.decision &&*/}
        {/*      showPropDetail(props)?.detailElements?.decision?.length ?*/}
        {/*        showPropDetail(props)?.detailElements.decision?.map((data: any) => <div key={data}>{data}</div> ):*/}
        {/*        <div className='col-span-2 flex items-center h-48 w-full justify-center'>No decision</div>*/}
        {/*    }*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div hidden={activeTab.value?.label !== translationService(currentLanguage,'LAW.ADD.FORM.SECTORS_OF_ACTIVITY')}>
          <div className='p-6'>
            { showPropDetail(props)?.detailElements?.sectors_of_activity &&
              showPropDetail(props)?.detailElements?.sectors_of_activity?.length ?
                showPropDetail(props)?.detailElements?.sectors_of_activity?.map((data: any) => <div key={data}>{translationService(currentLanguage,`OPTIONS.SECTORS_OF_ACTIVITIES.${(data as any).toUpperCase()}`)}</div> ):
              <div className='col-span-2 flex items-center h-48 w-full justify-center'>{translationService(currentLanguage,`TABLE.NO_RESULT_FOUND`)}</div>
            }
          </div>
        </div>
      </div>
    </section>
  );
}
