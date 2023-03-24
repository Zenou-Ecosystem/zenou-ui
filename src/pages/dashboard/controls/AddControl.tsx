import { useEffect, useState } from 'react'
import Button from '../../../core/Button/Button';
import BasicCard from '../../../core/card/BasicCard';
import Input from '../../../core/Input/Input';
import { ProgressSpinner } from 'primereact/progressspinner';
import useControlContext from '../../../hooks/useControlContext';
import { ControlActionTypes } from '../../../store/action-types/control.actions';


function AddControl() {

    const [type, setType] = useState('');
    const [duration, setDuration] = useState('');
    const [theme, setTheme] = useState('')
    const [department, setDepartment] = useState('')
    const [resources, setResources] = useState('');
    const [evaluation_criteria, setEvaluationCriteria] = useState('');
    const [proof_of_success, setProofOfSuccess] = useState('');
    const [text_of_the_law, setTextOfLaw] = useState('');
    const [responsible_for, setResponsibleFor] = useState('');
    const [action_plan, setActionPlan] = useState('');

    const getType = (type: string) => setType(type);
    const getDuration = (duration: string) => setDuration(duration);
    const getTheme = (theme: string) => setTheme(theme);
    const getDepartment = (department: string) => setDepartment(department);
    const getResources = (resources: string) => setResources(resources);
    const getEvaluationCriteria = (evaluation_criteria: string) => setEvaluationCriteria(evaluation_criteria);
    const getTextOfLaw = (text_of_the_law: string) => setTextOfLaw(text_of_the_law);
    const getActionPlan = (action_plan: string) => setActionPlan(action_plan);
    const getResponsibleFor = (responsible_for: string) => setResponsibleFor(responsible_for);
    const getProofOfSuccess = (proof_of_success: string) => setProofOfSuccess(proof_of_success);
    const [loader, setLoader] = useState(false);
    const { state, dispatch } = useControlContext();

    const handleSubmission = () => {
        setLoader(true);
        dispatch({
            type: ControlActionTypes.ADD_CONTROL, payload: {
                type,
                duration,
                theme,
                department,
                responsible_for,
                resources,
                evaluation_criteria,
                proof_of_success,
                text_of_the_law,
                action_plan
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
                <div className="control-type">
                    <Input type='text' placeholder='Control Type' onChange={getType} />
                </div>
                <div className="control-resources">
                    <Input type='text' placeholder='resources' onChange={getResources} />
                </div>
                <div className="control-responsibleFor">
                    <Input type='text' placeholder='ResponsibleFor' onChange={getResponsibleFor} />
                </div>
                <div className="control-evaluation-criteria">
                    <Input type='text' placeholder='Evaluation Criteria' onChange={getEvaluationCriteria} />
                </div>
                <div className="control-ProofOfSuccess">
                    <Input type='text' placeholder='Proof Of Success' onChange={getProofOfSuccess} />
                </div>
                <div className="control-Duration">
                    <Input type='text' placeholder='control Duration' onChange={getDuration} />
                </div>
                <div className="control-Theme">
                    <Input type='text' placeholder='Theme' onChange={getTheme} />
                </div>
                <div className="control-Department">
                    <Input type='text' placeholder='Department' onChange={getDepartment} />
                </div>
                <div className="control-TextOfLaw">
                    <Input type='text' placeholder='Text Of Law' onChange={getTextOfLaw} />
                </div>
                <div className="control-ActionPlan">
                    <Input type='text' placeholder='Action Plan' onChange={getActionPlan} />
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
        title: 'Control information',
        content: addForm
    }

    return (
        <section>
            {/* <BasicCard {...cardProps} /> */}
            {addForm()}
        </section>
    )
}

export default AddControl