import React, { useState } from "react";
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
import { InputNumber } from 'primereact/inputnumber';
import { fetchActions } from '../../../services/actions.service';
import { InputSwitch } from 'primereact/inputswitch';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { LocalStore } from '../../../utils/storage.utils';

const initialFormState = {
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
  action_plans: {
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
  const [actions, setActions] = useState<any[]>([]);

  const { dispatch } = useLawContext();

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  React.useEffect(() => {
    (async()=>{
      // Fetch Actions
      const data = await fetchActions();
      setActions(data);
    })()

  }, []);

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
    console.log(e, name);
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

  const handleSubmission = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setLoader(true);

    let formData: Record<string, any>={};
    Object.entries(formValues).forEach(([key, value]) => {
      formData[key] = value?.value;
    });

    const draftLaw = LocalStore.get("LAW_DRAFT");

   if(draftLaw.length){
     const data = draftLaw.find((law: any) => law.id === Number(id));
     data["text_analysis"]=formData;
     draftLaw[data.id - 1] = data;
     LocalStore.set("LAW_DRAFT", draftLaw);
     navigate("review");
   }
  };

  // Construct add form
  const addForm = () => {
    return (
      <form className="w-full">
        <div className="form-elements grid md:grid-cols-2 gap-6">

          {/*requirements*/}
          <div className="col-span-2">
            <label htmlFor="requirements">{translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.REQUIREMENTS')}</label>
            <Editor value={formValues.requirements.value}
                    name="requirements"
                    placeholder={translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PLACEHOLDER.REQUIREMENTS')}
                    className="w-full"
                    id="requirements"
                    onTextChange={handleEditor("requirements")} style={{ height: '100px' }} />
          </div>

          {/*applicability*/}
          <div>
            <label htmlFor="applicability">{translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.APPLICABILITY')}</label>
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
              placeholder={translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PLACEHOLDER.APPLICABILITY')}
              className="w-full md:w-14rem"
            />
          </div>

          {/*process_management*/}
          <div>
            <label htmlFor="process_management">{translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PROCESS_MANAGEMENT')}</label>
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
              placeholder={translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PLACEHOLDER.PROCESS_MANAGEMENT')}
            />
          </div>

          {/*impact*/}
          <div>
            <label htmlFor="impact">{translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.IMPACT')}</label>
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
              placeholder={translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PLACEHOLDER.IMPACT')}
              className="w-full md:w-14rem"
            />
          </div>

          {/*nature_of_impact*/}
          <div>
            <label htmlFor="nature_of_impact">{translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.NATURE_OF_IMPACT')}</label>
            <Dropdown
              name="nature_of_impact"
              id="nature_of_impact"
              value={formValues.nature_of_impact.value}
              onChange={handleChange}
              options={
                [
                  { label: translationService(currentLanguage,'OPTIONS.WEAK'), value: "weak" },
                  { label: translationService(currentLanguage,'OPTIONS.MEDIUM'), value: "medium" },
                  { label: translationService(currentLanguage,'OPTIONS.MAJOR'), value: "major" },
                  { label: translationService(currentLanguage,'OPTIONS.CRITICAL'), value: "critical" }
                ]
              }
              placeholder={translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PLACEHOLDER.NATURE_OF_IMPACT')}
              className="w-full md:w-14rem"
            />
          </div>

          {/*expertise*/}
          <div className="col-span-2">
            <label htmlFor="expertise">{translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.EXPERTISE')}</label>
            <Editor value={formValues.expertise.value}
                    name="expertise"
                    placeholder={translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PLACEHOLDER.EXPERTISE')}
                    className="w-full"
                    id="expertise"
                    onTextChange={handleEditor("expertise")} style={{ height: '100px' }} />
          </div>

          {/*compliant*/}
          <div className="col-span-2 flex items-center flex-col justify-start">
            <label htmlFor="compliant">{translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PLACEHOLDER.COMPLIANT')}</label>
            <InputSwitch name='compliant' id='compliant' checked={formValues.compliant.value} onChange={handleChange} />
          </div>

          <div hidden={formValues.compliant.value} className='p-4 rounded-md space-y-4 col-span-2 border border-red-500 bg-red-50'>
            {/*action plan section*/}
            <div>
              <label htmlFor="actionPlan">{translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.ACTION_PLANS')}</label>
              <MultiSelect
                value={formValues.action_plans.value}
                onChange={handleChange}
                options={actions}
                id="action_plans"
                name="action_plans"
                optionLabel="theme"
                placeholder={translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PLACEHOLDER.ACTION_PLANS')}
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
              />
            </div>

            {/*conformity_cost*/}
            <div className="w-full flex flex-col form-control">
              <label htmlFor="conformity_cost">{translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.CONFORMITY_COST')}</label>
                 <InputNumber
                        id="conformity_cost"
                        type="text"
                        name="conformity_cost"
                        value={formValues.conformity_cost.value}
                        placeholder={translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PLACEHOLDER.CONFORMITY_COST')}
                        className="w-full"
                        onValueChange={handleChange}
                 />
            </div>

            {/*conformity_deadline*/}
            <div>
              <label htmlFor="conformity_deadline">{translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.CONFORMITY_DEADLINE')}</label>
              <InputText
                value={formValues.conformity_deadline.value}
                id="conformity_deadline"
                onChange={handleChange}
                name="conformity_deadline"
                placeholder={translationService(currentLanguage,'LAW.ANALYSE_TEXT.FORM.PLACEHOLDER.CONFORMITY_DEADLINE')}
                className="w-full"
              />
            </div>
          </div>

        </div>

        <br/>
        {/*submit btn*/}
        <div className="w-full flex items-center justify-between">
          {/*<Button disabled={loader} size='small' severity='warning' icon={`pi ${loader ? 'pi-spin pi-spinner': 'pi-check'}`} label={translationService(currentLanguage,'REGISTRATION.BUTTON.SUBMIT')} className={`px-6 py-4 text-center rounded-md ${loader?'submit':''}`} onClick={()=>{}} />*/}
          <Button icon={`pi pi-${formValues.compliant.value?'check':'times'}`} size='small' label={translationService(currentLanguage,'LAW.ANALYSE_TEXT.REVIEW')} className={`py-4 w-full px-6 text-center rounded-md ${formValues.compliant.value?'conformity':'not-conformed'}`} onClick={(e)=>{
            e.preventDefault()
            handleSubmission(e);
          }} />
        </div>
      </form>
    );
  };

  return (
    <section>
      <div className="sm:w-8/12  m-auto w-full">
        <h1 className="text-2xl font-medium py-4 border-b my-6">{translationService(currentLanguage,'LAW.ADD.FORM.ANALYSE_TEXT')}</h1>
        {addForm()}
      </div>
    </section>
  );
}
