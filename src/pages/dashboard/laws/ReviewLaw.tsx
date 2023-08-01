import React, { useRef, useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { useNavigate, useParams } from 'react-router-dom';
import { LocalStore } from '../../../utils/storage.utils';
import Button from '../../../core/Button/Button';
import { HiArrowSmRight, HiCheck } from 'react-icons/hi';
import { createLaw } from '../../../services/laws.service';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';

export default function ReviewLaw(){
  const[activeIndex, setActiveIndex]=React.useState(0);
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const toast = useRef<Toast>(null);

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  const { id } = useParams();

  const draftItems = LocalStore.get("LAW_DRAFT");

  const draftInfo = () => {
    const { text_analysis, parent_of_text, ...others } = draftItems.find((item:any) => item.id === Number(id));

    return {text_analysis, parent_of_text, text_analysis_keys:Object.keys(text_analysis[0]), others}
  };

  const calculateKPI = () => {

    const filterCriteria = (condition: any) => {
      return draftInfo().text_analysis.filter(condition)
    }

    const requirementsByApplicability = {
      total: filterCriteria((obj:any) => obj.applicability === 'yes')?.length,
    }

    const conformity = {
      total: filterCriteria((obj:any) => obj.complaint === true)?.length / requirementsByApplicability.total
    }

    const requirementsByFamily = {
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

  }

  const items = [
    {label: translationService(currentLanguage,'OPTIONS.LAW'), icon: 'pi pi-file-edit'},
    {label: translationService(currentLanguage,'LAW.ADD.FORM.ANALYSE_TEXT'), icon: 'pi pi-wrench'},
    {label: translationService(currentLanguage,'LAW.KPI'), icon: 'pi pi-chart-bar'},
  ];

  const submitLaw = () => {
    let law = {
      ...draftInfo().others,
      text_analysis: draftInfo().text_analysis,
      is_analysed: true,
      parent_of_text: draftInfo().parent_of_text
    }
    createLaw(law).then(res => {
      if(res){
        let newDraftData = draftItems.filter((x:any) => x.id !== Number(id));
        LocalStore.set("LAW_DRAFT", newDraftData);
        toast?.current?.show({ severity: 'success', summary: 'Success', detail: translationService(currentLanguage,'TOAST.SUCCESSFUL_ACTION') });
        navigate(`/dashboard/laws`);
      }
    })
  }

  const applicableBodyTemplate = (key:string) => (rowData:any) => {
    return <Tag value={translationService(currentLanguage,`OPTIONS.${rowData[key].toString().toUpperCase()}`)} severity={['yes', 'true'].includes(rowData[key].toString()) ? 'success' : ['no', 'critical', 'weak', 'false'].includes(rowData[key].toString()) ? 'danger': ['medium'].includes(rowData[key].toString())? 'warning': 'info'} />;
  };

  const expertiseTemplate = (rowData: any) => {
    return <div className='truncate' dangerouslySetInnerHTML={{ __html: rowData.expertise }}></div>
  }

  const actionPlanTemplate = (rowData: any) => {
    return !rowData.action_plans ? <i className='pi pi-times-circle text-red-500'></i> : <div>{rowData.action_plans}</div>
  }

  const proofBodyTemplate = (rowData: any) => {
    return <ol className='list-disc'>
      {
        rowData?.proof_of_conformity ? rowData.proof_of_conformity.map(({ data }: any, idx:number) => {
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

  return(
    <section>
      <Toast ref={toast}></Toast>
      <div className="header-frame h-48 items-center justify-center flex-col flex w-full">
        <h1 className='font-semibold text-2xl md:text-4xl capitalize'>{translationService(currentLanguage,'ANALYSIS_PREVIEW_TEXT_ANALYSIS')}</h1>
        {/*<div*/}
        {/*  className={`flex justify-center items-center mt-2 gap-1 font-medium py-1 px-2 rounded-full border ${!draftInfo().text_analysis['compliant'] ? 'bg-red-100 border-red-500 text-red-500' : 'bg-green-100 text-green-500 border-green-500'}`}>*/}
        {/*  <small className="font-light">{translationService(currentLanguage,'ANALYSIS_STATUS')}:</small>*/}
        {/*  <i className={`pi pi-${draftInfo().text_analysis['compliant']?'check':'times'}`}></i>*/}
        {/*</div>*/}
      </div>
      <div className="overflow-hidden mt-2">
        <TabMenu className='tab-menu' model={items} activeIndex={activeIndex} onTabChange={(e) => {
          setActiveIndex(e.index);
        }} />
        <div hidden={activeIndex !==0} className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Object.entries(draftInfo().others).map(([key, value]) => {
              const textAreaInputs = ['purpose_and_scope_of_text'].includes(key);
              if(key !== "id"){
                return (
                  <div key={key} className={`${textAreaInputs?'col-span-2':''}`}>
                    <div className='border-b pb-2'>{translationService(currentLanguage,`LAW.ADD.FORM.${key.toString().toUpperCase()}`)}</div>
                    <div  className='py-2 text-gray-400 mt-2'>

                      { typeof value === "object" && Array.isArray(value)
                        ?
                        (<ul className="list-disc ml-6 grid grid-cols-2">{value.map((item:any, index:any) =>
                          <li className="capitalize" key={index}>
                            {key === 'sectors_of_activity' ? translationService(currentLanguage,`OPTIONS.SECTORS_OF_ACTIVITIES.${(item as any).toString().toUpperCase()}`) : item}
                          </li>)}
                        </ul>)
                        : textAreaInputs ?
                          <div dangerouslySetInnerHTML={{ __html :value as any }}></div>
                        : key==='type_of_text' ?
                            translationService(currentLanguage,`OPTIONS.${(value as any).toUpperCase()}`)
                            :
                          value as any
                      }
                    </div>
                  </div>
                )

              }
              return ""
            })}
          </div>
        </div>
        <div hidden={activeIndex !==1} className='p-6'>
          <DataTable size="small" tableStyle={{ width: '100%' }} value={draftInfo().text_analysis} showGridlines>
            {
              draftInfo().text_analysis_keys.map((item:any, index:number) =>
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

        <div hidden={activeIndex !== 2} className='p-6'>
          {/*<DataTable size="small" tableStyle={{ width: '100%' }} value={draftInfo().text_analysis} showGridlines>*/}
          {/*  {*/}
          {/*    draftInfo().text_analysis_keys.map((item:any, index:number) =>*/}
          {/*      <Column style={{ width: '20px' }} key={index} field={item}*/}
          {/*              body={*/}
          {/*                ['applicability', 'impact', 'nature_of_impact', 'compliant'].includes(item)*/}
          {/*                  ? applicableBodyTemplate(item): ['expertise'].includes(item)*/}
          {/*                    ? expertiseTemplate :*/}
          {/*                    ['action_plans', 'conformity_cost', 'conformity_deadline'].includes(item)*/}
          {/*                      ? actionPlanTemplate :*/}
          {/*                      ['process_management'].includes(item) ? servicesBodyTemplate : ['proof_of_conformity'].includes(item)? proofBodyTemplate :'' }*/}
          {/*              header={translationService(currentLanguage,`LAW.ADD.FORM.${item.toString().toUpperCase()}`)}/>)*/}
          {/*  }*/}
          {/*</DataTable>*/}
        </div>

        <div className="flex items-center justify-between">
          <button
            id="return"
            className={`py-2 ${
              activeIndex === 0 ? "hidden" : "flex"
            } items-center gap-4 text-red-500 rounded-md  w-auto px-4 border border-red-500`}
            onClick={(e: any) => {
              e.preventDefault();
              setActiveIndex((prev:number) => prev - 1);
            }}
          >
            <i className="pi pi-arrow-left"></i>
            {translationService(currentLanguage,'REGISTRATION.BUTTON.BACK')}
          </button>
          <Button
            title={activeIndex !== 1 ? translationService(currentLanguage,'REGISTRATION.BUTTON.NEXT') : translationService(currentLanguage,'REGISTRATION.BUTTON.SUBMIT')}
            Icon={{
              classes: "",
              Name: activeIndex !== 1 ? HiArrowSmRight : HiCheck,
              color: "white",
            }}
            styles={`w-full md:w-auto py-2.5 px-4 items-center justify-center ${activeIndex !== 1?'':'flex-row-reverse'}`}
            onClick={(e:any) => {
              activeIndex !== 1 ? setActiveIndex((prev:number) => prev +1) : submitLaw();
            }}
          />
        </div>
      </div>
    </section>
  )
}
