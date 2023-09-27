import React from 'react';
import Button from "../../../core/Button/Button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Chips } from 'primereact/chips';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { LocalStore } from '../../../utils/storage.utils';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { initialState } from '../../../store/state';
import { useSelector, useDispatch } from 'react-redux';
import httpHandlerService from '../../../services/httpHandler.service';
import { ActionsActionTypes, IActionActions } from '../../../store/action-types/action.actions';
import { Dispatch } from 'redux';

export default function EditAction(props: {hideAction: Function, stateGetter: Function}) {

  const editItems = LocalStore.get("EDIT_DATA");
  let initialFormState = {
    type: {
      value: editItems?.type ?? "",
      error: true,
      error_message: "",
      required: true,
    },
    duration: {
      value: new Date(editItems?.duration),
      error: true,
      error_message: "",
      required: true,
    },
    theme: {
      value: editItems?.theme,
      error: true,
      error_message: "",
      required: true,
    },
    department: {
      value: editItems?.department,
      error: true,
      error_message: "",
      required: true,
    },
    responsible_for: {
      value: editItems?.responsible_for,
      error: true,
      error_message: "",
      required: true,
    },
    resources: {
      value: editItems?.resources,
      error: true,
      error_message: "",
      required: true,
    },
    evaluation_criteria: {
      value: editItems?.evaluation_criteria,
      error: true,
      error_message: "",
      required: true,
    },
    evidence_of_actions: {
      value: editItems?.evidence_of_actions,
      error: true,
      error_message: "",
      required: true,
    },
    text_of_the_law: {
      value: editItems?.text_of_the_law,
      error: true,
      error_message: "",
      required: true,
    },
    control_plan: {
      value: editItems?.control_plan,
      error: true,
      error_message: "",
      required: true,
    },
    number: {
      value: editItems?.number,
      error: true,
      error_message: "",
      required: true,
    },
  };

  const [formValues, setFormValues] = React.useState<Record<string, any>>(initialFormState);
  const laws = useSelector((state: typeof initialState) => state.laws);

  const [currentLanguage, setCurrentLanguage] = React.useState<string>('fr');
  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  const dispatch = useDispatch<Dispatch<IActionActions>>();

  const handleSubmission = () => {
    dispatch(
      httpHandlerService({
        endpoint: 'actions',
        method: 'PATCH',
        data: formData(),
        id: editItems?.id,
        showModalAfterRequest: true,
      }, ActionsActionTypes.EDIT_ACTION) as any
    );
    props.hideAction();

    // updateAction(editItems?.id, formData() as any).then(() => {
    //   toast?.current?.show({ severity: 'success', summary: 'Success', detail: 'Action Reussi' });
    //   props.stateGetter()
    // }).catch(() => toast?.current?.show({ severity: 'error', summary: 'Erruer', detail: 'Une eurrerr cette produit' })).finally(() => {
    //   props.hideAction();
    // })
  };

  let formData: any = () => {
    let formData: Record<string, any>={};
    Object.entries(formValues).forEach(([key, value]) => {
      formData[key] =
        key === "duration"
          ? new Date(String(value.value)).toLocaleDateString()
          : value?.value;
    });
    return formData;
  }

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
            <label htmlFor="resources">Resources</label>
            <Chips name="resources"
                   id="resources"
                   value={formValues.resources.value}
                   className="w-full"
                   placeholder="Entree la liste des resources"
                   onChange={handleChange} />
            <small className="text-gray-500">Saisissez et appuyez sur Entrée pour ajouter une nouvelle ressource</small>
          </div>

          {/*evaluation*/}
          <div className="col-span-2">
            <label htmlFor="evaluation_criteria">Critaire d'evaluation</label>
            <Chips
              value={formValues.evaluation_criteria.value}
              id="evaluation_criteria"
              onChange={handleChange}
              name="evaluation_criteria"
              placeholder="Entree les critaire d'evaluation"
              className="w-full"
            />
            <small className="text-gray-500">Saisissez et appuyez sur Entrée pour ajouter une nouvelle evaluation</small>
          </div>

          {/*duration*/}
          <div className="control-Duration">
            <label htmlFor="duration">Delias</label>
            <Calendar
              name="duration"
              id="duration"
              placeholder="Entre le delais"
              className="w-full"
              showIcon
              value={formValues.duration.value}
              onChange={handleChange}
            />
          </div>

          {/*theme*/}
          <div>
            <label htmlFor="theme">Theme</label>
            <InputText
              value={formValues.theme.value}
              id="theme"
              onChange={handleChange}
              name="theme"
              placeholder="Entrer le theme"
              className="w-full"
            />
          </div>

          {/*Evidence of action*/}
          <div className="">
            <label htmlFor="evidence_of_action">Evidences des action</label>
            <InputText
              value={formValues.evidence_of_actions.value}
              id="evidence_of_actions"
              onChange={handleChange}
              name="evidence_of_actions"
              placeholder="Entrer l'evidence de l'action"
              className="w-full"
            />
          </div>


          {/*Number*/}
          <div>
            <label htmlFor="number">{translationService(currentLanguage,'FORM.NUMBER')}</label>
            <InputNumber
              value={formValues.number.value}
              id="number"
              type="text"
              name="number"
              placeholder={translationService(currentLanguage,'FORM.PLACEHOLDER.NUMBER')}
              onValueChange={handleChange}
              className='w-full'
            />
          </div>

          {/*department*/}
          <div className="col-span-2">
            <label htmlFor="department">Department</label>
            <Chips
              value={formValues.department.value}
              id="department"
              onChange={handleChange}
              name="department"
              placeholder="Entrer les department"
              className="w-full"
            />
            <small className="text-gray-500">Saisissez et appuyez sur Entrée pour ajouter un departement</small>
          </div>

          {/*control plan section*/}
          <div>
            <label htmlFor="control_plan">Numeros de control</label>
            <InputNumber
              value={formValues.control_plan.value}
              id="control_plan"
              type="text"
              name="control_plan"
              placeholder="Entrer le numeros de control"
              onValueChange={handleChange}
              className='w-full'
            />
          </div>

          {/*text of law*/}
          <div className=''>
            <label htmlFor="text_of_the_law">Selectionner des texte</label>
            <MultiSelect
              filter
              value={formValues.text_of_the_law.value}
              id="text_of_the_law"
              onChange={handleChange}
              name="text_of_the_law"
              optionLabel='title_of_text'
              placeholder="Selectionner le texte"
              className="w-full md:w-14rem"
              options={laws || []}
              defaultValue={formValues.text_of_the_law.value}
              selectedItemTemplate={(options: any) => options?.title_of_text ?
                <span className='text-xs mr-2 text-white rounded-md addTextToAnalysisTable p-1 w-20'>
                    {options?.title_of_text?.slice(0,10)}
                  </span>:
                "Selectionner le texte"}
              itemTemplate={(options) => options?.title_of_text?.slice(0,40) + "..."}
            />
          </div>

        </div>

        {/*submit button*/}
        <div className="w-full my-4 py-2">
          <Button title="Modifier contrôle"
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

