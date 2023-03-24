import { useEffect, useState } from 'react'
import Button from '../../../core/Button/Button';
import BasicCard from '../../../core/card/BasicCard';
import Input from '../../../core/Input/Input';
import { ProgressSpinner } from 'primereact/progressspinner';
import useLawContext from '../../../hooks/useLawContext';
import { LawActionTypes } from '../../../store/action-types/laws.actions';

function AddLaw() {

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [ratification, setRatification] = useState('')
    const [area, setArea] = useState('')
    const [theme, setTheme] = useState('');
    const [link, setLink] = useState('');
    const [area_number, setAreaNumber] = useState('');
    const [paragraph_number, setParagraphNumber] = useState(0);
    const [decisions, setDecisions] = useState('');
    const [compliance, setCompliance] = useState('');
    const [control_plan, setControlPlan] = useState('');
    const [action_plan, setActionPlan] = useState('');
    const [loader, setLoader] = useState(false);
    const { state, dispatch } = useLawContext();

    const getTitle = (title: string) => setTitle(title);
    const getLocation = (location: string) => setLocation(location);
    const getRatification = (ratification: string) => setRatification(ratification);
    const getCompliance = (compliance: string) => setCompliance(compliance);
    const getActionPlan = (cctionPlan: string) => setActionPlan(cctionPlan);
    const getControlPlan = (controlPlan: string) => setControlPlan(controlPlan);
    const getArea = (area: string) => setArea(area);
    const getTheme = (theme: string) => setTheme(theme);
    const getLink = (link: string) => setLink(link);
    const getDecisions = (decisions: string) => setDecisions(decisions);
    const getAreaNumber = (areaNumber: string) => setAreaNumber(areaNumber);
    const getParagraphNumber = (paragraphNumber: number) => setParagraphNumber(paragraphNumber);

    const handleSubmission = () => {
        setLoader(true);
        dispatch({
            type: LawActionTypes.ADD_LAW, payload: {
                title,
                control_plan,
                area, action_plan, decisions,
                paragraph_number, compliance,
                area_number, link, location,
                ratification, theme
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
                <div>
                    <Input type='text' placeholder='Title' onChange={getTitle} />
                </div>
                <div>
                    <Input type='text' placeholder='Theme' onChange={getTheme} />
                </div>
                <div>
                    <Input type='text' placeholder='location' onChange={getLocation} />
                </div>
                <div>
                    <Input type='text' placeholder='Area' onChange={getArea} />
                </div>
                <div>
                    <Input type='text' placeholder='Decisions' onChange={getDecisions} />
                </div>

                <div >
                    <Input type='date' placeholder='Ratification' onChange={getRatification} />
                </div>

                <div>
                    <Input type='text' placeholder='Link' onChange={getLink} />
                </div>
                <div >
                    <Input type='text' placeholder='Compliance' onChange={getCompliance} />
                </div>
                <div>
                    <Input type='text' placeholder='Action Plan' onChange={getActionPlan} />
                </div>
                <div >
                    <Input type='text' placeholder='Control Plan' onChange={getControlPlan} />
                </div>
                <div >
                    <Input type='number' placeholder='Area Number' onChange={getAreaNumber} />
                </div>
                <div>
                    <Input type='number' placeholder='Paragraph Number' onChange={getParagraphNumber} />
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
        title: 'Law information',
        content: addForm
    }

    return (
        <section>
            {/* <BasicCard {...cardProps} /> */}
            {addForm()}
        </section>
    )
}

export default AddLaw