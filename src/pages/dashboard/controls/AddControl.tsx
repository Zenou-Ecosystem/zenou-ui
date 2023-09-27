import React, { useEffect, useRef, useState } from 'react';
import Button from "../../../core/Button/Button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { fetchLaws } from "../../../services/laws.service";
import { Chips } from 'primereact/chips';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { createControl } from '../../../services/control.service';
import { Toast } from 'primereact/toast';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { MultiSelect } from 'primereact/multiselect';
import { initialState } from '../../../store/state';
import { useSelector, useDispatch } from 'react-redux';
import httpHandlerService from '../../../services/httpHandler.service';
import { ActionsActionTypes, IActionActions } from '../../../store/action-types/action.actions';
import { ControlActionTypes, IControlActions } from '../../../store/action-types/control.actions';
import { Dispatch } from 'redux';

let initialFormState = {
  type: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  duration: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  theme: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  department: {
    value: [],
    error: true,
    error_message: "",
    required: true,
  },
  responsible_for: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
  resources: {
    value: [],
    error: true,
    error_message: "",
    required: true,
  },
  evaluation_criteria: {
    value: [],
    error: true,
    error_message: "",
    required: true,
  },
  proof_of_success: {
    value: [],
    error: true,
    error_message: "",
    required: true,
  },
  text_of_the_law: {
    value: [],
    error: true,
    error_message: "",
    required: true,
  },
  action_plan: {
    value: "",
    error: true,
    error_message: "",
    required: true,
  },
};

export default function AddControl(props: {hideAction: Function, stateGetter: Function}) {
  const [formValues, setFormValues] = React.useState<Record<string, any>>(initialFormState);
  const laws = useSelector((state: typeof initialState) => state.laws);
  const dispatch = useDispatch<Dispatch<IControlActions>>()

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), []);

  let formData: any = () => {
    let formData: any = {};
    Object.entries(formValues).forEach(([key, value]) => {
      formData[key] =
        key === "duration"
          ? new Date(String(value.value)).toLocaleDateString()
          : value?.value;
    });
    return formData;
  }

  const handleSubmission = () => {
    dispatch(
      httpHandlerService({
        endpoint: 'controls',
        method: 'POST',
        data: formData(),
        showModalAfterRequest: true,
      }, ControlActionTypes.ADD_CONTROL) as any
    );
    props.hideAction();
    // createControl(formData() as any).then(() => {
    //   toast?.current?.show({ severity: 'success', summary: 'Success', detail: 'Action Reussi' });
    //   props.stateGetter()
    // }).catch(() =>toast?.current?.show({ severity: 'success', summary: 'Success', detail: 'Action Reussi' })
    // ).finally(() => props?.hideAction());
  };

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

  const addForm = () => {
    return (
      <form className="w-full">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">

          {/*type*/}
          <div className="control-type">
            <label htmlFor="type">{translationService(currentLanguage,'FORM.TYPE')}</label>
            <InputText
              value={formValues.type.value}
              id="type"
              onChange={handleChange}
              name="type"
              placeholder={translationService(currentLanguage,'FORM.PLACEHOLDER.TYPE')}
              className="w-full"
            />
          </div>

          {/*responsible for*/}
          <div className="control-responsibleFor">

            <label htmlFor="responsible_for">{translationService(currentLanguage,'FORM.RESPONSIBLE_FOR')}</label>
            <InputText
              value={formValues.responsible_for.value}
              id="responsible_for"
              onChange={handleChange}
              name="responsible_for"
              placeholder={translationService(currentLanguage,'FORM.PLACEHOLDER.RESPONSIBLE_FOR')}
              className="w-full"
            />
          </div>

          {/*resources*/}
          <div className="col-span-2">
            <label htmlFor="resources">{translationService(currentLanguage,'FORM.RESOURCES')}</label>
            <Chips name="resources"
                   id="resources"
                   value={formValues.resources.value}
                   className="w-full"
                   placeholder={translationService(currentLanguage,'FORM.PLACEHOLDER.RESOURCES')}
                   onChange={handleChange} />
            <small className="text-gray-500">{translationService(currentLanguage,'FORM.CHIP.HINT')}</small>
          </div>

          {/*evaluation*/}
          <div className="col-span-2">
            <label htmlFor="evaluation_criteria">{translationService(currentLanguage,'FORM.PLACEHOLDER.EVALUATION_CRITERIA')}</label>
            <Chips
              value={formValues.evaluation_criteria.value}
              id="evaluation_criteria"
              onChange={handleChange}
              name="evaluation_criteria"
              placeholder={translationService(currentLanguage,'FORM.PLACEHOLDER.EVALUATION_CRITERIA')}
              className="w-full"
            />
            <small className="text-gray-500">{translationService(currentLanguage,'FORM.CHIP.HINT')}</small>
          </div>

          {/*duration*/}
          <div className="control-Duration">
            <label htmlFor="duration">{translationService(currentLanguage,'FORM.DURATION')}</label>
            <Calendar
              name="duration"
              id="duration"
              placeholder={translationService(currentLanguage,'FORM.PLACEHOLDER.DURATION')}
              className="w-full"
              showIcon
              value={formValues.duration.value}
              onChange={handleChange}
            />
          </div>

          {/*theme*/}
          <div>
            <label htmlFor="theme">{translationService(currentLanguage,'FORM.THEME')}</label>
            <InputText
              value={formValues.theme.value}
              id="theme"
              onChange={handleChange}
              name="theme"
              placeholder={translationService(currentLanguage,'FORM.THEME')}
              className="w-full"
            />
          </div>

          {/*proof of success*/}
          <div className="col-span-2">
            <label htmlFor="proof_of_success">{translationService(currentLanguage,'FORM.PROOF_OF_SUCCESS')}</label>
            <Chips
              value={formValues.proof_of_success.value}
              id="proof_of_success"
              onChange={handleChange}
              name="proof_of_success"
              placeholder={translationService(currentLanguage,'FORM.PLACEHOLDER.PROOF_OF_SUCCESS')}
              className="w-full"
            />
            <small className="text-gray-500">{translationService(currentLanguage,'FORM.CHIP.HINT')}</small>
          </div>

          {/*department*/}
          <div className="col-span-2">
            <label htmlFor="department">{translationService(currentLanguage,'FORM.DEPARTMENT')}</label>
            <Chips
              value={formValues.department.value}
              id="department"
              onChange={handleChange}
              name="department"
              placeholder={translationService(currentLanguage,'FORM.PLACEHOLDER.DEPARTMENT')}
              className="w-full"
            />
            <small className="text-gray-500">{translationService(currentLanguage,'FORM.CHIP.HINT')}</small>
          </div>

          {/*action plan section*/}
          <div>
            <label htmlFor="action_plan">{translationService(currentLanguage,'FORM.ACTION_PLAN')}</label>
            <InputNumber
              value={formValues.action_plan.value}
              id="action_plan"
              type="text"
              name="action_plan"
              placeholder={translationService(currentLanguage,'FORM.ACTION_PLAN')}
              onValueChange={handleChange}
              className='w-full'
            />
          </div>

          {/*text of law*/}
          <div className=''>
            <label htmlFor="text_of_the_law">{translationService(currentLanguage,'FORM.TEXT_OF_THE_LAW')}</label>
            <MultiSelect
              value={formValues.text_of_the_law.value}
              onChange={handleChange}
              id="text_of_the_law"
              filter
              name="text_of_the_law"
              optionLabel="title_of_text"
              placeholder={translationService(currentLanguage,'FORM.PLACEHOLDER.TEXT_OF_THE_LAW')}
              className="w-full"
              options={laws || []}
              defaultValue={formValues.text_of_the_law.value}
              selectedItemTemplate={(options: any) => options?.title_of_text ?
                <span className='text-xs mr-2 text-white rounded-md addTextToAnalysisTable p-1 w-20'>
                    {options?.title_of_text?.slice(0,10)}
                  </span>:
                translationService(currentLanguage,'FORM.PLACEHOLDER.TEXT_OF_THE_LAW')}
              itemTemplate={(options) => options?.title_of_text?.slice(0,40) + "..."}
            />
          </div>
        </div>

        {/*submit button*/}
        <div className="w-full my-4 py-2">
          <Button title="Créer un nouveau contrôle"
                  styles="flex-row-reverse font-light text-xs float-right px-6 py-3 items-center rounded-md"
                  onClick={handleSubmission}
          />
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

