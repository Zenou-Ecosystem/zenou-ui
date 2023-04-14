import { useEffect, useState } from 'react'
// import Button from '../../../core/Button/Button';
import Input from '../../../core/Input/Input';
import { ProgressSpinner } from 'primereact/progressspinner';
import useLawContext from '../../../hooks/useLawContext';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from "primereact/checkbox";
import { LawActionTypes } from '../../../store/action-types/laws.actions';
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from 'primereact/button';
import "./law.scss";
import { upload } from '../../../firebase/upload/fileUpload';
import { ILaws } from '../../../interfaces/laws.interface';
import { fetchActions } from '../../../services/actions.service';
import { fetchControls } from '../../../services/control.service';

function AddLaw(props: { laws: ILaws[] }) {

    const [laws, setLaws] = useState<ILaws[]>(props?.laws);
    const [actions, setActions] = useState<any[]>([]);
    const [controls, setControls] = useState<any[]>([]);
    const [options, setOptions] = useState<any>();
    const [selectedOptions, setSelectedOptions] = useState<any>([]);
    const [typedOptions, setTypedOptions] = useState<any>([]);
    const [currentOption, setCurrentOption] = useState<any>({});
    const [checkDecree, setCheckedDecree] = useState(false);
    const [checkOrder, setCheckedOrder] = useState(false);
    const [checkDecision, setCheckedDecision] = useState(false);
    const [optionPlaceholder, setOptionPlaceholder] = useState('');


    const [title, setTitle] = useState('');
    const [ratification, setRatification] = useState('')
    const [theme, setTheme] = useState('');
    const [link, setLink] = useState<File>();
    const [order, setOrder] = useState('');
    const [decree, setDecree] = useState('');
    const [decisions, setDecisions] = useState('');
    const [compliance, setCompliance] = useState('');
    const [control_plan, setControlPlan] = useState('');
    const [action_plan, setActionPlan] = useState('');
    const [loader, setLoader] = useState(false);
    const { state, dispatch } = useLawContext();

    const [decreePlaceHolder, setDecreePlaceHolder] = useState('What is the title of the Decree ?');
    const [orderPlaceHolder, setOrderPlaceHolder] = useState('What is the title of the Order ? ');
    const [decisionPlaceHolder, setDecisionPlaceHolder] = useState('What is the title of the Decision ?');
    const [disableAddDecree, setDisableAddDecree] = useState(true);
    const [disableAddOrder, setDisableAddOrder] = useState(true);
    const [disableAddDecision, setDisableAddDecision] = useState(true);


    const getTitle = (title: string) => setTitle(title);
    const getRatification = (ratification: string) => setRatification(ratification);
    const getCompliance = (compliance: string) => setCompliance(compliance);
    const getActionPlan = (cctionPlan: string) => setActionPlan(cctionPlan);
    const getControlPlan = (controlPlan: string) => setControlPlan(controlPlan);

    useEffect(() => {

        (async () => {

            const resolvedState = await state;
            if (resolvedState.hasCreated) {
                setLoader(false);
            }

            // Fetch Actions and Controls
            const data = await fetchActions();
            setActions(data);

            const allControls = await fetchControls();
            setControls(allControls);
        })();

    }, [state])

    const getLink = (e: any) => {
        const file = e.target.files[0];
        setLink(file);
    };

    // Get the text entered as title for the decree. 
    // Check if an existing decree is already selected and activate the add new decree btn
    const getDecree = (decree: string) => {
        if (decree !== "") {
            setDisableAddDecree(false);
        }
        setDecree(decree);
        setCurrentOption({
            code: 'decree',
            name: decree
        });
    };

    const getOrder = (order: string) => {
        if (order !== "") {
            setDisableAddOrder(false);
        }
        setOrder(order);
        setCurrentOption({
            code: 'order',
            name: order
        });
    };

    const getDecisions = (decision: string) => {
        if (decision !== "") {
            setDisableAddDecision(false);
        }
        setDecisions(decision);
        setCurrentOption({
            code: 'decision',
            name: decision
        });
    };

    const handleSelectedOption = (e: any) => {
        setSelectedOptions(e.value)
        console.log('all SelectedOptions => ', selectedOptions);
    }

    const handleCheckDecree = (e: any) => {
        setCheckedDecree(e.checked);
        setOptionPlaceholder('Decree');
        setOptions((prev: any) => {
            let listOfOptions: any[] = [];
            laws.forEach(law => {
                law.options?.decree.forEach((decree: any) => listOfOptions.push(decree));
            });
            return listOfOptions;
        });
        setOrder('');
        setDecisions('');
        setCheckedOrder(false);
        setCheckedDecision(false);
    }

    const handleCheckOrder = (e: any) => {
        setCheckedOrder(e.checked);
        setOptionPlaceholder('Order');
        setOptions((prev: any) => {
            let listOfOptions: any[] = [];
            laws.forEach(law => {
                law.options?.decree.forEach((decree: any) => listOfOptions.push(decree));
                law.options?.order.forEach((order: any) => listOfOptions.push(order));
            });
            return listOfOptions;
        });
        setDecree('');
        setDecisions('');
        setCheckedDecree(false);
        setCheckedDecision(false);
    }

    const handleCheckDecision = (e: any) => {
        setCheckedDecision(e.checked);
        setOptionPlaceholder('Decision');
        setOptions((prev: any) => {
            let listOfOptions: any[] = [];
            laws.forEach(law => {
                law.options?.decree.forEach((decree: any) => listOfOptions.push(decree));
                law.options?.order.forEach((order: any) => listOfOptions.push(order));
                law.options?.decision.forEach((decision: any) => listOfOptions.push(decision));
            });
            return listOfOptions;
        });
        setDecree('');
        setOrder('');
        setCheckedDecree(false);
        setCheckedOrder(false);
    }

    const handleAddNewDecree = (e: any) => {
        e.preventDefault();
        setTypedOptions((prev: any) => [...prev, currentOption]);
        setCurrentOption({});
        setDecree('');
        setSelectedOptions([]);
        setDecreePlaceHolder('Enter title for new Decree');
    }

    const handleAddNewOrder = (e: any) => {
        e.preventDefault();
        setTypedOptions((prev: any) => [...prev, currentOption]);
        setCurrentOption({});
        setOrder('');
        setSelectedOptions([]);
        setOrderPlaceHolder('Enter title for new Order');
    }

    const handleAddNewDecision = (e: any) => {
        e.preventDefault();
        setTypedOptions((prev: any) => [...prev, currentOption]);
        setCurrentOption({});
        setDecisions('');
        setSelectedOptions([]);
        setDecisionPlaceHolder('Enter title for new Decision');
    }

    const handleSubmission = async (e: any) => {
        e.preventDefault();

        setLoader(true);
        let mainOps: any = {
            decree: [],
            order: [],
            decision: []
        };

        const optionsToParse = [...typedOptions, ...selectedOptions];

        optionsToParse?.map((item: any) => {
            if (mainOps[item.code]) {
                if (typeof mainOps[item.code] == 'object') {
                    mainOps[item.code] = [...mainOps[item.code], item];
                } else {
                    mainOps[item.code] = [item];
                }
            }
        });

        const uploadUrl = await upload(link as File);

        dispatch({
            type: LawActionTypes.ADD_LAW, payload: {
                title,
                control_plan,
                action_plan,
                decisions,
                decree,
                compliance,
                order,
                link: uploadUrl,
                ratification,
                theme,
                options: mainOps
            }
        });
    }


    // Construct add form
    const addForm = () => {
        return (<form className='w-full'>
            <div className="form-elements grid md:grid-cols-2 gap-4">

                <div>
                    <Input type='text' placeholder='Title of this Law' onChange={getTitle} />
                </div>

                <div >
                    <Input type='date' placeholder='Ratification' onChange={getRatification} />
                </div>

                <div>
                    <Input type='file' placeholder='Upload the file' onChange={getLink} />
                </div>

                <div >
                    <Input type='text' placeholder='Compliance' onChange={getCompliance} />
                </div>
                <div>
                    <MultiSelect
                        value={selectedOptions}
                        onChange={handleSelectedOption}
                        options={actions}
                        optionLabel="theme"
                        placeholder='Select action plan'
                        maxSelectedLabels={3}
                        className="w-full md:w-20rem"
                    />
                </div>
                <div >
                    <MultiSelect
                        value={selectedOptions}
                        onChange={handleSelectedOption}
                        options={controls}
                        optionLabel="theme"
                        placeholder='Select control plan'
                        maxSelectedLabels={3}
                        className="w-full md:w-20rem"
                    />
                </div>
                <div>
                    <InputTextarea autoResize value={theme}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTheme(e.target.value)}
                        placeholder="Theme/Description of the law"
                        rows={2} cols={50} />
                </div>

                <div className="flex justify-content-center">
                    <Checkbox onChange={handleCheckDecree} inputId="decrees"
                        checked={checkDecree}>
                    </Checkbox>
                    <label htmlFor="decrees" className="ml-2">Has Decree(s)?</label>
                </div>

                <div className="flex justify-content-center">
                    <Checkbox onChange={handleCheckOrder} inputId="orders"
                        checked={checkOrder}>
                    </Checkbox>
                    <label htmlFor="orders" className="ml-2">Has Order(s)?</label>
                </div>

                <div className="flex justify-content-center">
                    <Checkbox onChange={handleCheckDecision} inputId="decision"
                        checked={checkDecision}>
                    </Checkbox>
                    <label htmlFor="decision" className="ml-2">Has Decision(s)?</label>
                </div>

                {/* If law has decress, register them */}

                {
                    checkDecree ?
                        <div >
                            <Input type='text' placeholder={decreePlaceHolder} onChange={getDecree} />
                        </div>
                        : null
                }

                {/* If law has orders */}
                {
                    checkOrder ?
                        <div>
                            <Input type='text' placeholder={orderPlaceHolder} onChange={getOrder} />
                        </div>
                        : null
                }

                {/* Show decision input only if law has a particular decision */}
                {
                    checkDecision ?
                        <div>
                            <Input type='text' placeholder={decisionPlaceHolder} onChange={getDecisions} />
                        </div>
                        : null
                }

                {/* This is to add support for laws that have decrees, orders or decisions */}
                <div className="flex justify-content-center">
                    {
                        checkDecree || checkOrder || checkDecision
                            ?
                            <MultiSelect
                                value={selectedOptions}
                                onChange={handleSelectedOption}
                                options={options}
                                optionLabel="name"
                                filter placeholder={`This ${optionPlaceholder} depends on ?`}
                                maxSelectedLabels={3}
                                className="w-full md:w-20rem" />
                            : null
                    }

                </div>

                {/* Add buttons */}
                <Button onClick={handleAddNewDecree}
                    hidden={!checkDecree}
                    disabled={disableAddDecree} label="Add Decree"
                    icon="pi pi-plus" size="small" className='add-new-btn' />

                <Button onClick={handleAddNewOrder}
                    hidden={!checkOrder}
                    disabled={disableAddOrder} label="Add Order"
                    icon="pi pi-plus" size="small" className='add-new-btn' />

                <Button onClick={handleAddNewDecision}
                    hidden={!checkDecision}
                    disabled={disableAddDecision} label="Add Decision"
                    icon="pi pi-plus" size="small" className='add-new-btn' />

            </div>
            <div className="add-form-submit-btn">
                <div className="">
                    {loader ? (<ProgressSpinner style={{ width: '50px', height: '50px' }} />) : ''}
                </div>
                <Button label='Create' onClick={(e) => handleSubmission(e)} />
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