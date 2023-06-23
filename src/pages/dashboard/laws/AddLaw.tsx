import React, { useRef, useState } from 'react';
import { ProgressSpinner } from "primereact/progressspinner";
import useLawContext from "../../../hooks/useLawContext";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import "./law.scss";
import { ILaws } from "../../../interfaces/laws.interface";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Editor } from 'primereact/editor';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { Dialog } from 'primereact/dialog';
import TextAnalysis from './TextAnalysis';
import { LocalStore } from '../../../utils/storage.utils';
import { useNavigate, useNavigation } from 'react-router-dom';
import { LawActionTypes } from '../../../store/action-types/laws.actions';
import { createLaw } from '../../../services/laws.service';
import { Toast } from 'primereact/toast';
//
// const titles = [
//   { label: "Convention", value: "convention" },
//   { label: "Law", value: "law" },
//   { label: "Decree", value: "decree" },
//   { label: "Order", value: "order" },
//   { label: "Decisions", value: "decisions" }
// ];
//
// const locations = [
//   { label: "International", value: "international" },
//   { label: "Continental", value: "continental" },
//   { label: "National", value: "national" },
// ];
//
// const complianceObject = [
//   { label: "Compliant", value: "complaint" },
//   { label: "Non compliant", value: "non_compliant" },
//   { label: "In progress", value: "in_progress" },
// ];
//
// const decisionsObject = [
//   { label: "Informative", value: "informative" },
//   { label: "Administrative", value: "administrative" },
//   { label: "Financial", value: "financial" },
// ];
//
// const domainsOptions = [
//   {
//     label: "Air",
//     value: "air",
//   },
//   { label: "Land", value: "land" },
//   { label: "Water", value: "water" },
//   { label: "Environment", value: "environment" },
//   { label: "Business", value: "business" },
//   { label: "Education", value: "education" },
//   { label: "Transport", value: "transport" },
//   { label: "Health", value: "health" },
//   { label: "Agriculture", value: "agriculture" },
// ];
//
// const applicability = [
//   {
//     label: "Applicable",
//     value: "applicable",
//   },
//   {
//     label: "Non Applicable",
//     value: "non_applicable",
//   },
//   {
//     label: "Informative",
//     value: "informative",
//   },
// ];
//
// const severity = [
//   {
//     label: "Low",
//     value: "low",
//   },
//   {
//     label: "Medium",
//     value: "medium",
//   },
//   {
//     label: "High",
//     value: "high",
//   },
// ];

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
    value: "",
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
};

function AddLaw(props: { close: Function }) {
  const [formValues, setFormValues] =
    useState<Record<string, any>>(initialFormState);

  const navigate = useNavigate();

  const { dispatch } = useLawContext();

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  const [loader, setLoader] = useState(false);

  const toast = useRef<Toast>(null);

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

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
    return formData;
  }, [formValues])

  const handleAnalysis = (e:any) => {
    e.preventDefault();
    e.stopPropagation();

    const draftData = LocalStore.get("LAW_DRAFT");

    if(!draftData){
      formData["id"]=1;
      LocalStore.set("LAW_DRAFT", [formData]);
    } else {
      formData["id"]=draftData.length;
      LocalStore.set("LAW_DRAFT", [...draftData, formData]);
    }

    navigate(`/dashboard/laws/analysis/${formData.id}`);
  }

  const handleSubmission = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setLoader(true);

    createLaw(formData).then(res => {
      if(res){
        toast?.current?.show({ severity: 'success', summary: 'Success', detail: translationService(currentLanguage,'TOAST.SUCCESSFUL_ACTION') });
        props.close();
      }
    })

  };

  // Construct add form
  const addForm = () => {
    return (
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
                  { label: translationService(currentLanguage,'LAW.ADD.FORM.TITLE.CONVENTION'), value: "convention" },
                  { label: translationService(currentLanguage,'LAW.ADD.FORM.TITLE.LAW'), value: "law" },
                  { label: translationService(currentLanguage,'LAW.ADD.FORM.TITLE.DECREE'), value: "decree" },
                  { label: translationService(currentLanguage,'LAW.ADD.FORM.TITLE.ORDER'), value: "order" },
                  { label: translationService(currentLanguage,'LAW.ADD.FORM.TITLE.DECISION'), value: "decisions" }
                ]
              }
              placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.TYPE_OF_TEXT')}
              className="w-full md:w-14rem"
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
            <InputText
              value={formValues.parent_of_text.value}
              id="parent_of_text"
              onChange={handleChange}
              name="parent_of_text"
              placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.PARENT_OF_TEXT')}
              className="w-full"
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
            <Editor value={formValues.products_or_services_concerned.value}
                    name="products_or_services_concerned"
                    placeholder={translationService(currentLanguage,'LAW.ADD.FORM.PLACEHOLDER.PRODUCTS_OR_SERVICES_CONCERNED')}
                    className="w-full"
                    id="products_or_services_concerned"
                    onTextChange={handleEditor("products_or_services_concerned")} style={{ height: '100px' }} />
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
          <Button disabled={loader} size='small' severity='warning' icon={`pi ${loader ? 'pi-spin pi-spinner': 'pi-check'}`} label={translationService(currentLanguage,'REGISTRATION.BUTTON.SUBMIT')} className={`px-6 py-4 text-center rounded-md ${loader?'submit':''}`} onClick={handleSubmission} />
          <Button icon='pi pi-wrench' size='small' label={translationService(currentLanguage,'LAW.ADD.FORM.ANALYSE_TEXT')}  className='py-4 px-6 text-center rounded-md' onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAnalysis(e);
          }} />
        </div>
      </form>
    );
  };

  return (
    <section>
      {addForm()}
    </section>
  );
}

export default AddLaw;
