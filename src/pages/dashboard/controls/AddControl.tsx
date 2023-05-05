import { useEffect, useState } from "react";
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

function AddControl() {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [theme, setTheme] = useState("");
  const [department, setDepartment] = useState("");
  const [resources, setResources] = useState("");
  const [evaluation_criteria, setEvaluationCriteria] = useState("");
  const [proof_of_success, setProofOfSuccess] = useState("");
  const [text_of_the_law, setTextOfLaw] = useState("");
  const [responsible_for, setResponsibleFor] = useState("");
  const [action_plan, setActionPlan] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);

  const getType = (type: string) => setType(type);
  const getDuration = (duration: string) => setDuration(duration);
  const getTheme = (theme: string) => setTheme(theme);
  const getDepartment = (department: string) => setDepartment(department);
  const getResources = (resources: string) => setResources(resources);
  const getEvaluationCriteria = (evaluation_criteria: string) =>
    setEvaluationCriteria(evaluation_criteria);
  const getTextOfLaw = (text_of_the_law: string) =>
    setTextOfLaw(text_of_the_law);
  const getActionPlan = (action_plan: string) => setActionPlan(action_plan);
  const getResponsibleFor = (responsible_for: string) =>
    setResponsibleFor(responsible_for);
  const getProofOfSuccess = (proof_of_success: string) =>
    setProofOfSuccess(proof_of_success);
  const [loader, setLoader] = useState(false);
  const { state, dispatch } = useControlContext();

  const [actions, setActions] = useState<any[]>([]);
  const [laws, setLaws] = useState<ILaws[]>([]);

  const handleSubmission = () => {
    setLoader(true);
    dispatch({
      type: ControlActionTypes.ADD_CONTROL,
      payload: {
        type,
        duration,
        theme,
        department,
        responsible_for,
        resources,
        evaluation_criteria,
        proof_of_success,
        text_of_the_law,
        action_plan,
      },
    });
  };

  useEffect(() => {
    (async () => {
      const resolvedState = await state;
      if (resolvedState.hasCreated) {
        setLoader(false);
      }

      // Fetch Actions
      const data = await fetchActions();
      setActions(data);

      let department = await fetchDepartments();
      if (department) {
        setDepartments(department.map((dept) => dept.name));
      }

      //  Fetch laws
      setLaws(await fetchLaws());
    })();
  }, [state]);

  const addForm = () => {
    return (
      <form className="w-full">
        <div className="form-elements grid md:grid-cols-2 gap-4">
          {/*type*/}
          <div className="control-type">
            <label htmlFor="controlType">Type</label>
            <InputText
              type="text"
              id="controlType"
              name="controlType"
              className="p-inputtext-md w-full"
              placeholder="Enter control type"
              onChange={(e) => getType(e.target.value)}
            />
          </div>

          {/*resources*/}
          <div className="control-resources">
            {/*<Input*/}
            {/*  type="text"*/}
            {/*  placeholder="resources"*/}
            {/*  onChange={getResources}*/}
            {/*/>*/}
            <label htmlFor="resources">Resources</label>
            <InputText
              type="text"
              name="resources"
              id="resources"
              className="p-inputtext-md w-full"
              placeholder="Enter control resources"
              onChange={(e) => getResources(e.target.value)}
            />
          </div>

          {/*responsible for*/}
          <div className="control-responsibleFor">
            <label htmlFor="responsibleFor">Responsible for</label>
            <InputText
              type="text"
              name="responsibleFor"
              id="responsibleFor"
              className="p-inputtext-md w-full"
              placeholder="Is responsible for"
              onChange={(e) => getResponsibleFor(e.target.value)}
            />
            {/*<Input*/}
            {/*  type="text"*/}
            {/*  placeholder="ResponsibleFor"*/}
            {/*  onChange={getResponsibleFor}*/}
            {/*/>*/}
          </div>

          {/*evaluation*/}
          <div className="control-evaluation-criteria">
            <label htmlFor="evaluation">Evaluation criteria</label>
            <InputText
              type="text"
              name="evaluation"
              id="evaluation"
              className="p-inputtext-md w-full"
              placeholder="Is responsible for"
              onChange={(e) => getEvaluationCriteria(e.target.value)}
            />
            {/*<Input*/}
            {/*  type="text"*/}
            {/*  placeholder="Evaluation Criteria"*/}
            {/*  onChange={getEvaluationCriteria}*/}
            {/*/>*/}
          </div>

          {/*proof of success*/}
          <div className="control-ProofOfSuccess">
            {/*<Input*/}
            {/*  type="text"*/}
            {/*  placeholder="Proof Of Success"*/}
            {/*  onChange={getProofOfSuccess}*/}
            {/*/>*/}
            <label htmlFor="proofOfSuccess">Proof of success</label>
            <InputText
              type="text"
              name="proofOfSuccess"
              id="proofOfSuccess"
              className="p-inputtext-md w-full"
              placeholder="Enter proof of success"
              onChange={(e) => getProofOfSuccess(e.target.value)}
            />
          </div>

          {/*duration*/}
          <div className="control-Duration">
            {/*<Input*/}
            {/*  type="text"*/}
            {/*  placeholder="control Duration"*/}
            {/*  onChange={getDuration}*/}
            {/*/>*/}
            <label htmlFor="duration">Duration</label>
            <InputText
              type="text"
              name="duration"
              id="duration"
              className="p-inputtext-md w-full"
              placeholder="Enter control duration"
              onChange={(e) => getDuration(e.target.value)}
            />
          </div>

          {/*theme*/}
          <div className="control-Theme">
            {/*<Input type="text" placeholder="Theme" onChange={getTheme} />*/}
            <label htmlFor="theme">Theme</label>
            <InputTextarea
              autoResize
              id="theme"
              onChange={(e) => getTheme(e.target.value)}
              name="theme"
              placeholder="Enter theme/description for this control"
              className="w-full"
            />
          </div>

          {/*department*/}
          <div className="control-Department">
            <label htmlFor="department">Department</label>
            <Dropdown
              name="department"
              id="department"
              value={department}
              onChange={(e) => getDepartment(e.target.value)}
              options={departments}
              placeholder="Select various departments"
              className="w-full md:w-14rem"
            />
          </div>

          {/*action plan section*/}
          <div>
            <label htmlFor="actionPlan">Select an action plan</label>
            <MultiSelect
              value={action_plan}
              onChange={(e) => getActionPlan(e.value)}
              options={actions}
              id="actionPlan"
              name="actionPlan"
              optionLabel="theme"
              placeholder="Select an action plan"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
          </div>

          {/*text of law*/}
          <div>
            <label htmlFor="textOfLaw">Select a text of law</label>
            <Dropdown
              value={text_of_the_law}
              onChange={(e) => getTextOfLaw(e.value)}
              options={laws.filter((x) => (x.title as string) === "law")}
              id="textOfLaw"
              name="textOfLaw"
              optionLabel="title"
              placeholder="Select an text of law"
              className="w-full md:w-20rem"
            />
          </div>
        </div>

        {/*submit button*/}
        <div className="add-form-submit-btn">
          <div className="">
            {loader ? (
              <ProgressSpinner style={{ width: "50px", height: "50px" }} />
            ) : (
              ""
            )}
          </div>
          <Button title="Create" onClick={handleSubmission} />
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
