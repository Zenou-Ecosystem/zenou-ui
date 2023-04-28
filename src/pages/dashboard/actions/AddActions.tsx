import { useEffect, useState } from "react";
import Button from "../../../core/Button/Button";
import { ProgressSpinner } from "primereact/progressspinner";
import useActionsContext from "../../../hooks/useActionsContext";
import { ActionsActionTypes } from "../../../store/action-types/action.actions";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { fetchControls } from "../../../services/control.service";
import { fetchLaws } from "../../../services/laws.service";
import { ILaws } from "../../../interfaces/laws.interface";

function AddAction() {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [theme, setTheme] = useState("");
  const [department, setDepartment] = useState("");
  const [resources, setResources] = useState("");
  const [evaluation_criteria, setEvaluationCriteria] = useState("");
  const [evidence_of_actions, setEvidenceOfActions] = useState("");
  const [text_of_the_law, setTextOfLaw] = useState("");
  const [responsible_for, setResponsibleFor] = useState("");
  const [control_plan, setControlPlan] = useState("");

  const [controls, setControls] = useState<any[]>([]);
  const [laws, setLaws] = useState<ILaws[]>([]);

  const getType = (type: string) => setType(type);
  const getDuration = (duration: string) => setDuration(duration);
  const getTheme = (theme: string) => setTheme(theme);
  const getDepartment = (department: string) => setDepartment(department);
  const getResources = (resources: string) => setResources(resources);
  const getEvaluationCriteria = (evaluation_criteria: string) =>
    setEvaluationCriteria(evaluation_criteria);
  const getTextOfLaw = (text_of_the_law: string) =>
    setTextOfLaw(text_of_the_law);
  const getControlPlan = (action_plan: string) => setControlPlan(action_plan);
  const getResponsibleFor = (responsible_for: string) =>
    setResponsibleFor(responsible_for);
  const getEvidenceOfActions = (evidence_of_actions: string) =>
    setEvidenceOfActions(evidence_of_actions);
  const [loader, setLoader] = useState(false);
  const { state, dispatch } = useActionsContext();

  const handleSubmission = () => {
    setLoader(true);
    dispatch({
      type: ActionsActionTypes.ADD_ACTION,
      payload: {
        type,
        duration,
        theme,
        department,
        responsible_for,
        resources,
        evaluation_criteria,
        evidence_of_actions,
        text_of_the_law,
        control_plan,
      },
    });
  };

  useEffect(() => {
    (async () => {
      const resolvedState = await state;

      if (resolvedState.hasCreated) {
        setLoader(false);
      }

      const allControls = await fetchControls();
      setControls(allControls);

      setLaws(await fetchLaws());
    })();
  }, [state]);

  const addForm = () => {
    return (
      <form className="w-full">
        <div className="form-elements grid md:grid-cols-2 gap-4">
          {/*<div className="Action-type">*/}
          {/*    <Input type='text' placeholder='Action Type' onChange={getType} />*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*    <Input type='text' placeholder='Resources' onChange={getResources} />*/}
          {/*</div>*/}
          {/*<div >*/}
          {/*    <Input type='text' placeholder='ResponsibleFor' onChange={getResponsibleFor} />*/}
          {/*</div>*/}
          {/*<div >*/}
          {/*    <Input type='text' placeholder='Evaluation Criteria' onChange={getEvaluationCriteria} />*/}
          {/*</div>*/}
          {/*<div >*/}
          {/*    <Input type='text' placeholder='Proof Of Success' onChange={getEvidenceOfActions} />*/}
          {/*</div>*/}
          {/*<div >*/}
          {/*    <Input type='text' placeholder='Action Duration' onChange={getDuration} />*/}
          {/*</div>*/}
          {/*<div >*/}
          {/*    <Input type='text' placeholder='Theme' onChange={getTheme} />*/}
          {/*</div>*/}
          {/*<div >*/}
          {/*    <Input type='text' placeholder='Department' onChange={getDepartment} />*/}
          {/*</div>*/}
          {/*<div >*/}
          {/*    <Input type='text' placeholder='Text Of Law' onChange={getTextOfLaw} />*/}
          {/*</div>*/}
          {/*<div >*/}
          {/*    <Input type='text' placeholder='Control Plan' onChange={getControlPlan} />*/}
          {/*</div>*/}

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
          </div>

          {/*evidence of action*/}
          <div className="control-ProofOfSuccess">
            <label htmlFor="evidence">Evidence of action</label>
            <InputText
              type="text"
              name="evidence"
              id="evidence"
              className="p-inputtext-md w-full"
              placeholder="Enter evidence of action"
              onChange={(e) => getEvidenceOfActions(e.target.value)}
            />
          </div>

          {/*duration*/}
          <div className="control-Duration">
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
            <InputText
              type="text"
              name="department"
              id="department"
              className="p-inputtext-md w-full"
              placeholder="Enter control department"
              onChange={(e) => getDepartment(e.target.value)}
            />
          </div>

          {/*control plan*/}
          <div>
            <label htmlFor="control_plan">Control plan</label>
            <MultiSelect
              value={control_plan}
              onChange={(e) => getControlPlan(e.value)}
              options={controls}
              optionLabel="theme"
              name="control_plan"
              id="control_plan"
              placeholder="Select control plan"
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
    title: "Action information",
    content: addForm,
  };

  return (
    <section>
      {/* <BasicCard {...cardProps} /> */}
      {addForm()}
    </section>
  );
}

export default AddAction;
