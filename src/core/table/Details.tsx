import React, { useEffect, useRef, useState } from 'react';
import { LocalStore } from "../../utils/storage.utils";
import { TabMenu } from 'primereact/tabmenu';
import './index.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { singularize } from '../../utils/singularize.util';
import { currentLanguageValue, translationService } from '../../services/translation.service';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { fetchLaws } from '../../services/laws.service';
import { Toast } from 'primereact/toast';


export default function DataDetails() {
  const [props, setProps] = useState<any>();
  const params = useParams();
  const circumference = 30 * 2 * Math.PI;
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const lawItems = [
    {label: translationService(currentLanguage,'LAW.ADD.FORM.ANALYSE_TEXT'), icon: 'pi pi-sync'},
    {label: translationService(currentLanguage,'LAW.KPI'), icon: 'pi pi-chart-bar'},
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

  const calculateKPI = () => {

    const textAnalysisTotal = props?.text_analysis?.length;

    const filterCriteria = (condition: any) => {
      return  props
        ?.text_analysis.filter(condition)
    }

    const requirementsByApplicability = {
      total: filterCriteria((obj:any) => obj.applicability === 'yes')?.length,
    }

    const conformity = {
      total: filterCriteria((obj:any) => obj.complaint === true)?.length / requirementsByApplicability.total
    }

    const requirementsByImpact = {
      weak: filterCriteria((obj:any) => obj.impact === 'weak')?.length,
      medium: filterCriteria((obj:any) => obj.impact === 'medium')?.length,
      major: filterCriteria((obj:any) => obj.impact === 'major')?.length,
      critical: filterCriteria((obj:any) => obj.impact === 'critical')?.length
    }

    const requirementsByNatureOfImpact = {
      financial: filterCriteria((obj:any) => obj.nature_of_impact === 'financial')?.length,
      image: filterCriteria((obj:any) => obj.nature_of_impact === 'image')?.length,
      organisation: filterCriteria((obj:any) => obj.nature_of_impact === 'organisation')?.length,
      products: filterCriteria((obj:any) => obj.nature_of_impact === 'products')?.length
    }

    return {requirementsByApplicability, textAnalysisTotal, conformity, requirementsByNatureOfImpact, requirementsByImpact}
  }

  const showPropDetail = (props: object) => {
    let elements: any = [];
    let detailElements: any = {};

    if(!props) {
     return { elements, detailElements };
    }
    for (let [key, value] of Object.entries(props)) {
      key = key === "id" ? "Signature" : key;
      // @ts-ignore
      key === 'password' && delete props[key];
      if (typeof value === "object" || ["action_plans"].includes(key)) {
        if (!Array.isArray(value)) {
          detailElements = { ...detailElements, ...value };
        } else {
          detailElements[key] = value;
        }
      } else {
        // Reformat key if necessary
        const optionsTranslation = ['yes', 'no', 'information', 'weak', 'medium', 'major', 'critical', 'true', 'false', 'convention']
        const textArray = ["products_or_services_concerned", "expertise", "purpose_and_scope_of_text", "requirements"]

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
                  <p className='border-b pb-2'>{ params.context && translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.ADD.FORM.${key.toUpperCase()}`) !== 'no such key' ? translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.ADD.FORM.${key.toUpperCase()}`): key}:</p>
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
    // console.log(detailElements);
    return { elements, detailElements };
  };

  const [activeTab, setActiveTab] = useState<any>({value: primaryItems[0], index: 0});


  const applicableBodyTemplate = (key:string) => (rowData:any) => {
    return <Tag value={translationService(currentLanguage,`OPTIONS.${rowData[key].toString().toUpperCase()}`)} severity={['yes', 'true'].includes(rowData[key].toString()) ? 'success' : ['no', 'critical', 'weak', 'false'].includes(rowData[key].toString()) ? 'danger': ['medium'].includes(rowData[key].toString())? 'warning': 'info'} />;
  };

  const expertiseTemplate = (rowData: any) => {
    return <div className='truncate w-72' dangerouslySetInnerHTML={{ __html: rowData.expertise }}></div>
  }

  const actionPlanTemplate = (rowData: any) => {
    return !rowData.action_plans ? <i className='pi pi-times-circle text-red-500'></i> : <div>{rowData.action_plans}</div>
  }

  const proofBodyTemplate = (rowData: any) => {
    return <ol className='list-disc'>
      {
        rowData?.proof_of_conformity ? rowData.proof_of_conformity.map((data: any, idx:number) => {
          return <li key={idx} className='truncate w-32'>
            <a href={data?.img_url} className='underline text-blue-500'>{data?.name}</a>
          </li>
        } ): <i className='pi pi-times-circle text-red-500'></i>
      }
    </ol>
  }
  const servicesBodyTemplate = (rowData:any) => {
    return <ul>
      {
        rowData.process_management.map((item: string) => {
          return <li key={item}>{translationService(currentLanguage, `OPTIONS.SECTORS_OF_ACTIVITIES.${item.toUpperCase()}`)}</li>
        } )
      }
    </ul>
  }
  return (
    <section>
      <Toast ref={toast as any} />
      <div className="header-frame h-48 items-center justify-center flex-col flex w-full">
        <h1 className='font-semibold text-2xl md:text-4xl'>{ params?.context && translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.DETAILS.DESCRIPTION`) !== 'no such key'  ? translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.DETAILS.TITLE`): 'Section des détails'}</h1>
        <p className="font-light text-gray-300 mt-1">{ params?.context && translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.DETAILS.DESCRIPTION`) !== 'no such key'  ? translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.DETAILS.DESCRIPTION`): 'Quelques descriptifs de détails'}</p>

        <div
          className={`justify-center items-center mt-2 gap-1 font-medium py-1 px-2 ${params?.context === 'laws' ? 'flex': 'hidden' } rounded-full border ${!props?.is_analysed ? 'bg-red-100 border-red-500 text-red-500' : 'bg-green-100 text-green-500 border-green-500'}`}>
          <small className="font-light">{translationService(currentLanguage,'LAW.ADD.FORM.IS_ANALYSED')}:</small>
          <i className={`pi pi-${props?.is_analysed?'check':'times'}`}></i>
        </div>

      </div>
      <div className="overflow-hidden mt-2">
        <TabMenu className='tab-menu' model={items} activeIndex={activeTab.index} onTabChange={(e) => {
          setActiveTab({ value: e.value, index: e.index });
        }} />
        <div hidden={activeTab.value?.label !== items[0]?.label} className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {props ? showPropDetail(props).elements.map((prop:any) => prop) : ""}
            {showPropDetail(props)?.detailElements?.products_or_services_concerned?.length ?
              (
                <div>
                  <p className='border-b pb-2'>
                    { translationService(currentLanguage,`LAW.ADD.FORM.PRODUCTS_OR_SERVICES_CONCERNED`) }:
                  </p>
                  <ul className="list-disc py-2 ml-6 grid grid-cols-2 mt-2">
                    {showPropDetail(props)?.detailElements?.products_or_services_concerned?.map((item:string, index:any) =>
                    <li className="capitalize text-gray-400 " key={index}>
                      {item}
                    </li>)}
                  </ul>
                </div>
              ): ""}
            {showPropDetail(props)?.detailElements?.id ?
              (
                <div className='flex gap-2 items-center'>
                  <i className='pi pi-external-link text-orange-500'></i>
                  <button className='text-blue-500 underline' onClick={(e) => {
                    e.preventDefault();
                   fetchLaws().then(result => {
                     const currentLaw = result.find((x:any) => x.id === showPropDetail(props)?.detailElements?.id);
                     if(currentLaw) {
                      LocalStore.set('VIEW_DATA', currentLaw);
                      setProps(currentLaw);
                      navigate(`/dashboard/laws/${showPropDetail(props)?.detailElements?.id}`);
                      return;
                     }
                      toast?.current?.show({ severity: 'error', summary: 'Error', detail: translationService(currentLanguage,'TOAST.ERROR_ACTION') });
                   }).catch(() => {
                     toast?.current?.show({ severity: 'error', summary: 'Error', detail: translationService(currentLanguage,'TOAST.ERROR_ACTION') });
                   })
                  }}>
                    {translationService(currentLanguage, 'LAW.ADD.FORM.PARENT_OF_TEXT')}
                  </button>
                </div>
              )
              : ''}

          </div>
        </div>
        <div hidden={activeTab.value?.label !== translationService(currentLanguage,'LAW.ADD.FORM.ANALYSE_TEXT')}>
          <br/>
          <DataTable size="small" tableStyle={{ width: '100%' }} value={showPropDetail(props)?.detailElements?.text_analysis} showGridlines>
            {
              ["requirements", "applicability", "process_management", "impact", "nature_of_impact", "expertise",
              "action_plans", "proof_of_conformity", "compliant", "conformity_cost", "conformity_deadline"].map((item:any, index:number) =>
                <Column style={{ width: '20px' }} key={index} field={item}
                        body={
                          ['applicability', 'impact', 'nature_of_impact', 'compliant'].includes(item)
                            ? applicableBodyTemplate(item): ['expertise'].includes(item)
                              ? expertiseTemplate :
                              ['action_plans', 'conformity_cost', 'conformity_deadline'].includes(item)
                                ? actionPlanTemplate :
                                ['process_management'].includes(item) ? servicesBodyTemplate : ['proof_of_conformity'].includes(item)? proofBodyTemplate :'' }
                        header={translationService(currentLanguage,`LAW.ADD.FORM.${item.toString().toUpperCase()}`)}/>)
            }
          </DataTable>
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

        {/*sector of activity*/}
        <div hidden={activeTab.value?.label !== translationService(currentLanguage,'LAW.ADD.FORM.SECTORS_OF_ACTIVITY')}>
          <div className='p-6'>
            { showPropDetail(props)?.detailElements?.sectors_of_activity &&
              showPropDetail(props)?.detailElements?.sectors_of_activity?.length ?
                showPropDetail(props)?.detailElements?.sectors_of_activity?.map((data: any) => <div key={data}>{translationService(currentLanguage,`OPTIONS.SECTORS_OF_ACTIVITIES.${(data as any).toUpperCase()}`)}</div> ):
              <div className='col-span-2 flex items-center h-48 w-full justify-center'>{translationService(currentLanguage,`TABLE.NO_RESULT_FOUND`)}</div>
            }
          </div>
        </div>
        <div hidden={activeTab.value?.label !== translationService(currentLanguage,'LAW.KPI')}>
          <div className='p-6'>
                {/*requirements by impact*/}
                <div className='py-8'>
                  <h1 className='text-3xl font-medium'>Exigences par impact</h1>
                  <p className='text-gray-400 font-normal'>Statistiques des exigence par impact du texte</p>
                </div>
                <div className="container px-4 mx-auto">
                  <div className="flex py-8 flex-wrap items-center">
                    <div className="w-full border-r md:w-1/2 lg:w-1/4 px-4 text-center">
                      <div className="relative w-20 mx-auto mb-8">
                        <div className="absolute inset-0 ml-2 flex items-center justify-center">
                          {/*<p className="text-lg font-semibold">*/}
                          {/*  {calculateKPI().requirementsByImpact?.weak}*/}
                          {/*  /!*<span className="ml-px align-top text-xs text-gray-500">%</span>*!/*/}
                          {/*</p>*/}
                          <span className="text-xl">{calculateKPI().requirementsByImpact?.weak}<sub>/{calculateKPI().textAnalysisTotal}</sub></span>
                        </div>
                        <span className="relative block">
                          <svg width="69" height="91" viewBox="0 0 69 91" fill="none" xmlns="http://www.w3.org/2000/svg"
                               data-config-id="auto-svg-1-2">
                            <path
                              d="M67.9865 79.0753C69.3577 81.148 68.7977 83.9622 66.5984 85.1196C61.1443 87.99 55.1436 89.717 48.9653 90.1747C41.2869 90.7435 33.5909 89.3326 26.6136 86.077C19.6362 82.8215 13.6109 77.8301 9.11396 71.5803C4.61701 65.3306 1.79884 58.0315 0.92903 50.3813C0.0592193 42.7311 1.16686 34.9857 4.146 27.8859C7.12514 20.7861 11.8761 14.5695 17.9445 9.83067C24.0129 5.09182 31.1957 1.98927 38.8058 0.819781C44.9292 -0.12122 51.1644 0.214628 57.1237 1.78733C59.5267 2.42151 60.7042 5.03807 59.8333 7.36576C58.9623 9.69345 56.3723 10.8445 53.9542 10.2706C49.4528 9.20231 44.7734 9.00838 40.1729 9.71535C34.0848 10.6509 28.3385 13.133 23.4838 16.9241C18.6291 20.7151 14.8283 25.6884 12.445 31.3683C10.0617 37.0481 9.17557 43.2444 9.87142 49.3646C10.5673 55.4847 12.8218 61.324 16.4194 66.3238C20.0169 71.3236 24.8372 75.3167 30.419 77.9212C36.0009 80.5256 42.1577 81.6543 48.3004 81.1993C52.9422 80.8554 57.4587 79.616 61.6053 77.5644C63.8329 76.4623 66.6152 77.0025 67.9865 79.0753Z"
                              fill="#F1F5FB"></path>
                          </svg>
                        </span>
                        <span className="absolute inset-0 ml-3 mt-px block mx-auto">
                          <svg width="78" height="88" viewBox="0 0 78 88" fill="none" xmlns="http://www.w3.org/2000/svg"
                               data-config-id="auto-svg-2-2">
                            <path
                              d="M34 4.49613C34 2.01299 36.0182 -0.0237881 38.4884 0.229514C44.4509 0.840933 50.2422 2.66606 55.4993 5.61018C62.0678 9.2887 67.5826 14.5911 71.5162 21.0101C75.4497 27.4291 77.6705 34.75 77.9661 42.2726C78.2616 49.7951 76.6221 57.2677 73.2043 63.9756C69.7865 70.6834 64.7047 76.4021 58.4451 80.5847C52.1855 84.7672 44.9574 87.2737 37.4522 87.8644C29.947 88.455 22.4158 87.1101 15.579 83.9583C10.1071 81.4357 5.22649 77.8232 1.22716 73.3589C-0.429708 71.5093 0.0317984 68.6794 2.0407 67.2198C4.04961 65.7602 6.8421 66.2296 8.54694 68.0351C11.6079 71.2766 15.2698 73.914 19.3437 75.792C24.7833 78.2997 30.7753 79.3698 36.7467 78.8998C42.718 78.4299 48.4689 76.4356 53.4493 73.1079C58.4296 69.7801 62.4728 65.2301 65.1921 59.8932C67.9114 54.5562 69.2159 48.6108 68.9807 42.6256C68.7456 36.6404 66.9787 30.8157 63.849 25.7085C60.7193 20.6014 56.3316 16.3826 51.1055 13.4559C47.1916 11.264 42.9055 9.85163 38.4838 9.28059C36.0211 8.96254 34 6.97928 34 4.49613Z"
                              fill="#E4572E"></path>
                          </svg>
                        </span>
                      </div>
                      <h3 className="mb-4 text-2xl font-meduim font-heading">Faible</h3>
                      <p className="text-gray-400 text-md">Total des exigence par impact</p>
                    </div>
                    <div className="w-full border-r md:w-1/2 lg:w-1/4 px-4 text-center">
                      <div className="relative w-20 mx-auto mb-8">
                        <div className="absolute inset-0 ml-2 flex items-center justify-center">
                          {/*<p className="text-lg font-semibold">*/}
                          {/*  {calculateKPI().requirementsByImpact?.medium}*/}
                          {/*  /!*<span className="ml-px align-top text-xs text-gray-500">%</span>*!/*/}
                          {/*</p>*/}
                          <span className="text-xl">{calculateKPI().requirementsByImpact?.medium}<sub>/{calculateKPI().textAnalysisTotal}</sub></span>
                        </div>
                        <span className="relative block">
                          <svg width="69" height="91" viewBox="0 0 69 91" fill="none" xmlns="http://www.w3.org/2000/svg"
                               data-config-id="auto-svg-1-2">
                            <path
                              d="M67.9865 79.0753C69.3577 81.148 68.7977 83.9622 66.5984 85.1196C61.1443 87.99 55.1436 89.717 48.9653 90.1747C41.2869 90.7435 33.5909 89.3326 26.6136 86.077C19.6362 82.8215 13.6109 77.8301 9.11396 71.5803C4.61701 65.3306 1.79884 58.0315 0.92903 50.3813C0.0592193 42.7311 1.16686 34.9857 4.146 27.8859C7.12514 20.7861 11.8761 14.5695 17.9445 9.83067C24.0129 5.09182 31.1957 1.98927 38.8058 0.819781C44.9292 -0.12122 51.1644 0.214628 57.1237 1.78733C59.5267 2.42151 60.7042 5.03807 59.8333 7.36576C58.9623 9.69345 56.3723 10.8445 53.9542 10.2706C49.4528 9.20231 44.7734 9.00838 40.1729 9.71535C34.0848 10.6509 28.3385 13.133 23.4838 16.9241C18.6291 20.7151 14.8283 25.6884 12.445 31.3683C10.0617 37.0481 9.17557 43.2444 9.87142 49.3646C10.5673 55.4847 12.8218 61.324 16.4194 66.3238C20.0169 71.3236 24.8372 75.3167 30.419 77.9212C36.0009 80.5256 42.1577 81.6543 48.3004 81.1993C52.9422 80.8554 57.4587 79.616 61.6053 77.5644C63.8329 76.4623 66.6152 77.0025 67.9865 79.0753Z"
                              fill="#F1F5FB"></path>
                          </svg>
                        </span>
                        <span className="absolute inset-0 ml-3 mt-px block mx-auto">
                          <svg width="78" height="88" viewBox="0 0 78 88" fill="none" xmlns="http://www.w3.org/2000/svg"
                               data-config-id="auto-svg-2-2">
                            <path
                              d="M34 4.49613C34 2.01299 36.0182 -0.0237881 38.4884 0.229514C44.4509 0.840933 50.2422 2.66606 55.4993 5.61018C62.0678 9.2887 67.5826 14.5911 71.5162 21.0101C75.4497 27.4291 77.6705 34.75 77.9661 42.2726C78.2616 49.7951 76.6221 57.2677 73.2043 63.9756C69.7865 70.6834 64.7047 76.4021 58.4451 80.5847C52.1855 84.7672 44.9574 87.2737 37.4522 87.8644C29.947 88.455 22.4158 87.1101 15.579 83.9583C10.1071 81.4357 5.22649 77.8232 1.22716 73.3589C-0.429708 71.5093 0.0317984 68.6794 2.0407 67.2198C4.04961 65.7602 6.8421 66.2296 8.54694 68.0351C11.6079 71.2766 15.2698 73.914 19.3437 75.792C24.7833 78.2997 30.7753 79.3698 36.7467 78.8998C42.718 78.4299 48.4689 76.4356 53.4493 73.1079C58.4296 69.7801 62.4728 65.2301 65.1921 59.8932C67.9114 54.5562 69.2159 48.6108 68.9807 42.6256C68.7456 36.6404 66.9787 30.8157 63.849 25.7085C60.7193 20.6014 56.3316 16.3826 51.1055 13.4559C47.1916 11.264 42.9055 9.85163 38.4838 9.28059C36.0211 8.96254 34 6.97928 34 4.49613Z"
                              fill="orange"></path>
                          </svg>
                        </span>
                      </div>
                      <h3 className="mb-4 text-2xl font-meduim font-heading">Moyen</h3>
                      <p className="text-gray-400 text-md">Total des exigence par impact</p>
                    </div>
                    <div className="w-full border-r md:w-1/2 lg:w-1/4 px-4 text-center">
                      <div className="relative w-20 mx-auto mb-8">
                        <div className="absolute inset-0 ml-2 flex items-center justify-center">
                          {/*<p className="text-lg font-semibold">*/}
                          {/*  {calculateKPI().requirementsByImpact?.major}*/}
                          {/*  /!*<span className="ml-px align-top text-xs text-gray-500">%</span>*!/*/}
                          {/*</p>*/}
                          <span className="text-xl">{calculateKPI().requirementsByImpact?.major}<sub>/{calculateKPI().textAnalysisTotal}</sub></span>
                        </div>
                        <span className="relative block">
                          <svg width="69" height="91" viewBox="0 0 69 91" fill="none" xmlns="http://www.w3.org/2000/svg"
                               data-config-id="auto-svg-1-2">
                            <path
                              d="M67.9865 79.0753C69.3577 81.148 68.7977 83.9622 66.5984 85.1196C61.1443 87.99 55.1436 89.717 48.9653 90.1747C41.2869 90.7435 33.5909 89.3326 26.6136 86.077C19.6362 82.8215 13.6109 77.8301 9.11396 71.5803C4.61701 65.3306 1.79884 58.0315 0.92903 50.3813C0.0592193 42.7311 1.16686 34.9857 4.146 27.8859C7.12514 20.7861 11.8761 14.5695 17.9445 9.83067C24.0129 5.09182 31.1957 1.98927 38.8058 0.819781C44.9292 -0.12122 51.1644 0.214628 57.1237 1.78733C59.5267 2.42151 60.7042 5.03807 59.8333 7.36576C58.9623 9.69345 56.3723 10.8445 53.9542 10.2706C49.4528 9.20231 44.7734 9.00838 40.1729 9.71535C34.0848 10.6509 28.3385 13.133 23.4838 16.9241C18.6291 20.7151 14.8283 25.6884 12.445 31.3683C10.0617 37.0481 9.17557 43.2444 9.87142 49.3646C10.5673 55.4847 12.8218 61.324 16.4194 66.3238C20.0169 71.3236 24.8372 75.3167 30.419 77.9212C36.0009 80.5256 42.1577 81.6543 48.3004 81.1993C52.9422 80.8554 57.4587 79.616 61.6053 77.5644C63.8329 76.4623 66.6152 77.0025 67.9865 79.0753Z"
                              fill="#F1F5FB"></path>
                          </svg>
                        </span>
                        <span className="absolute inset-0 ml-3 mt-px block mx-auto">
                          <svg width="78" height="88" viewBox="0 0 78 88" fill="none" xmlns="http://www.w3.org/2000/svg"
                               data-config-id="auto-svg-2-2">
                            <path
                              d="M34 4.49613C34 2.01299 36.0182 -0.0237881 38.4884 0.229514C44.4509 0.840933 50.2422 2.66606 55.4993 5.61018C62.0678 9.2887 67.5826 14.5911 71.5162 21.0101C75.4497 27.4291 77.6705 34.75 77.9661 42.2726C78.2616 49.7951 76.6221 57.2677 73.2043 63.9756C69.7865 70.6834 64.7047 76.4021 58.4451 80.5847C52.1855 84.7672 44.9574 87.2737 37.4522 87.8644C29.947 88.455 22.4158 87.1101 15.579 83.9583C10.1071 81.4357 5.22649 77.8232 1.22716 73.3589C-0.429708 71.5093 0.0317984 68.6794 2.0407 67.2198C4.04961 65.7602 6.8421 66.2296 8.54694 68.0351C11.6079 71.2766 15.2698 73.914 19.3437 75.792C24.7833 78.2997 30.7753 79.3698 36.7467 78.8998C42.718 78.4299 48.4689 76.4356 53.4493 73.1079C58.4296 69.7801 62.4728 65.2301 65.1921 59.8932C67.9114 54.5562 69.2159 48.6108 68.9807 42.6256C68.7456 36.6404 66.9787 30.8157 63.849 25.7085C60.7193 20.6014 56.3316 16.3826 51.1055 13.4559C47.1916 11.264 42.9055 9.85163 38.4838 9.28059C36.0211 8.96254 34 6.97928 34 4.49613Z"
                              fill="#025bee"></path>
                          </svg>
                        </span>
                      </div>
                      <h3 className="mb-4 text-2xl font-meduim font-heading">Majeur</h3>
                      <p className="text-gray-400 text-md">Total des exigence par impact</p>
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/4 px-4 text-center">
                      <div className="relative w-20 mx-auto mb-8">
                        <div className="absolute inset-0 ml-2 flex items-center justify-center">
                          <span className="text-xl">{calculateKPI().requirementsByImpact?.critical}<sub>/{calculateKPI().textAnalysisTotal}</sub></span>
                          {/*<p className="text-lg font-semibold">*/}
                          {/*  {calculateKPI().requirementsByImpact?.critical}*/}
                          {/*  /!*<span className="ml-px align-top text-xs text-gray-500">%</span>*!/*/}
                          {/*</p>*/}
                        </div>
                        <span className="relative block">
                          <svg width="69" height="91" viewBox="0 0 69 91" fill="none" xmlns="http://www.w3.org/2000/svg"
                               data-config-id="auto-svg-1-2">
                            <path
                              d="M67.9865 79.0753C69.3577 81.148 68.7977 83.9622 66.5984 85.1196C61.1443 87.99 55.1436 89.717 48.9653 90.1747C41.2869 90.7435 33.5909 89.3326 26.6136 86.077C19.6362 82.8215 13.6109 77.8301 9.11396 71.5803C4.61701 65.3306 1.79884 58.0315 0.92903 50.3813C0.0592193 42.7311 1.16686 34.9857 4.146 27.8859C7.12514 20.7861 11.8761 14.5695 17.9445 9.83067C24.0129 5.09182 31.1957 1.98927 38.8058 0.819781C44.9292 -0.12122 51.1644 0.214628 57.1237 1.78733C59.5267 2.42151 60.7042 5.03807 59.8333 7.36576C58.9623 9.69345 56.3723 10.8445 53.9542 10.2706C49.4528 9.20231 44.7734 9.00838 40.1729 9.71535C34.0848 10.6509 28.3385 13.133 23.4838 16.9241C18.6291 20.7151 14.8283 25.6884 12.445 31.3683C10.0617 37.0481 9.17557 43.2444 9.87142 49.3646C10.5673 55.4847 12.8218 61.324 16.4194 66.3238C20.0169 71.3236 24.8372 75.3167 30.419 77.9212C36.0009 80.5256 42.1577 81.6543 48.3004 81.1993C52.9422 80.8554 57.4587 79.616 61.6053 77.5644C63.8329 76.4623 66.6152 77.0025 67.9865 79.0753Z"
                              fill="#F1F5FB"></path>
                          </svg>
                        </span>
                        <span className="absolute inset-0 ml-3 mt-px block mx-auto">
                          <svg width="78" height="88" viewBox="0 0 78 88" fill="none" xmlns="http://www.w3.org/2000/svg"
                               data-config-id="auto-svg-2-2">
                            <path
                              d="M34 4.49613C34 2.01299 36.0182 -0.0237881 38.4884 0.229514C44.4509 0.840933 50.2422 2.66606 55.4993 5.61018C62.0678 9.2887 67.5826 14.5911 71.5162 21.0101C75.4497 27.4291 77.6705 34.75 77.9661 42.2726C78.2616 49.7951 76.6221 57.2677 73.2043 63.9756C69.7865 70.6834 64.7047 76.4021 58.4451 80.5847C52.1855 84.7672 44.9574 87.2737 37.4522 87.8644C29.947 88.455 22.4158 87.1101 15.579 83.9583C10.1071 81.4357 5.22649 77.8232 1.22716 73.3589C-0.429708 71.5093 0.0317984 68.6794 2.0407 67.2198C4.04961 65.7602 6.8421 66.2296 8.54694 68.0351C11.6079 71.2766 15.2698 73.914 19.3437 75.792C24.7833 78.2997 30.7753 79.3698 36.7467 78.8998C42.718 78.4299 48.4689 76.4356 53.4493 73.1079C58.4296 69.7801 62.4728 65.2301 65.1921 59.8932C67.9114 54.5562 69.2159 48.6108 68.9807 42.6256C68.7456 36.6404 66.9787 30.8157 63.849 25.7085C60.7193 20.6014 56.3316 16.3826 51.1055 13.4559C47.1916 11.264 42.9055 9.85163 38.4838 9.28059C36.0211 8.96254 34 6.97928 34 4.49613Z"
                              fill="red"></path>
                          </svg>
                        </span>
                      </div>


                      {/*<div className="relative inline-flex items-center justify-center overflow-hidden rounded-full bottom-5 left-5">*/}
                      {/*  <svg className="w-20 h-20">*/}
                      {/*    <circle*/}
                      {/*      className="text-gray-300"*/}
                      {/*      stroke-width="5"*/}
                      {/*      stroke="currentColor"*/}
                      {/*      fill="transparent"*/}
                      {/*      r="30"*/}
                      {/*      cx="40"*/}
                      {/*      cy="40"*/}
                      {/*    />*/}
                      {/*    <circle*/}
                      {/*      className="text-blue-600"*/}
                      {/*      stroke-width="5"*/}
                      {/*      stroke-dasharray={circumference}*/}
                      {/*      stroke-dashoffset={(calculateKPI().textAnalysisTotal  - calculateKPI().requirementsByImpact?.critical) * circumference}*/}
                      {/*      stroke-linecap="round"*/}
                      {/*      stroke="blue"*/}
                      {/*      fill="transparent"*/}
                      {/*      r="30"*/}
                      {/*      cx="40"*/}
                      {/*      cy="40"*/}
                      {/*    />*/}
                      {/*  </svg>*/}
                      {/*  <span className="absolute text-xl text-blue-500">{calculateKPI().requirementsByImpact?.critical}<sub>/1</sub></span>*/}
                      {/*</div>*/}

                      <h3 className="mb-4 text-2xl font-meduim font-heading">Critique</h3>
                      <p className="text-gray-400 text-md">Total des exigence par impact</p>
                    </div>
                  </div>
                </div>

                {/*  requirements by nature of impact*/}
                <div className='py-8'>
                  <h1 className='text-3xl font-medium'>Exigences par nature</h1>
                  <p className='text-gray-400 font-normal'>Statistiques des exigence par nature de l'impact du texte</p>
                </div>
                <dl className="grid py-16  border rounded-md grid-cols-1 gap-x-8 gap-y-8 text-center md:grid-cols-4">
                  <div className="mx-auto px-24 border-r flex max-w-xs flex-col gap-y-4">
                    <dt className="text-base leading-7 text-gray-600">Financier</dt>
                    <dd className="order-first text-4xl font-medium tracking-tight text-gray-900">
                      { calculateKPI().requirementsByNatureOfImpact?.financial } <sub>/{calculateKPI().textAnalysisTotal}</sub>
                    </dd>
                  </div>
                  <div className="mx-auto px-24 border-r flex max-w-xs flex-col gap-y-4">
                    <dt className="text-base leading-7 text-gray-600">Organisation</dt>
                    <dd className="order-first text-4xl font-medium tracking-tight text-gray-900">
                      { calculateKPI().requirementsByNatureOfImpact?.organisation } <sub>/{calculateKPI().textAnalysisTotal}</sub>
                    </dd>
                  </div>
                  <div className="mx-auto px-24 border-r flex max-w-xs flex-col gap-y-4">
                    <dt className="text-base leading-7 text-gray-600">Produit</dt>
                    <dd className="order-first text-4xl font-medium tracking-tight text-gray-900">
                      { calculateKPI().requirementsByNatureOfImpact?.products } <sub>/{calculateKPI().textAnalysisTotal}</sub>
                    </dd>
                  </div>
                  <div className="mx-auto px-24 flex max-w-xs flex-col gap-y-4">
                    <dt className="text-base leading-7 text-gray-600">Image</dt>
                    <dd className="order-first text-4xl font-medium tracking-tight text-gray-900">
                      { calculateKPI().requirementsByNatureOfImpact?.image } <sub>/{calculateKPI().textAnalysisTotal}</sub>
                    </dd>
                  </div>
                </dl>

            {/*total applicable text*/}
            <div className='py-8'>
              <h1 className='text-3xl font-medium'>Taux</h1>
              <p className='text-gray-400 font-normal'>Section statistique des des taux du texte</p>
            </div>
            {/*total applicable text*/}
            <div className="flex flex-wrap -mx-3">
              <div className="w-full md:w-1/2 px-3 mb-6">
                <div className="px-8 border md:px-12 lg:px-16 pt-14 pb-12 sm:pb-16 rounded-md">
                  <h3 className="mb-3 font-heading font-medium text-indigo-600">
                    Total conforme</h3>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl font-heading font-medium">{calculateKPI().conformity.total}</span>

                  </div>
                  <div className="relative w-full h-1 mb-3 bg-green-100 rounded-full">
                    <div className={`absolute top-0 left-0 w-[${(calculateKPI().conformity.total * calculateKPI().textAnalysisTotal)/100 + 10}%] h-full bg-green-500 rounded-full`}></div>
                  </div>
                  <span
                    className="inline-block px-2 py-1 mr-2 text-xxs leading-4 text-green-500 font-bold bg-green-200 bg-opacity-70 rounded-full">
                      {(calculateKPI().conformity.total * calculateKPI().textAnalysisTotal)/100}%
                    </span>
                  <span className="text-sm text-darkBlueGray-400 font-heading"
                        >Pourcentage</span>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-3 mb-6">
                <div className="px-8 border md:px-12 lg:px-16 pt-14 pb-12 sm:pb-16 rounded-md">
                  <h3 className="mb-3 font-heading font-medium text-indigo-600">
                    Total  non-conforme</h3>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl font-heading font-medium">{calculateKPI().textAnalysisTotal  - calculateKPI().conformity.total}</span>

                  </div>
                  <div className="relative w-full h-1 mb-3 bg-green-100 rounded-full">
                    <div className={`absolute top-0 left-0 w-[25%] h-full bg-green-500 rounded-full`}></div>
                  </div>
                  <span
                    className="inline-block px-2 py-1 mr-2 text-xxs leading-4 text-green-500 font-bold bg-green-200 bg-opacity-70 rounded-full">
                      {((calculateKPI().textAnalysisTotal - calculateKPI().conformity.total) * calculateKPI().textAnalysisTotal)}%
                    </span>
                  <span className="text-sm text-darkBlueGray-400 font-heading"
                  >Pourcentage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
