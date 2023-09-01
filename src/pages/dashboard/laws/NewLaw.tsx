import React, { useState, useRef } from 'react';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { createLaw, fetchLaws } from '../../../services/laws.service';
import { LocalStore } from '../../../utils/storage.utils';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Chips } from 'primereact/chips';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';

const initialFormState = {
  title_of_text: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  type_of_text: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  date_of_issue: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  origin_of_text: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  source_of_text: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  nature_of_text: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  parent_of_text: {
    value: {},
    error: true,
    error_message: "",
    required: true,
  },
  sectors_of_activity: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  products_or_services_concerned: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  purpose_and_scope_of_text: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  requirements: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
};


export default function InteractiveDemo() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [requirements, setRequirements] = React.useState<{id: number, name: string}[]>([]);
  const [formValues, setFormValues] =
    useState<Record<string, any>>(initialFormState);

  const navigate = useNavigate();

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  const [loader, setLoader] = useState(false);

  const toast = useRef<Toast>(null);

  const [laws, setLaws] = React.useState<any[]>([]);

  const menu = React.useRef<Menu | any>(null);

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), []);

  /**
   * description: handle change function. this function is used to handle on change events in an input field
   * default form state
   * @returns { void }
   * **/
  const handleChange = (e: any) => {
    let { name, value }: Record<any, string> = e.target;

    const targetProperty = formValues[name];

    let error = targetProperty?.validator
      ? !targetProperty.validator.test(String(value))
      : false;

    if (
      targetProperty !== undefined &&
      targetProperty.required &&
      !String(value).trim().length
    )
      error = true;

    setFormValues({
      ...formValues,
      [name]: {
        ...formValues[name],
        value,
        error,
      },
    });

  };

  const handleEditor = (name: string) => (e:any) => {
    setFormValues((prevState)=>{
      return {
        ...prevState,
        [name]: {
          ...formValues[name],
          value: e?.htmlValue
        },
      }
    });
  }

  let formData: any = React.useMemo(() => {
    let formData: Record<string, any>={};
    Object.entries(formValues).forEach(([key, value]) => {
      formData[key] =
        key === "date_of_issue"
          ? new Date(String(value.value)).toLocaleDateString()
          : value?.value;
    });
    formData["requirements"]=requirements;
    return formData;
  }, [formValues])

  React.useEffect(() => {
    (async () => {
      setLaws(await fetchLaws());
    })()
  }, [])

  const handleAnalysis = () => {
    LocalStore.set("EDIT_DATA", formData);
    navigate(`/dashboard/laws/analysis/${formData.id}`);
  }

  const addRequirements = (e: React.MouseEvent) => {
    e.preventDefault();
    if(formValues?.requirements?.value.trim()){
      setRequirements([...requirements, {id: requirements.length + 1, name: formValues?.requirements?.value}]);
      setFormValues({
        ...formValues,
        requirements: {
          ...formValues.requirements,
          value: ""
        }
      })
    }
  }

  const removeRequirements = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const newArray = requirements.filter(e => e.id !== id);
    setRequirements(newArray);
  }

  const handleSubmission = (e: any, is_analysis?:boolean) => {
    e.preventDefault();
    e.stopPropagation();

    setLoader(true);

    createLaw(formData).then(res => {
      toast?.current?.show({ severity: 'success', summary: 'Success', detail: translationService(currentLanguage,'TOAST.SUCCESS_ACTION') });
      is_analysis ? handleAnalysis() :  navigate(`/dashboard/laws/`);
    }).catch(() => {
      toast?.current?.show({ severity: 'error', summary: 'Error', detail: translationService(currentLanguage,'TOAST.ERROR_ACTION') });
    })

  };

  const items = [
    {
      label: 'Preliminare',
    },
    {
      label: 'Exigences',
    },

  ];


  const requirementsBodyTemplate = (rowData: any) => {
    return <div className='truncate' dangerouslySetInnerHTML={{ __html: rowData?.name.slice(0, 100) + "..." }}></div>
  }
  return (
    <div className="mx-auto w-full md:w-8/12">
      <Toast ref={toast}></Toast>
      <div className='mt-4 mb-10'>
          <h1 className="text-3xl font-semibold">Nouveaux texte</h1>
          <p className='font-normal text-gray-500'>Ajouter un nouveaux texte et finiser le process pour passer a l'etape suivante</p>
      </div>
      <Steps className='my-4' model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
      <section hidden={activeIndex !== 0}>
        <form className="w-full">
          <Toast ref={toast}></Toast>
          <div className="form-elements grid md:grid-cols-2 gap-6">
            {/*title_of_text*/}
            <div>
              <label htmlFor="title_of_text">{translationService(currentLanguage,'LAW.ADD.FORM.TITLE_OF_TEXT')}</label>
              <InputText
                value={formValues.title_of_text.value}
                id="title_of_text"
                onChange={handleChange}
                name="title_of_text"
                placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.TITLE_OF_TEXT')}
                className="w-full"
              />
            </div>

            {/*type_of_text*/}
            <div>
              <label htmlFor="type_of_text">{translationService(currentLanguage,'LAW.ADD.FORM.TYPE_OF_TEXT')}</label>
              <Dropdown
                name="type_of_text"
                id="type_of_text"
                value={formValues.type_of_text.value}
                onChange={handleChange}
                options={
                  [
                    { label: translationService(currentLanguage,'OPTIONS.LAW'), value: "law" },
                    { label: translationService(currentLanguage,'OPTIONS.CONVENTION'), value: "convention" },
                    { label: translationService(currentLanguage,'OPTIONS.DECREE'), value: "decree" },
                    { label: translationService(currentLanguage,'OPTIONS.ORDER'), value: "order" },
                    { label: translationService(currentLanguage,'OPTIONS.DECISION'), value: "decision" }
                  ]
                }
                placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.TYPE_OF_TEXT')}
                className="w-full"
              />
            </div>

            {/*date_of_issue*/}
            <div>
              <label htmlFor="date_of_issue">{translationService(currentLanguage,'LAW.ADD.FORM.DATE_OF_ISSUE')}</label> <br />
              <Calendar
                id="date_of_issue"
                className="w-full"
                name="date_of_issue"
                showIcon
                value={formValues.date_of_issue.value}
                placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.DATE_OF_ISSUE')}
                onChange={handleChange}
              />
            </div>

            {/*origin_of_text*/}
            <div>
              <label htmlFor="origin_of_text">{translationService(currentLanguage,'LAW.ADD.FORM.ORIGIN_OF_TEXT')}</label>
              <InputText
                value={formValues.origin_of_text.value}
                id="origin_of_text"
                onChange={handleChange}
                name="origin_of_text"
                placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.ORIGIN_OF_TEXT')}
                className="w-full"
              />
            </div>

            {/*source_of_text*/}
            <div>
              <label htmlFor="source_of_text">{translationService(currentLanguage,'LAW.ADD.FORM.SOURCE_OF_TEXT')}</label>
              <InputText
                value={formValues.source_of_text.value}
                id="source_of_text"
                onChange={handleChange}
                name="source_of_text"
                placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.SOURCE_OF_TEXT')}
                className="w-full"
              />
            </div>

            {/*nature_of_text*/}
            <div>
              <label htmlFor="nature_of_text">{translationService(currentLanguage,'LAW.ADD.FORM.NATURE_OF_TEXT')}</label>
              <InputText
                value={formValues.nature_of_text.value}
                id="nature_of_text"
                onChange={handleChange}
                name="nature_of_text"
                placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.NATURE_OF_TEXT')}
                className="w-full"
              />
            </div>

            {/*parent_of_text*/}
            <div>
              <label htmlFor="parent_of_text">{translationService(currentLanguage,'LAW.ADD.FORM.PARENT_OF_TEXT')}</label>
              <Dropdown
                filter
                value={formValues.parent_of_text.value}
                id="parent_of_text"
                onChange={handleChange}
                name="parent_of_text"
                optionLabel='title_of_text'
                placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.PARENT_OF_TEXT')}
                className="w-full md:w-14rem"
                options={laws || []}
              />
            </div>

            {/*sectors_of_activity*/}
            <div>
              <label htmlFor="sectors_of_activity">{translationService(currentLanguage,'LAW.ADD.FORM.SECTORS_OF_ACTIVITY')}</label>
              <MultiSelect
                filter
                id="sectors_of_activity"
                name="sectors_of_activity"
                value={formValues.sectors_of_activity.value}
                onChange={handleChange}
                className="w-full md:w-14rem"
                options={
                  [
                    { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.AIR'), value: "air"},
                    { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.LAND'), value: "land" },
                    { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.WATER'), value: "water" },
                    { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.ENVIRONMENT'), value: "environment" },
                    { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.BUSINESS'), value: "business" },
                    { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.EDUCATION'), value: "education" },
                    { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.TRANSPORT'), value: "transport" },
                    { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.HEALTH'), value: "health" },
                    { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.AGRICULTURE'), value: "agriculture" },
                  ]
                }
                placeholder={translationService(currentLanguage,'LAW.ADD.FORM.SECTORS_OF_ACTIVITY')}
              />
            </div>

            {/*products_or_services_concerned*/}
            <div className="col-span-2">
              <label htmlFor="products_or_services_concerned">{translationService(currentLanguage,'LAW.ADD.FORM.PRODUCTS_OR_SERVICES_CONCERNED')}</label>
              <Chips name="products_or_services_concerned"
                     id="products_or_services_concerned"
                     placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.PRODUCTS_OR_SERVICES_CONCERNED')}
                     value={formValues.products_or_services_concerned.value}
                     className="w-full"
                     onChange={handleChange} />
            </div>

            {/*purpose_and_scope_of_text*/}
            <div className="col-span-2">
              <label htmlFor="purpose_and_scope_of_text">{translationService(currentLanguage,'LAW.ADD.FORM.PURPOSE_AND_SCOPE_OF_TEXT')}</label>
              <Editor value={formValues.purpose_and_scope_of_text.value}
                      name="purpose_and_scope_of_text"
                      placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.PURPOSE_AND_SCOPE_OF_TEXT')}
                      className="w-full"
                      id="purpose_and_scope_of_text"
                      onTextChange={handleEditor("purpose_and_scope_of_text")} style={{ height: '100px' }} />
            </div>

          </div>

          <br/>
          {/*submit btn*/}
          <div className="w-full flex items-center justify-between">
            <Button disabled={loader} size='small'
                    severity='warning' icon='pi pi-arrow-right'
                    label={translationService(currentLanguage,'BUTTON.NEXT')} className="px-6 py-4 text-center rounded-md"
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveIndex(1);
                    }
            } />

          </div>
        </form>
      </section>
      <section hidden={activeIndex !== 1}>
        {/*Exigences*/}
        <div className="col-span-2">
          <div>
            <label htmlFor="exigences">{translationService(currentLanguage,'LAW.ADD.FORM.REQUIREMENTS')}</label>
            <Editor value={formValues.requirements.value}
                    name="requirements"
                    placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.REQUIREMENTS')}
                    className="w-full"
                    id="exigences"
                    onTextChange={handleEditor("requirements")} style={{ height: '200px' }} />
            <br/>
            <Button onClick={addRequirements} size="small" label="Ajouter un exigence" icon="pi pi-plus" />
          <div className=''>
            {
              requirements.length ? (
                <DataTable size="small" tableStyle={{ width: '100%' }} value={requirements} showGridlines>
                  <Column field={"id"} style={{ width: 20 }}
                          header="Nō"/>
                  <Column field={"name"}
                          body={requirementsBodyTemplate}
                          header="Exigences"/>
                  <Column field={"Actions"}
                          style={{ width: 20 }}

                          body={(data) => {
                            return <div className="flex justify-end items-center gap-2 text-xl">
                            <i onClick={(e) => {
                              removeRequirements(e, data?.id);
                            }}
                               className='pi p-2 rounded-md pi-trash border bg-red-100 border-red-500 text-red-500 cursor-pointer'></i>
                        </div>
                          }

                          }
                          header="Actions"/>

                </DataTable>
              ) : null
            }

          </div>
          </div>

          <br/>
          <hr/>
          <br/>
          {/*submit btn*/}
          <div className="w-full flex items-center justify-between">
            <Button disabled={loader} size='small' severity='warning'
                    icon={`pi ${loader ? 'pi-spin pi-spinner': 'pi-check'}`}
                    label={translationService(currentLanguage,'REGISTRATION.BUTTON.SUBMIT')}
                    className={`px-6 py-4 text-center rounded-md ${loader?'submit':''}`}
                    onClick={(e)=>handleSubmission(e, false)} />
            <Button icon='pi pi-wrench' size='small' label={translationService(currentLanguage,'LAW.ADD.FORM.ANALYSE_TEXT')}  className='py-4 px-6 p-button-primary text-center rounded-md' onClick={(e) => {
              handleSubmission(e, true);
            }} />
          </div>
        </div>
      </section>
    </div>
  )
}
