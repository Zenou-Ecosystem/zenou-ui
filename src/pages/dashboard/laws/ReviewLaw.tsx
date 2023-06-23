import React, { useRef, useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { useNavigate, useParams } from 'react-router-dom';
import { LocalStore } from '../../../utils/storage.utils';
import Button from '../../../core/Button/Button';
import { HiArrowSmRight, HiCheck } from 'react-icons/hi';
import { createLaw } from '../../../services/laws.service';
import { Toast } from 'primereact/toast';

export default function ReviewLaw(){
  const[activeIndex, setActiveIndex]=React.useState(0);
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const toast = useRef<Toast>(null);

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  const { id } = useParams();

  const draftItems = LocalStore.get("LAW_DRAFT");

  const draftInfo = () => {
    const { text_analysis, ...others } = draftItems.find((item:any) => item.id === Number(id));

    if(text_analysis["compliant"]){
      delete text_analysis["conformity_cost"];
      delete text_analysis["conformity_deadline"];
      delete text_analysis["action_plans"]
    }
    return {text_analysis, others}
  };

  const items = [
    {label: translationService(currentLanguage,'LAW.ADD.FORM.TITLE.LAW'), icon: 'pi pi-file-edit'},
    {label: translationService(currentLanguage,'LAW.ADD.FORM.ANALYSE_TEXT'), icon: 'pi pi-wrench'}
  ];

  const submitLaw = (e:any) => {
    e.preventDefault();
    let law = {
      ...draftInfo().others,
      ...draftInfo().text_analysis,
      is_analysed: true
    }
    createLaw(law).then(res => {
      if(res){
        toast?.current?.show({ severity: 'success', summary: 'Success', detail: translationService(currentLanguage,'TOAST.SUCCESSFUL_ACTION') });
        let newDraftData = draftItems.filter((x:any) => x.id !== Number(id));
        LocalStore.set("LAW_DRAFT", newDraftData);
        navigate(`/dashboard/laws`);
      }
    })
  }

  return(
    <section>
      <Toast ref={toast}></Toast>
      <div className="header-frame h-48 items-center justify-center flex-col flex w-full">
        <h1 className='font-semibold text-2xl md:text-4xl capitalize'>{translationService(currentLanguage,'ANALYSIS_PREVIEW_TEXT_ANALYSIS')}</h1>
        <div
          className={`flex justify-center items-center mt-2 gap-1 font-medium py-1 px-2 rounded-full border ${!draftInfo().text_analysis['compliant'] ? 'bg-red-100 border-red-500 text-red-500' : 'bg-green-100 text-green-500 border-green-500'}`}>
          <small className="font-light">{translationService(currentLanguage,'ANALYSIS_STATUS')}:</small>
          <i className={`pi pi-${draftInfo().text_analysis['compliant']?'check':'times'}`}></i>
        </div>
      </div>
      <div className="overflow-hidden mt-2">
        <TabMenu className='tab-menu' model={items} activeIndex={activeIndex} onTabChange={(e) => {
          setActiveIndex(e.index);
        }} />
        <div hidden={activeIndex !==0} className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Object.entries(draftInfo().others).map(([key, value]) => {
              const textAreaInputs = ['purpose_and_scope_of_text', 'products_or_services_concerned'].includes(key);
              if(key !== "id"){
                return (
                  <div key={key} className={`${textAreaInputs?'col-span-2':''}`}>
                    <div className='border-b pb-2'>{translationService(currentLanguage,`LAW.ADD.FORM.${key.toUpperCase()}`)}</div>
                    <div  className='py-2 text-gray-400 mt-2'>

                      { typeof value === "object" && Array.isArray(value)
                        ?
                        (<ul className="list-disc ml-6 grid grid-cols-2">{value.map((item:any, index:any) => <li className="capitalize" key={index}>{translationService(currentLanguage,`OPTIONS.SECTORS_OF_ACTIVITIES.${(item as any).toUpperCase()}`)}</li>)}</ul>)
                        : textAreaInputs ? <div dangerouslySetInnerHTML={{ __html :value as any }}></div>
                        : key==='type_of_text' ? translationService(currentLanguage,`LAW.ADD.FORM.TITLE.${(value as any).toUpperCase()}`) :

                          value as any}</div>
                  </div>
                )

              }
              return ""
            })}
          </div>
        </div>
        <div hidden={activeIndex !==1} className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Object.entries(draftInfo().text_analysis).map(([key, value]) => {

              if(key === "compliant"){
                return (
                  <div key={key} className='flex items-center gap-2'>
                    <p className=''>{translationService(currentLanguage,`LAW.ANALYSE_TEXT.FORM.${key.toUpperCase()}`)}</p>
                    <div
                      className={`flex justify-center items-center m-1 gap-1 font-medium py-1 px-2 rounded-full border ${!value ? 'bg-red-100 border-red-500 text-red-500' : 'bg-green-100 text-green-500 border-green-500'}`}>
                      <i className={`pi pi-${value?'check':'times'}`}></i>
                    </div>
                  </div>
                )
              }
              if(key==="impact"){
                return (
                  <div key={key}>
                    <div className='border-b pb-2'>{translationService(currentLanguage,`LAW.ANALYSE_TEXT.FORM.${key.toUpperCase()}`)}</div>
                    <div  className='py-2 text-gray-400 mt-2 flex'>
                      <div
                        className={`flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full border ${value === 'weak'? 'bg-red-100 border-red-500 text-red-500' : value === 'medium'? 'bg-orange-100 text-orange-500 border-orange-500': value === 'major'? 'bg-blue-500 text-white':'bg-red-500 text-white' }`}>
                        <div className="text-xs font-normal leading-none max-w-full flex-initial">
                          {translationService(currentLanguage,`OPTIONS.${(value as any).toUpperCase()}`)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              // if(key==="process_management"){
              //   return (
              //     <div key={key}>
              //       <div className='border-b pb-2'>{translationService(currentLanguage,`LAW.ANALYSE_TEXT.FORM.${key.toUpperCase()}`)}</div>
              //       <div  className='py-2 text-gray-400 mt-2 flex'>
              //         <div
              //           className={`flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full border ${value === 'weak'? 'bg-red-100 border-red-500 text-red-500' : value === 'medium'? 'bg-orange-100 text-orange-500 border-orange-500': value === 'major'? 'bg-blue-500 text-white':'bg-red-500 text-white' }`}>
              //           <div className="text-xs font-normal leading-none max-w-full flex-initial">
              //             {translationService(currentLanguage,`OPTIONS.SECTORS_OF_ACTIVITIES.${(value as any).toUpperCase()}`)}
              //           </div>
              //         </div>
              //       </div>
              //     </div>
              //   )
              // }
              return (
                <div key={key}>
                  <div className='border-b pb-2'>{translationService(currentLanguage,`LAW.ANALYSE_TEXT.FORM.${key.toUpperCase()}`)}</div>
                  <div  className='py-2 text-gray-400 mt-2'>{
                    typeof value === "object" && Array.isArray(value) ?
                    (<ul className="list-disc ml-6 grid grid-cols-2">{value.map((item:any, index:any) => <li className="capitalize" key={index}>{translationService(currentLanguage,`OPTIONS.SECTORS_OF_ACTIVITIES.${(item as any).toUpperCase()}`)}</li>)}</ul>):
                    value as any}</div>
                </div>
              )
            })}
          </div>
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
              activeIndex !== 1 ? setActiveIndex((prev:number) => prev +1) : submitLaw(e);
            }}
          />
        </div>
      </div>
    </section>
  )
}
