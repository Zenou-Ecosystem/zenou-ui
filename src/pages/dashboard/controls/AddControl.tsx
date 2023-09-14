import React, { useEffect, useState } from "react";
import Button from "../../../core/Button/Button";
import { ProgressSpinner } from "primereact/progressspinner";
import useControlContext from "../../../hooks/useControlContext";
import { ControlActionTypes } from "../../../store/action-types/control.actions";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { fetchLaws } from "../../../services/laws.service";
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
};

function AddControl() {
  const [formValues, setFormValues] =
    useState<Record<string, any>>(initialFormState);
  const [loader, setLoader] = useState(false);
  const { state, dispatch } = useControlContext();
  const [laws, setLaws] = useState<any[]>([]);

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
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">

          {/*type*/}
          <div className="control-type">
            <label htmlFor="type">Type</label>
            <InputText
              value={formValues.type.value}
              id="type"
              onChange={handleChange}
              name="type"
              placeholder="Saisissez le type de control"
              className="w-full"
            />
          </div>

          {/*responsible for*/}
          <div className="control-responsibleFor">

            <label htmlFor="responsible_for">Responsable pour?</label>
            <InputText
              value={formValues.responsible_for.value}
              id="responsible_for"
              onChange={handleChange}
              name="responsible_for"
              placeholder="Est responsable pour?"
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

          {/*proof of success*/}
          <div className="col-span-2">
            <label htmlFor="proof_of_success">Preuves de success</label>
            <Chips
              value={formValues.proof_of_success.value}
              id="proof_of_success"
              onChange={handleChange}
              name="proof_of_success"
              placeholder="Entrer les Preuves de success"
              className="w-full"
            />
            <small className="text-gray-500">Saisissez et appuyez sur Entrée pour ajouter une nouvelle preuves</small>
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
          </div>

          {/*text of law*/}
          <div className=''>
            <label htmlFor="text_of_the_law">Select a text of law</label>
            <Dropdown
              value={formValues.text_of_the_law.value}
              onChange={handleChange}
              id="text_of_the_law"
              filter
              name="text_of_the_law"
              optionLabel="title_of_text"
              placeholder="Selectionner le texte"
              className="w-full"
              options={laws || []}
              defaultValue={formValues.text_of_the_law.value}
              valueTemplate={(options) => options?.title_of_text ? options?.title_of_text?.slice(0,40) + "..." : "Selectionner le texte"}
              itemTemplate={(options) => options?.title_of_text?.slice(0,40) + "..."}
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
          <Button title="Créer un nouveau contrôle" styles="flex-row-reverse float-right px-6 py-3 items-center rounded-md" onClick={handleSubmission} />
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
