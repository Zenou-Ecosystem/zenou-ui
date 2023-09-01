import React, { useRef, useState } from 'react';
import { ProgressSpinner } from "primereact/progressspinner";
import useLawContext from "../../../hooks/useLawContext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import "./law.scss";
import { ILaws } from "../../../interfaces/laws.interface";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Editor } from 'primereact/editor';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { InputNumber } from 'primereact/inputnumber';
import { fetchActions } from '../../../services/actions.service';
import { InputSwitch } from 'primereact/inputswitch';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { LocalStore } from '../../../utils/storage.utils';
import AddLaw from './AddLaw';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import FileUploadComponent from '../../../core/FileUpload';

const initialFormState:any = {
  requirements: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  applicability: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  process_management: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  impact: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  nature_of_impact: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  expertise: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  compliant: {
    value: false,
    error: true,
    error_message: "",
    required: true,
  },
  action_plans: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  conformity_cost: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  conformity_deadline: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
};

export default function TextAnalysis() {

  const [formValues, setFormValues] =
    useState<Record<string, any>>(initialFormState);

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  const [visible, setVisible] = useState(false);

  const draftLaw = React.useMemo(() => {
    let storeData = LocalStore.get('EDIT_DATA');

    return { storeData, currentLawData: '' };
  }, []);

  const [analysedText, setAnalysedText] = React.useState<any[]>(draftLaw?.storeData?.text_analysis || []);

  React.useMemo(() => currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  const [formState, setFormState] = React.useState('create');

  const toast = React.useRef({});

  /**
   * description: handle change function. this function is used to handle on change events in an input field
   * default form state
   * @returns { void }
   * **/
  const handleChange = (e: any) => {
    let { name, value, type }: Record<any, string> = e.target;

    type === "checkbox" && (value = e.checked);

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

    let currentValue = {
      ...formValues,
      [name]: {
        ...formValues[name],
        value,
        error,
      },
    }

    if (name === "compliant" && value) {

      const initialValue = {
        value: "",
        error: true,
        error_message: "",
        required: true,
      };
      currentValue['action_plans'] = initialValue;
      currentValue["conformity_cost"] = initialValue;
      currentValue["conformity_deadline"] = initialValue;

    }

    setFormValues(currentValue);

  };


  const handleEditor = (name: string) => (e: any) => {
    setFormValues((prevState) => {
      return {
        ...prevState,
        [name]: {
          ...formValues[name],
          value: e?.htmlValue
        },
      }
    });
  }

  const handleSubmission = (e: any, edit?: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    setLoader(true);

    let formData: Record<string, any> = {
      proof_of_conformity: LocalStore.get("UPLOADED_FILES")
    };

    Object.entries(formValues).forEach(([key, value]) => {
      formData[key] = value?.value;
    });

    const lawData = draftLaw?.storeData

    if (lawData) {

      if ("text_analysis" in lawData && !edit) lawData["text_analysis"]?.push(formData)
      if (!edit && !lawData?.text_analysis) (lawData["text_analysis"] = [formData]);

      draftLaw.storeData = edit ? editForm(formData) : lawData;

      LocalStore.set("EDIT_DATA", draftLaw.storeData);

      addToAnalysedText(formData, edit);

      setFormValues(initialFormState);

      setVisible(false);

      LocalStore.remove("UPLOADED_FILES");

      // navigate("review");
    }
  };

  const addToAnalysedText = (value: Record<string, string | boolean | number>, edit?: boolean) => {

    setAnalysedText(prevState => {
      return draftLaw.storeData.text_analysis;
    });
  };


  const alertConfirmationDialog = () => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: 'Delete Confirmation',
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => removeFromAnalysedText(),
      reject,
    });
  }

  const reject = () => {
    (toast.current as any).show({
      severity: "warn",
      summary: "Rejected",
      detail: "Record not deleted",
      life: 3000,
    });
  };

  const removeFromAnalysedText = () => {
    const index = LocalStore.get("DELETE_DATA")?.index;
    let textAnalysis = draftLaw.storeData.text_analysis as Array<any>;

    draftLaw.storeData['text_analysis'] = textAnalysis.filter((x, idx) => idx !== index );

    // draftLaw.storeData = draftLaw.currentLawData;

    (toast.current as any).show({
      severity: "info",
      summary: "Confirmed",
      detail: "Record successfully deleted",
      life: 3000,
    });

    setAnalysedText(draftLaw.storeData['text_analysis']);

    LocalStore.set("EDIT_DATA", draftLaw.storeData);

    LocalStore.remove("DELETE_DATA");
  }

  // Construct add form
  const addForm = () => {
    return (
      <form className="w-full">
        <div className="form-elements grid md:grid-cols-2 gap-6">

          {/*requirements*/}
          <div className="col-span-2">
            <label htmlFor="requirements">{translationService(currentLanguage,'LAW.ADD.FORM.REQUIREMENTS')}</label>
            <Dropdown
              value={formValues.requirements.value}
              name="requirements"
              placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.REQUIREMENTS')}
              className="w-full"
              id="requirements"
              onChange={handleChange}
              optionLabel="name"
              filter
              valueTemplate={(options) => options?.name ? <div className="py-0.5" dangerouslySetInnerHTML={{ __html: options?.name?.slice(0,100) + "..." }}></div> : translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.REQUIREMENTS')}
              options={draftLaw.storeData?.requirements ?? []}
              itemTemplate={(options) => {
                return <div dangerouslySetInnerHTML={{ __html: options?.name?.slice(0, 90)+"..." }}></div>
              }}
            />
            {/*<InputText*/}
            {/*  value={formValues.requirements.value}*/}
            {/*  name="requirements"*/}
            {/*  placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.REQUIREMENTS')}*/}
            {/*  className="w-full"*/}
            {/*  id="requirements"*/}
            {/*  onChange={handleChange}*/}
            {/*/>*/}
           </div>

          {/*applicability*/}
          <div>
            <label htmlFor="applicability">{translationService(currentLanguage,'LAW.ADD.FORM.APPLICABILITY')}</label>
            <Dropdown
              name="applicability"
              id="applicability"
              value={formValues.applicability.value}
              onChange={handleChange}
              options={
                [
                  { label: translationService(currentLanguage,'OPTIONS.YES'), value: "yes" },
                  { label: translationService(currentLanguage,'OPTIONS.NO'), value: "no" },
                  { label: translationService(currentLanguage,'OPTIONS.INFORMATION'), value: "information" }
                ]
              }
              placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.APPLICABILITY')}
              className="w-full md:w-14rem"
            />
          </div>

          {/*process_management*/}
          <div>
            <label htmlFor="process_management">{translationService(currentLanguage,'LAW.ADD.FORM.PROCESS_MANAGEMENT')}</label>
            <MultiSelect
              filter
              id="process_management"
              name="process_management"
              value={formValues.process_management.value}
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
              placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.PROCESS_MANAGEMENT')}
            />
          </div>

          {/*impact*/}
          <div>
            <label htmlFor="impact">{translationService(currentLanguage,'LAW.ADD.FORM.IMPACT')}</label>
            <Dropdown
              name="impact"
              id="impact"
              value={formValues.impact.value}
              onChange={handleChange}
              options={
                [
                  { label: translationService(currentLanguage,'OPTIONS.WEAK'), value: "weak" },
                  { label: translationService(currentLanguage,'OPTIONS.MEDIUM'), value: "medium" },
                  { label: translationService(currentLanguage,'OPTIONS.MAJOR'), value: "major" },
                  { label: translationService(currentLanguage,'OPTIONS.CRITICAL'), value: "critical" }
                ]
              }
              placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.IMPACT')}
              className="w-full md:w-14rem"
            />
          </div>

          {/*nature_of_impact*/}
          <div>
            <label htmlFor="nature_of_impact">{translationService(currentLanguage,'LAW.ADD.FORM.NATURE_OF_IMPACT')}</label>
            <Dropdown
              name="nature_of_impact"
              id="nature_of_impact"
              value={formValues.nature_of_impact.value}
              onChange={handleChange}
              options={
                [
                  { label: translationService(currentLanguage,'OPTIONS.FINANCIAL'), value: "financial" },
                  { label: translationService(currentLanguage,'OPTIONS.ORGANISATION'), value: "organisation" },
                  { label: translationService(currentLanguage,'OPTIONS.PRODUCTS'), value: "products" },
                  { label: translationService(currentLanguage,'OPTIONS.IMAGE'), value: "image" }
                ]
              }
              placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.NATURE_OF_IMPACT')}
              className="w-full md:w-14rem"
            />
          </div>

          {/*expertise*/}
          <div className="col-span-2">
            <label htmlFor="expertise">{translationService(currentLanguage,'LAW.ADD.FORM.EXPERTISE')}</label>
            <Editor value={formValues.expertise.value}
                    name="expertise"
                    placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.EXPERTISE')}
                    className="w-full"
                    id="expertise"
                    onTextChange={handleEditor("expertise")} style={{ height: '100px' }} />
          </div>

          {/*compliant*/}
          <div className="col-span-2 flex items-center flex-col justify-start">
            <label htmlFor="compliant">{translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.COMPLIANT')}</label>
            <InputSwitch name='compliant' id='compliant' checked={formValues.compliant.value} onChange={handleChange} />
          </div>

          <div hidden={formValues.compliant.value} className='p-4 rounded-md col-span-2 border border-red-500 bg-red-50'>
            <div className='gap-4 grid grid-cols-2'>
              {/*action plan section*/}
              <div className="w-full flex flex-col col-span-2 form-control">
                <label htmlFor="actionPlan">{translationService(currentLanguage,'LAW.ADD.FORM.ACTION_PLAN_NUMBER')}</label>
                <InputNumber
                  value={formValues.action_plans.value}
                  id="action_plans"
                  type="text"
                  name="action_plans"
                  placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.ACTION_PLAN_NUMBER')}className="w-full"
                  onValueChange={handleChange}
                />
              </div>

              {/*conformity_cost*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="conformity_cost">{translationService(currentLanguage,'LAW.ADD.FORM.CONFORMITY_COST')}</label>
                   <InputNumber
                          id="conformity_cost"
                          type="text"
                          name="conformity_cost"
                          value={formValues.conformity_cost.value}
                          placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.CONFORMITY_COST')}
                          className="w-full"
                          onValueChange={handleChange}
                   />
              </div>

              {/*conformity_deadline*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="conformity_deadline">{translationService(currentLanguage,'LAW.ADD.FORM.CONFORMITY_DEADLINE')}</label>
                <InputText
                  value={formValues.conformity_deadline.value}
                  id="conformity_deadline"
                  onChange={handleChange}
                  name="conformity_deadline"
                  placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.CONFORMITY_DEADLINE')}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div  hidden={!formValues.compliant.value} className='col-span-2 p-4 border border-green-500 rounded-md'>
            <span className='mb-2'>{translationService(currentLanguage,'LABEL.PROOF')}</span>
            <div hidden={!LocalStore.get("EDIT_DATA")?.data?.proof_of_conformity}>
              {
                <ul>
                  {
                    LocalStore.get("EDIT_DATA")?.data?.proof_of_conformity ? (LocalStore.get("EDIT_DATA")?.data?.proof_of_conformity).map((item: { data: {img_url:string, name:string} }, index:number) => {
                      return (
                        <li key={index} className="p-1 my-2 flex items-center gap-4">
                          <p className='truncate w-72'>
                            <a href={item.data?.img_url} className='underline text-blue-500'>{item.data?.name}</a>
                          </p>
                          {/*<button><i className='pi pi-times-circle text-red-500'></i></button>*/}
                        </li>
                      )
                    }) : ''
                  }
                </ul>
              }
            </div>
            <FileUploadComponent />
          </div>

        </div>

        <br/>
        {/*submit btn*/}
        <div className="w-full flex items-center justify-between">
          {/*<Button disabled={loader} size='small' severity='warning' icon={`pi ${loader ? 'pi-spin pi-spinner': 'pi-check'}`} label={translationService(currentLanguage,'REGISTRATION.BUTTON.SUBMIT')} className={`px-6 py-4 text-center rounded-md ${loader?'submit':''}`} onClick={()=>{}} />*/}
          <Button icon={`pi pi-${formValues.compliant.value?'check':'times'}`} size='small'
                  label={translationService(currentLanguage,`LAW.ADD.${formState === 'edit' ? 'EDIT' :'REVIEW'}`)}
                  className={`py-4 w-full px-6 text-center rounded-md ${formValues.compliant.value?'conformity':'not-conformed'}`} onClick={(e)=>{
            e.preventDefault()
            handleSubmission(e, formState === 'edit');
          }} />
        </div>
      </form>
    );
  };

  const applicableBodyTemplate = (key:string) => (rowData:any) => {
    return <Tag value={translationService(currentLanguage,`OPTIONS.${rowData[key].toString().toUpperCase()}`)} severity={['yes', 'true'].includes(rowData[key].toString()) ? 'success' : ['no', 'critical', 'weak', 'false'].includes(rowData[key].toString()) ? 'danger': ['medium'].includes(rowData[key].toString())? 'warning': 'info'} />;
  };

  const expertiseTemplate = (rowData: any) => {
    return <div className='truncate w-72' dangerouslySetInnerHTML={{ __html: rowData.expertise }}></div>
  }

  const requirementsTemplate = (rowData: any) => {
    return <div className='truncate w-72' dangerouslySetInnerHTML={{ __html: rowData?.requirements?.name.slice(0, 60)+"..." }}></div>
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

  const onRowClick = (e:any) => {
    if("originalEvent" in e){
     let context = e.originalEvent.target.title;

     switch (true) {
       case context === 'edit':
         setFormState('edit')
         LocalStore.set("CURRENT_EDIT_DATA", {data: e.data, index: e.index})
         editFunction(e.data, e.index);
         break;
       case context === 'delete':
         LocalStore.set("DELETE_DATA", {data: e.data, index: e.index});
         alertConfirmationDialog();
     }
    }
  }

  const editFunction = (data: Record<string, any>, index:number) => {
    let newFormState: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      if(value !== undefined){
        newFormState[key] = { value, error: false, required: true }
      }
    });

    newFormState['editForm'] = true;

    setFormValues(newFormState);

    setVisible(true);
  }

  const editForm = (formData:Record<string, any>) => {

    const index = LocalStore.get("CURRENT_EDIT_DATA")?.index;

    draftLaw.storeData["text_analysis"][index] = formData;

    console.log(index, draftLaw.storeData);

    LocalStore.remove("CURRENT_EDIT_DATA");

    return draftLaw.storeData;
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
    <section className="px-4 w-full">
      <Toast ref={toast as any} />
      <ConfirmDialog />

      <div className="flex justify-between items-center py-2 border-b my-2">
        <h1 className="text-2xl font-medium">{translationService(currentLanguage,'LAW.ADD.FORM.ANALYSE_TEXT')}</h1>
        <Button onClick={(e)=> {
          e.preventDefault();
          setVisible(true);
        }} className="addTextToAnalysisTable" label={translationService(currentLanguage,'BUTTON.ADD')} icon="pi pi-plus" size='small' />
      </div>

      <div className='w-full'>
        <DataTable onRowClick={onRowClick} size="small" tableStyle={{ width: '100%' }} value={analysedText} showGridlines>
          {
            [...Object.keys(initialFormState),'proof_of_conformity'].map((item, index) =>
              <Column key={item} field={item}
                      body={
                ['requirements'].includes(item) ? requirementsTemplate:
                ['applicability', 'impact', 'nature_of_impact', 'compliant'].includes(item)
                  ?applicableBodyTemplate(item)
                  : ['expertise'].includes(item)? expertiseTemplate
                    : ['action_plans', 'conformity_cost', 'conformity_deadline'].includes(item)
                      ? actionPlanTemplate(item)
                      : ['proof_of_conformity'].includes(item)? proofBodyTemplate : ['process_management'].includes(item) ? servicesBodyTemplate : ''} header={translationService(currentLanguage,`LAW.ADD.FORM.${item.toString().toUpperCase()}`)}></Column>)
          }
          <Column  style={{ width: '10px' }} body={
            <div className='flex gap-4'>
                {/*<i className='pi pi-eye text-blue-500 cursor-pointer' title='view'></i>*/}
                <i className='pi pi-pencil text-green-500 cursor-pointer' title='edit'></i>
                <i className='pi pi-trash text-red-500 cursor-pointer' title='delete'></i>
            </div>
          } header="Actions">
          </Column>
        </DataTable>

        <br/>
        <Button severity='warning' outlined icon='pi pi-check' size='small'
                label={translationService(currentLanguage,'LAW.ADD.REVIEW')}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("review");
                }}
        />
      </div>

      <Dialog
        header={translationService(currentLanguage,'LAW.ADD.FORM.TITLE')}
        visible={visible}
        style={{ width: "800px", maxWidth: "100%" }}
        onHide={() => {
          setFormValues(initialFormState);
          LocalStore.remove("CURRENT_EDIT_DATA");
          setFormState('create')
          setVisible(false);
        }}
      >
          {addForm()}
      </Dialog>

    </section>
  );
}
