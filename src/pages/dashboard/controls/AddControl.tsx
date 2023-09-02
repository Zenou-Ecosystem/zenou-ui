import React, { useEffect, useState } from "react";
import Button from "../../../core/Button/Button";
import { ProgressSpinner } from "primereact/progressspinner";
import useControlContext from "../../../hooks/useControlContext";
import { ControlActionTypes } from "../../../store/action-types/control.actions";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { fetchActions } from "../../../services/actions.service";
import { ILaws } from "../../../interfaces/laws.interface";
import { fetchLaws } from "../../../services/laws.service";
import { fetchDepartments } from "../../../services/department.service";
import { translationService } from '../../../services/translation.service';
import { Chips } from 'primereact/chips';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';


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
    value: {},
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
  // number: {
  //   value: "",
  //   error: true,
  //   error_message: "",
  //   required: true,
  // },
};

function AddControl() {
  const [formValues, setFormValues] =
    useState<Record<string, any>>(initialFormState);
  const [loader, setLoader] = useState(false);
  const { state, dispatch } = useControlContext();
  const [laws, setLaws] = useState<any[]>([]);

  // const [type, setType] = useState("");
  // const [duration, setDuration] = useState("");
  // const [theme, setTheme] = useState("");
  // const [department, setDepartment] = useState("");
  // const [resources, setResources] = useState("");
  // const [evaluation_criteria, setEvaluationCriteria] = useState("");
  // const [proof_of_success, setProofOfSuccess] = useState("");
  // const [text_of_the_law, setTextOfLaw] = useState("");
  // const [responsible_for, setResponsibleFor] = useState("");
  // const [action_plan, setActionPlan] = useState("");
  // const [departments, setDepartments] = useState<string[]>([]);
  //
  // const getType = (type: string) => setType(type);
  // const getDuration = (duration: string) => setDuration(duration);
  // const getTheme = (theme: string) => setTheme(theme);
  // const getDepartment = (department: string) => setDepartment(department);
  // const getResources = (resources: string) => setResources(resources);
  // const getEvaluationCriteria = (evaluation_criteria: string) =>
  //   setEvaluationCriteria(evaluation_criteria);
  // const getTextOfLaw = (text_of_the_law: string) =>
  //   setTextOfLaw(text_of_the_law);
  // const getActionPlan = (action_plan: string) => setActionPlan(action_plan);
  // const getResponsibleFor = (responsible_for: string) =>
  //   setResponsibleFor(responsible_for);
  // const getProofOfSuccess = (proof_of_success: string) =>
  //   setProofOfSuccess(proof_of_success);
  //
  // const [actions, setActions] = useState<any[]>([]);

  const handleSubmission = () => {
    setLoader(true);
    // console.log(formData);
    dispatch({
      type: ControlActionTypes.ADD_CONTROL,
      payload: formData,
    });
  };

  useEffect(() => {
    (async () => {
      const resolvedState = await state;
      if (resolvedState.hasCreated) {
        setLoader(false);
      }

      // Fetch Actions
      // const data = await fetchActions();
      // setActions(data);

      // let department = await fetchDepartments();
      // if (department) {
      //   setDepartments(department.map((dept) => dept.name));
      // }

      //  Fetch laws
      setLaws(await fetchLaws());
    })();
  }, [state]);

  let formData: any = React.useMemo(() => {
    let formData: Record<string, any>={};
    Object.entries(formValues).forEach(([key, value]) => {
      formData[key] =
        key === "duration"
          ? new Date(String(value.value)).toLocaleDateString()
          : value?.value;
    });
    return formData;
  }, [formValues])

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
        <div className="form-elements grid md:grid-cols-2 gap-4">

          {/*type*/}
          <div className="control-type">
            <label htmlFor="type">Type</label>
            <InputText
              value={formValues.type.value}
              id="type"
              onChange={handleChange}
              name="type"
              placeholder="Entre type de control"
              className="w-full"
            />
            {/*<label htmlFor="type">Type</label>*/}
            {/*<InputText*/}
            {/*  type="text"*/}
            {/*  id="type"*/}
            {/*  name="type"*/}
            {/*  className="p-inputtext-md w-full"*/}
            {/*  placeholder="Entre type de control"*/}
            {/*  onChange={(e) => getType(e.target.value)}*/}
            {/*/>*/}
          </div>

          {/*resources*/}
          <div className="control-resources">
            <label htmlFor="resources">Resources</label>
            <Chips name="resources"
                   id="resources"
                   value={formValues.resources.value}
                   className="w-full"
                   onChange={handleChange} />
            {/*<label htmlFor="resources">Resources</label>*/}
            {/*<InputText*/}
            {/*  type="text"*/}
            {/*  name="resources"*/}
            {/*  id="resources"*/}
            {/*  className="p-inputtext-md w-full"*/}
            {/*  placeholder="Enter control resources"*/}
            {/*  onChange={(e) => getResources(e.target.value)}*/}
            {/*/>*/}
          </div>

          {/*responsible for*/}
          <div className="control-responsibleFor">

            <label htmlFor="responsible_for">Responsable pour?</label>
            <InputText
              value={formValues.responsible_for.value}
              id="responsible_for"
              onChange={handleChange}
              name="responsible_for"
              placeholder="est responsable pour?"
              className="w-full"
            />
            {/*<InputText*/}
            {/*  type="text"*/}
            {/*  name="responsible_for"*/}
            {/*  id="responsible_for"*/}
            {/*  className="p-inputtext-md w-full"*/}
            {/*  placeholder="est responsable pour?"*/}
            {/*  onChange={(e) => getResponsibleFor(e.target.value)}*/}
            {/*/>*/}
          </div>

          {/*evaluation*/}
          <div className="control-evaluation-criteria">
            <label htmlFor="evaluation_criteria">Critaire d'evaluation</label>
            <Chips
              value={formValues.evaluation_criteria.value}
              id="evaluation_criteria"
              onChange={handleChange}
              name="evaluation_criteria"
              placeholder="Entree les critaire d'evaluation"
              className="w-full"
            />
            {/*<InputText*/}
            {/*  value={formValues.evaluation.value}*/}
            {/*  id="evaluation"*/}
            {/*  onChange={handleChange}*/}
            {/*  name="evaluation"*/}
            {/*  placeholder="Entree les critaire d'evaluation"*/}
            {/*  className="w-full"*/}
            {/*/>*/}
            {/*<label htmlFor="evaluation">Evaluation criteria</label>*/}
            {/*<InputText*/}
            {/*  type="text"*/}
            {/*  name="evaluation"*/}
            {/*  id="evaluation"*/}
            {/*  className="p-inputtext-md w-full"*/}
            {/*  placeholder="Is responsible for"*/}
            {/*  onChange={(e) => getEvaluationCriteria(e.target.value)}*/}
            {/*/>*/}
          </div>

          {/*proof of success*/}
          <div className="control-ProofOfSuccess">
            <label htmlFor="proof_of_success">Preuves de success</label>
            <Chips
              value={formValues.proof_of_success.value}
              id="proof_of_success"
              onChange={handleChange}
              name="proof_of_success"
              placeholder="Entrer les Preuves de success"
              className="w-full"
            />
            {/*<label htmlFor="proofOfSuccess">Preuves de success</label>*/}
            {/*<InputText*/}
            {/*  type="text"*/}
            {/*  name="proof_of_Success"*/}
            {/*  id="proof_of_Success"*/}
            {/*  className="p-inputtext-md w-full"*/}
            {/*  placeholder="Entre les Preuves de success"*/}
            {/*  onChange={(e) => getProofOfSuccess(e.target.value)}*/}
            {/*/>*/}
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
            {/*<label htmlFor="duration">Delias</label>*/}
            {/*<InputText*/}
            {/*  type="text"*/}
            {/*  name="duration"*/}
            {/*  id="duration"*/}
            {/*  className="p-inputtext-md w-full"*/}
            {/*  placeholder="Entre le delais"*/}
            {/*  onChange={(e) => getDuration(e.target.value)}*/}
            {/*/>*/}
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
            {/*<label htmlFor="theme">Theme</label>*/}
            {/*<InputText*/}
            {/*  id="theme"*/}
            {/*  onChange={(e) => getTheme(e.target.value)}*/}
            {/*  name="theme"*/}
            {/*  placeholder="Entrer le theme"*/}
            {/*  className="w-full"*/}
            {/*/>*/}
          </div>

          {/*department*/}
          <div className="control-Department">
            <label htmlFor="department">Department</label>
            <Chips
              value={formValues.department.value}
              id="department"
              onChange={handleChange}
              name="department"
              placeholder="Entrer les department"
              className="w-full"
            />
            {/*<label htmlFor="department">Department</label>*/}
            {/*<Dropdown*/}
            {/*  name="department"*/}
            {/*  id="department"*/}
            {/*  value={department}*/}
            {/*  onChange={(e) => getDepartment(e.target.value)}*/}
            {/*  options={departments}*/}
            {/*  placeholder="Entrer le departments"*/}
            {/*  className="w-full md:w-14rem"*/}
            {/*/>*/}
          </div>

          {/*action plan section*/}
          <div>
            <label htmlFor="action_plan">Numeros de plan d'action</label>
            <InputNumber
              value={formValues.action_plan.value}
              id="action_plan"
              type="text"
              name="action_plan"
              placeholder="Entrer le numeros de plan"
              onValueChange={handleChange}
              className='w-full'
            />
            {/*<label htmlFor="action_plan">Select an action plan</label>*/}
            {/*<MultiSelect*/}
            {/*  value={action_plan}*/}
            {/*  onChange={(e) => getActionPlan(e.value)}*/}
            {/*  options={actions}*/}
            {/*  id="action_plan"*/}
            {/*  name="action_plan"*/}
            {/*  optionLabel="theme"*/}
            {/*  placeholder="Entrer le numeros de plan"*/}
            {/*  maxSelectedLabels={3}*/}
            {/*  className="w-full md:w-20rem"*/}
            {/*/>*/}
          </div>

          {/*text of law*/}
          <div className='col-span-2'>
            <label htmlFor="text_of_the_law">Select a text of law</label>
            <Dropdown
              value={formValues.text_of_the_law.value}
              onChange={handleChange}
              options={laws || []}
              id="text_of_the_law"
              filter
              name="text_of_the_law"
              optionLabel="title_of_text"
              placeholder="Selectionner le texte"
              className="w-full"
            />
          </div>
        </div>

        {/*submit button*/}
        <div className="w-full my-4 py-2">
          <div className="">
            {loader ? (
              <ProgressSpinner style={{ width: "50px", height: "50px" }} />
            ) : (
              ""
            )}
          </div>
          <Button title="Create control" styles="flex-row-reverse float-right px-6 py-3 items-center rounded-md" onClick={handleSubmission} />
        </div>
      </form>
    );
  };

  const cardProps = {
    title: "Control information",
    content: addForm,
  };

  return (
    <section>
      {/* <BasicCard {...cardProps} /> */}
      {addForm()}
    </section>
  );
}

export default AddControl;
