import { useEffect, useState } from 'react'
import Button from '../../../core/Button/Button';
import BasicCard from '../../../core/card/BasicCard';
import Input from '../../../core/Input/Input';
import { ProgressSpinner } from 'primereact/progressspinner';
import useActionsContext from '../../../hooks/useActionsContext';
import { ActionsActionTypes } from '../../../store/action-types/action.actions';



function AddAction() {

    const [type, setType] = useState('');
    const [duration, setDuration] = useState('');
    const [theme, setTheme] = useState('')
    const [department, setDepartment] = useState('')
    const [resources, setResources] = useState('');
    const [evaluation_criteria, setEvaluationCriteria] = useState('');
    const [evidence_of_actions, setEvidenceOfActions] = useState('');
    const [text_of_the_law, setTextOfLaw] = useState('');
    const [responsible_for, setResponsibleFor] = useState('');
    const [control_plan, setControlPlan] = useState('');

    const getType = (type: string) => setType(type);
    const getDuration = (duration: string) => setDuration(duration);
    const getTheme = (theme: string) => setTheme(theme);
    const getDepartment = (department: string) => setDepartment(department);
    const getResources = (resources: string) => setResources(resources);
    const getEvaluationCriteria = (evaluation_criteria: string) => setEvaluationCriteria(evaluation_criteria);
    const getTextOfLaw = (text_of_the_law: string) => setTextOfLaw(text_of_the_law);
    const getControlPlan = (action_plan: string) => setControlPlan(action_plan);
    const getResponsibleFor = (responsible_for: string) => setResponsibleFor(responsible_for);
    const getEvidenceOfActions = (evidence_of_actions: string) => setEvidenceOfActions(evidence_of_actions);
    const [loader, setLoader] = useState(false);
    const { state, dispatch } = useActionsContext();

    const handleSubmission = () => {
        setLoader(true);
        dispatch({
            type: ActionsActionTypes.ADD_ACTION, payload: {
                type,
                duration,
                theme,
                department,
                responsible_for,
                resources,
                evaluation_criteria,
                evidence_of_actions,
                text_of_the_law,
                control_plan
            }
        });
    }

    useEffect(() => {
        (async () => {
            const resolvedState = await state;
            if (resolvedState.hasCreated) {
                setLoader(false);
            }
        })()
    }, [state])

    const addForm = () => {
        return (<form className='w-full'>
            <div className="form-elements grid md:grid-cols-2 gap-4">
                <div className="Action-type">
                    <Input type='text' placeholder='Action Type' onChange={getType} />
                </div>
                <div>
                    <Input type='text' placeholder='Resources' onChange={getResources} />
                </div>
                <div >
                    <Input type='text' placeholder='ResponsibleFor' onChange={getResponsibleFor} />
                </div>
                <div >
                    <Input type='text' placeholder='Evaluation Criteria' onChange={getEvaluationCriteria} />
                </div>
                <div >
                    <Input type='text' placeholder='Proof Of Success' onChange={getEvidenceOfActions} />
                </div>
                <div >
                    <Input type='text' placeholder='Action Duration' onChange={getDuration} />
                </div>
                <div >
                    <Input type='text' placeholder='Theme' onChange={getTheme} />
                </div>
                <div >
                    <Input type='text' placeholder='Department' onChange={getDepartment} />
                </div>
                <div >
                    <Input type='text' placeholder='Text Of Law' onChange={getTextOfLaw} />
                </div>
                <div >
                    <Input type='text' placeholder='Control Plan' onChange={getControlPlan} />
                </div>
            </div>
            <div className="add-form-submit-btn">
                <div className="">
                    {loader ? (<ProgressSpinner style={{ width: '50px', height: '50px' }} />) : ''}
                </div>
                <Button title='Create' onClick={handleSubmission} />
            </div>
        </form>);
    }

    const cardProps = {
        title: 'Action information',
        content: addForm
    }

    return (
        <section>
            {/* <BasicCard {...cardProps} /> */}
            {addForm()}
        </section>
    )
}

export default AddAction