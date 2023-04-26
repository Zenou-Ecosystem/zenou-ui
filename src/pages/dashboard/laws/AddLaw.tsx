import { Key, useEffect, useState} from 'react'
import Input from '../../../core/Input/Input';
import {ProgressSpinner} from 'primereact/progressspinner';
import useLawContext from '../../../hooks/useLawContext';
import {MultiSelect} from 'primereact/multiselect';
import {Checkbox} from "primereact/checkbox";
import {LawActionTypes} from '../../../store/action-types/laws.actions';
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from 'primereact/button';
import "./law.scss";
import {upload} from '../../../firebase/upload/fileUpload';
import {ILaws} from '../../../interfaces/laws.interface';
import {fetchActions} from '../../../services/actions.service';
import {fetchControls} from '../../../services/control.service';
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {TreeSelect} from "primereact/treeselect";
import {InputText} from "primereact/inputtext";
import {Chip} from "primereact/chip";

function AddLaw(props: { laws: ILaws[] }) {
    const titles = ['convention', 'law', 'decree', 'order', 'decisions', 'notes', 'guidance', 'direction'];
    const locations = ['international', 'continental', 'national'];
    const complianceObject = ['complaint', 'non-compliant', 'in progress'];
    const domains = ["air", "land", "water", "environment", "business", "education", "transport", "health", "agriculture"];
    const severity = [
        {
            label: 'Least Severe',
            value: 1,
        },
        {
            label: 'Less Severe',
            value: 2,
        },
        {
            label: 'Severe',
            value: 3,
        },
        {
            label: 'More Severe',
            value: 4,
        },
        {
            label: 'Most Severe',
            value: 5,
        }
    ]

    const initialFormState = {
        title: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        location: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        ratification: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        area: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        theme: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        item_number: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        paragraph_number: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        decision: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        compliance: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        control_plan: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        action_plan: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        domain: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        article: {
            value: '',
            error: true,
            error_message: '',
            required: true
        },
        severity: {
            value: '',
            error: true,
            error_message: '',
            required: true
        }

    }


    const [formValues, setFormValues] = useState<Record<string, any>>(initialFormState);

    const handleChange = (e: any) => {
        console.log(e)
        // eslint-disable-next-line prefer-const
        let {name, value}: Record<any, string> = e.target

        const targetProperty = formValues[name]

        let error = targetProperty?.validator ? !targetProperty.validator.test(String(value)) : false

        if (targetProperty !== undefined && targetProperty.required && !String(value).trim().length) error = true

        setFormValues({
            ...formValues,
            [name]: {
                ...formValues[name],
                value,
                error
            }
        })
    }

    const removeOptions = (id: number) => {
        setTypedOptions((prevState: { title: string; option: string; id: number }[]) => {
            prevState.filter(x => x.id !== id);
        })
    }

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

    const [decree, setDecree] = useState({
        title: {
            value: ''
        },
        dependsOn: {
            value: ''
        }
    });

    const [decreeTitle, setDecreeTitle] = useState('');
    const [decreeDependson, setDecreeDependsOn] = useState('')

    const [decisions, setDecisions] = useState('');
    const [compliance, setCompliance] = useState('');
    const [control_plan, setControlPlan] = useState('');
    const [action_plan, setActionPlan] = useState('');
    const [loader, setLoader] = useState(false);
    const {state, dispatch} = useLawContext();

    const [decreePlaceHolder, setDecreePlaceHolder] = useState('What is the title of the Decree ?');
    const [orderPlaceHolder, setOrderPlaceHolder] = useState('What is the title of the Order ? ');
    const [decisionPlaceHolder, setDecisionPlaceHolder] = useState('What is the title of the Decision ?');
    const [disableAddDecree, setDisableAddDecree] = useState(true);
    const [disableAddOrder, setDisableAddOrder] = useState(true);
    const [disableAddDecision, setDisableAddDecision] = useState(true);


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


    // Get the text entered as title for the decree. 
    // Check if an existing decree is already selected and activate the add new decree btn
    // const getDecree = (decree: string) => {
    //     if (decree !== "") {
    //         setDisableAddDecree(false);
    //     }
    //     setDecree(decree);
    //     setCurrentOption({
    //         code: 'decree',
    //         name: decree
    //     });
    // };

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
        // if(optionPlaceholder.toLowerCase() === 'decree') {
        //     setDecreeDependsOn(e.target.value)
        // }
        setSelectedOptions((prev: any) =>  [...prev, e.value])
        console.log('all SelectedOptions => ', selectedOptions, optionPlaceholder);
    }

    const handleCheckDecree = (e: any) => {
        setCheckedDecree(e.checked);
        setOptionPlaceholder('Decree');
        setOptions((prev: any) => {
            let listOfOptions: any[] = [];
            laws.forEach((law) => {
                // decisions.forEach(({decision, order, decree}) => {
                //     decree && listOfOptions.push(decree)
                // } )
                law.options?.decree.forEach((decree: any) => listOfOptions.push(decree));
                // law.options?.order.forEach((order: any) => listOfOptions.push(order));
            });
            return laws;
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
            laws.forEach((law) => {
                law.options?.decree.forEach((decree: any) => listOfOptions.push(decree));
                // law.options?.order.forEach((order: any) => listOfOptions.push(order));
            });
            return laws;
        });
        // setDecree('');
        setDecisions('');
        setCheckedDecree(false);
        setCheckedDecision(false);
    }

    const handleCheckDecision = (e: any) => {
        setCheckedDecision(e.checked);
        setOptionPlaceholder('Decision');
        setOptions((prev: any) => {
            let listOfOptions: any[] = [];
            laws.forEach((law) => {
                // decisions.forEach(({decision, order, decree}) => {
                //     decree && listOfOptions.push(decree)
                //     order && listOfOptions.push(order)
                //     decision && listOfOptions.push(decision)
                // } )
                law.options?.decree.forEach((decree: any) => listOfOptions.push(decree));
                law.options?.order.forEach((order: any) => listOfOptions.push(order));
            });
            return laws;
        });
        // setDecree('');
        setOrder('');
        setCheckedDecree(false);
        setCheckedOrder(false);
    }

    const handleAddNewDecree = (e: any) => {
        e.preventDefault();
        setTypedOptions((prev: any) => [...prev, { ...currentOption, id: prev.length }]);
        setCurrentOption({});
        // setDecree('');
        setSelectedOptions([]);
        setDecreePlaceHolder('Enter title for new Decree');
    }

    const handleAddNewOrder = (e: any) => {
        e.preventDefault();
        setTypedOptions((prev: any) => [...prev, { ...currentOption, id: prev.length }]);
        setCurrentOption({});
        setOrder('');
        setSelectedOptions([]);
        setOrderPlaceHolder('Enter title for new Order');
    }

    const handleAddNewDecision = (e: any) => {
        e.preventDefault();
        setTypedOptions((prev: any) => [...prev, { ...currentOption, id: prev.length }]);
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

        // const uploadUrl = await upload(link as File);

        // dispatch({
        //     type: LawActionTypes.ADD_LAW, payload: {
        //         title,
        //         control_plan,
        //         action_plan,
        //         decisions,
        //         decree,
        //         compliance,
        //         order,
        //         link: uploadUrl,
        //         ratification,
        //         theme,
        //         options: mainOps
        //     }
        // });
    }


    // Construct add form
    const addForm = () => {
        return (<form className='w-full'>
            <div className="form-elements grid md:grid-cols-2 gap-4">

                {/*law title*/}
                <div>
                    <label htmlFor='law_title'>Title</label>
                    <Dropdown name='title' id='law_title' value={formValues.title.value}
                              onChange={(e) => handleChange(e)} options={titles}
                              placeholder='Title of this Law' className="w-full md:w-14rem"/>
                </div>

                {/*location*/}
                <div>
                    <label htmlFor='location'>Location</label>
                    <Dropdown id='location' name='location' value={formValues.location.value}
                              onChange={(e) => handleChange(e)} options={locations}
                              placeholder='Location' className="w-full md:w-14rem"/>
                </div>

                {/*ratification*/}
                <div>
                    <label htmlFor='ratification'>Ratification</label> <br/>
                    {/*<Input type='date' placeholder='Ratification' onChange={getRatification} />*/}
                    <Calendar id='ratification' className='w-full' name='ratification'
                              showIcon value={formValues.ratification.value} placeholder='Ratification'
                              onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <label htmlFor='compliance'>Compliance</label>
                    <Dropdown id='compliance' name='compliance' value={formValues.compliance.value}
                              onChange={handleChange} className="w-full md:w-14rem"
                              options={complianceObject} placeholder='Compliance of this Law'/>
                </div>

                {/*action plan*/}
                <div>
                    <label htmlFor='action_plan'>Action plan</label>
                    <MultiSelect
                        value={formValues.action_plan.value}
                        onChange={handleChange}
                        options={actions}
                        id='action_plan'
                        name='action_plan'
                        optionLabel="theme"
                        placeholder='Select action plan'
                        maxSelectedLabels={3}
                        className="w-full md:w-20rem"
                    />
                </div>

                {/*domain */}
                <div>
                    <label htmlFor='domain'>Domain</label>
                    <Dropdown id='domain' name='domain' value={formValues.domain.value}
                              onChange={handleChange} className="w-full md:w-14rem"
                              options={domains} placeholder='Domain of action of this Law'/>
                </div>

                {/*control plan*/}
                <div>
                    <label htmlFor='control_plan'>Control plan</label>
                    <MultiSelect
                        value={selectedOptions}
                        onChange={handleSelectedOption}
                        options={controls}
                        optionLabel="theme"
                        id='control_plan'
                        placeholder='Select control plan'
                        maxSelectedLabels={3}
                        className="w-full md:w-20rem"
                    />
                </div>

                {/*severity */}
                <div>
                    <label htmlFor='severity'>Severity</label>
                    <Dropdown id='severity' name='severity' value={formValues.severity.value}
                              onChange={handleChange} className="w-full md:w-14rem"
                              options={severity} optionLabel={"label"} placeholder='How severity id this law?'/>
                </div>

                {/*description*/}
                <div>
                    <label htmlFor='description'>Theme/Description</label>
                    <InputTextarea autoResize value={formValues.theme.value} id='description'
                                   onChange={handleChange}
                                   placeholder="Theme/Description of the law" className='w-full'/>
                </div>

                {/*article*/}
                <div>
                    <label htmlFor='article'>Article</label>
                    <InputTextarea autoResize value={formValues.article.value} id='article'
                                   onChange={handleChange}
                                   placeholder="Enter and article for this law" className='w-full'/>
                </div>

                {/*checkbox options*/}
                {/* show checkboxes if title matches various options in array according to the fields in question. */}

                <div>

                    <div
                        className={`${['law', 'decree'].includes(formValues["title"].value.toLowerCase()) ? 'flex' : 'hidden'} 
                        justify-content-center mb-2`}
                    >
                        <Checkbox onChange={handleCheckDecree} inputId="decrees"
                                  checked={checkDecree}>
                        </Checkbox>
                        <label htmlFor="decrees" className="ml-2">Has Decree(s)?</label>
                    </div>

                    <div
                        className={`${['law', 'decree', 'order'].includes(formValues["title"].value.toLowerCase()) ? 'flex' : 'hidden'} 
                        justify-content-center mb-2`}
                    >
                        <Checkbox onChange={handleCheckOrder} inputId="orders"
                                  checked={checkOrder}>
                        </Checkbox>
                        <label htmlFor="orders" className="ml-2">Has Order(s)?</label>
                    </div>

                    <div
                        className={`${['law', 'decisions'].includes(formValues["title"].value.toLowerCase()) ? 'flex' : 'hidden'} 
                        justify-content-center mb-2`}
                    >
                        <Checkbox onChange={handleCheckDecision} inputId="decision"
                                  checked={checkDecision}>
                        </Checkbox>
                        <label htmlFor="decision" className="ml-2">Has Decision(s)?</label>
                    </div>

                </div>


                {/* This is to add support for laws that have decrees, orders or decisions */}
                <div className="flex justify-content-center flex-col gap-4">
                    {/* If law has decrees, register them */}
                    {
                        // If law has decrees, register them
                        ['law', 'decree', 'order'].includes(formValues["title"].value.toLowerCase()) ?
                            <>
                                {
                                    checkDecree ?
                                        // decree title
                                        <div>
                                            <label htmlFor='decree_title'>Enter decree title</label>
                                            <InputText type="text" name='decree_title' className="p-inputtext-md w-full"
                                                       placeholder={decreePlaceHolder}
                                                       value={decreeTitle}
                                                       onChange={(x) => setDecreeTitle(x.target.value)}/>
                                        </div>
                                        :
                                        // If law has orders
                                        checkOrder ?
                                            // order title
                                            <div>
                                                <label htmlFor='order_title'>Enter order title</label>
                                                <InputText type="text" name='order_title'
                                                           className="p-inputtext-md w-full"
                                                           placeholder={orderPlaceHolder}
                                                           value={order}
                                                           onChange={e => setOrder(e.target.value)}/>
                                            </div>

                                            :
                                            checkDecision ?
                                                // decision title
                                                <div>
                                                    <label htmlFor='decision_title'>Enter decision title</label>
                                                    <InputText type="text" name='decision_title'
                                                               className="p-inputtext-md w-full"
                                                               placeholder={decisionPlaceHolder}
                                                               value={decisions}
                                                               onChange={e => setDecisions(e.target.value)}/>
                                                </div>

                                                :
                                                null
                                }

                            </> : null
                    }

                    {
                        (checkDecree || checkOrder || checkDecision)
                        && ['law', 'decree', 'order'].includes(formValues["title"].value.toLowerCase())
                            ?
                            // <MultiSelect
                            //     value={selectedOptions}
                            //     onChange={handleSelectedOption}
                            //     options={options}
                            //     optionGroupChildren="decisions"
                            //     optionLabel="title"
                            //     filter placeholder={`This ${optionPlaceholder} depends on ?`}
                            //     maxSelectedLabels={3}
                            //     optionGroupTemplate={
                            //     <div>{options?.title} </div>
                            //     }
                            //     className="w-full md:w-20rem" />
                            // <TreeSelect  display='chip' emptyMessage='No input' filter
                            //              value={selectedOptions} onChange={handleSelectedOption}
                            //              options={lawsObjects} className="md:w-20rem w-full"
                            //              placeholder={`This ${optionPlaceholder} depends on ?`} >
                            // </TreeSelect>
                            <div>
                                <label htmlFor={`${optionPlaceholder}_list`}>This {optionPlaceholder} depends
                                    on?</label>
                                <Dropdown id={`${optionPlaceholder}_list`} name={optionPlaceholder}
                                          value={ selectedOptions }
                                          onChange={handleSelectedOption} options={locations}
                                          placeholder={`This ${optionPlaceholder} depends on ?`}
                                          className="w-full md:w-14rem"/>
                            </div>
                            : null
                    }

                    {/* Add buttons */}
                    <Button onClick={handleAddNewDecree}
                            hidden={!checkDecree}
                            disabled={disableAddDecree} label="Add Decree"
                            icon="pi pi-plus" size="small" className='add-new-btn'/>

                    <Button onClick={handleAddNewOrder}
                            hidden={!checkOrder}
                            disabled={disableAddOrder} label="Add Order"
                            icon="pi pi-plus" size="small" className='add-new-btn'/>

                    <Button onClick={handleAddNewDecision}
                            hidden={!checkDecision}
                            disabled={disableAddDecision} label="Add Decision"
                            icon="pi pi-plus" size="small" className='add-new-btn'/>

                </div>

            </div>

            <div>
                {
                    !typedOptions.length && typedOptions.map((x: any, idx: Key | null | undefined) => {
                        return (
                            <Chip label={x?.title} key={idx} removable onRemove={(e) => removeOptions(x.id)} />
                        )
                    })
                }
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

const lawsObjects = [
    {
        id:"6447fe9b6b1d4716d1b01014",
        label:"Decree #123",
        value:"Decree",
        children: [
            {
                label: "Association reference",
                value: "Association"
            }
        ],
    }
];
