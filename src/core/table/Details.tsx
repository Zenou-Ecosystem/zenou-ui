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
import { getApplicableRequirements, getRequirementsByImpact } from '../../services/kpi.service';
import { Chart } from 'primereact/chart';


export default function DataDetails() {
  const [props, setProps] = useState<any>();
  const params = useParams();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const [chartData, setChartData] = React.useState({}) as any;
  const [chartOptions, setChartOptions] = React.useState({});

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const lawItems = [
    {label: translationService(currentLanguage,'LAW.ADD.FORM.REQUIREMENTS'), icon: 'pi pi-chart-bar'},
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
    const userRole = LocalStore.get("user");
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

    if(params?.context && params?.context === 'laws' ) {
      (async() => {
        const requirementsByImpactData = {
          weak: await getRequirementsByImpact(userRole?.role, {impact: "weak"}),
          medium: await getRequirementsByImpact(userRole?.role, {impact: "medium"}),
          major: await getRequirementsByImpact(userRole?.role, {impact: "major"}),
          critical: await getRequirementsByImpact(userRole?.role, {impact: "critical"})
        }
        const requirementsByApplicabilityData =  await getApplicableRequirements(userRole?.role, { applicability: 'yes' })

        const documentStyle = getComputedStyle(document.documentElement);

        console.log(requirementsByImpactData, requirementsByApplicabilityData);
        const requirementsByImpact = {
          labels: ["Faible", 'Moyen', 'Majeur', 'Critique'],
          datasets: [
            {
              data: [requirementsByImpactData.weak?.length, requirementsByImpactData.medium?.length, requirementsByImpactData.major?.length, requirementsByImpactData.critical?.length],
              backgroundColor: [
                documentStyle.getPropertyValue('--red-700'),
                documentStyle.getPropertyValue('--yellow-500'),
                documentStyle.getPropertyValue('--blue-500'),
                documentStyle.getPropertyValue('--red-500')
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue('--red-500'),
                documentStyle.getPropertyValue('--yellow-400'),
                documentStyle.getPropertyValue('--blue-400'),
                documentStyle.getPropertyValue('--red-400')
              ]
            }
          ]
        }
        const requirementsByApplicability = {
          labels: ["Oui", 'Non'],
          datasets: [
            {
              data: [requirementsByApplicabilityData?.length, props?.text_analysis?.length - requirementsByApplicabilityData?.length],
            }
          ]
        }
        const options = {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true
              }
            }
          }
        };

        setChartData({ requirementsByImpact, requirementsByApplicability });
        setChartOptions(options);

      })()
    }
  }, []);

  const showPropDetail = (props: object) => {
    let elements: any = [];
    let detailElements: any = {};

    if(!props) {
     return { elements, detailElements };
    }
    for (let [key, value] of Object.entries(props)) {
      key = key === "id" || key === "_id" ? "Signature" : key;
      // @ts-ignore
      ['created_at', 'updated_at', 'password'].includes(key) && delete props[key];

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
                  <p className='border-b pb-2'>{ params.context &&
                  translationService(currentLanguage,`${singularize(params?.context).toUpperCase()}.ADD.FORM.${key.toUpperCase()}`)
                  }:
                  </p>
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
    // console.log(elements);
    return { elements, detailElements };
  };

  const [activeTab, setActiveTab] = useState<any>({value: primaryItems[0], index: 0});


  const applicableBodyTemplate = (key:string) => (rowData:any) => {
    return <Tag value={translationService(currentLanguage,`OPTIONS.${rowData[key].toString().toUpperCase()}`)} severity={['yes', 'true'].includes(rowData[key].toString()) ? 'success' : ['no', 'critical', 'weak', 'false'].includes(rowData[key].toString()) ? 'danger': ['medium'].includes(rowData[key].toString())? 'warning': 'info'} />;
  };

  const expertiseTemplate = (rowData: any) => {
    return <div className='truncate w-72' dangerouslySetInnerHTML={{ __html: rowData.expertise }}></div>
  }

  const actionPlanTemplate = (key:string) => (rowData: any) =>  {
    return !rowData[key] ? <i className='pi pi-times-circle text-red-500'></i> : <div>{rowData[key]}</div>
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
            {showPropDetail(props)?.detailElements?.parent_of_text?.length ?
              (
                <div className='flex gap-2 items-center'>
                  {(showPropDetail(props)?.detailElements?.parent_of_text as []).map((item:any, index) =>
                    <a key={index} className='cursor-pointer text-blue-500 pb-1 border-b border-blue-500' onClick={(e) => {
                      e.preventDefault();
                      console.log(item);
                      // LocalStore.set('VIEW_DATA', item);
                      // setProps(item);
                      // navigate(`/dashboard/laws/${item?.id}`)
                    }}>
                      {item?.title_of_text?.slice(0, 10)+"..."}
                    </a>
                  )}
                </div>
              )
              : ''}

          </div>
        </div>
        <div hidden={activeTab.value?.label !== translationService(currentLanguage,'LAW.ADD.FORM.ANALYSE_TEXT')}>
          <br/>
          <DataTable size="small" tableStyle={{ width: '100%' }} value={showPropDetail(props)?.detailElements?.text_analysis} showGridlines>
            {
              ["requirement", "applicability", "process_management", "impact", "nature_of_impact", "expertise",
              "action_plans", "proof_of_conformity", "compliant", "conformity_cost", "conformity_deadline"].map((item:any, index:number) =>
                <Column style={{ width: '20px' }} key={index} field={item}
                        body={

                          ['applicability', 'impact', 'nature_of_impact', 'compliant'].includes(item)
                            ? applicableBodyTemplate(item): ['expertise'].includes(item)
                              ? expertiseTemplate :
                              ['action_plans', 'conformity_cost', 'conformity_deadline'].includes(item)
                                ? actionPlanTemplate(item) :
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

        <div hidden={activeTab.value?.label !== translationService(currentLanguage,'LAW.ADD.FORM.REQUIREMENTS')}>
          <div className='grid grid-cols-1 md:grid-cols-2 my-4 gap-4'>
            { showPropDetail(props)?.detailElements?.requirements &&
              showPropDetail(props)?.detailElements?.requirements?.length ?
                showPropDetail(props)?.detailElements.requirements?.map((data: any) => <div key={data?.id} className="col-span-2">
                  <p className='border-b pb-2'>Numeros: {data?.id}</p>
                  <div className='text-gray-500 px-4' dangerouslySetInnerHTML={{ __html: data?.name }}></div>
                </div> ):
                <div className='col-span-2 flex items-center h-48 w-full justify-center'>{translationService(currentLanguage,`TABLE.NO_RESULT_FOUND`)}</div>
            }
          </div>
        </div>

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
                <div className='pt-8 pb-3 border-b'>
                  <h1 className='text-3xl font-medium'>Statistique des exigence</h1>
                  <p className='text-gray-400 font-normal'>Statistiques des exigence par critere du texte</p>
                </div>
                <div className="px-4 mx-auto">
                  <div className="flex py-8 items-center">
                    <div className="flex justify-between w-full items-center flex-col">
                      <div className="flex border-b justify-between w-full items-center">
                        <div className="w-1/2">
                        <p className='text-gray-400 font-normal text-center'>Par impact</p>
                        </div>
                        <div className="w-1/2">
                          <p className='text-gray-400 font-normal text-center'>Par status applicable</p>
                        </div>

                      </div>
                      <div className="flex justify-between w-full items-center">
                        <div className="border-r py-4 w-1/2 flex items-center justify-center">
                          <Chart type="pie" data={chartData?.requirementsByImpact} options={chartOptions} className="w-72" />
                        </div>
                        <div className='py-4 w-1/2 flex items-center justify-center'>
                          <Chart type="pie" data={chartData?.requirementsByApplicability} options={chartOptions} className="w-72" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </div>
    </section>
  );
}
