import { useEffect, useState } from 'react'
import Button from '../../../core/Button/Button';
import BasicCard from '../../../core/card/BasicCard';
import Input from '../../../core/Input/Input';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CompanyActionTypes } from '../../../store/action-types/company.actions';
import useCompanyContext from '../../../hooks/useCompanyContext';

function AddCompany() {

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('')
    const [language, setLanguage] = useState('')
    const [contact, setContact] = useState('');
    const [legal_status, setLegalStatus] = useState('');
    const [capital, setCapital] = useState('');
    const [number_of_employees, setNumOfEmpl] = useState(0);
    const [comFunction, setComFunction] = useState('');
    const [category, setCategory] = useState('');
    const [sector, setSector] = useState('');
    const [certification, setCertification] = useState('');
    const [loader, setLoader] = useState(false);
    const { state, dispatch } = useCompanyContext();

    const getName = (name: string) => setName(name);
    const getAddress = (address: string) => setAddress(address);
    const getSector = (sector: string) => setSector(sector);
    const getCategory = (category: string) => setCategory(category);
    const getCertification = (certification: string) => setCertification(certification);
    const getCapital = (capital: string) => setCapital(capital);
    const getContact = (contact: string) => setContact(contact);
    const getLanguage = (language: string) => setLanguage(language);
    const getLegalStatus = (legalStatus: string) => setLegalStatus(legalStatus);
    const getCountry = (country: string) => setCountry(country);
    const getNumOfEmpl = (numOfEmpl: number) => setNumOfEmpl(numOfEmpl);
    const getComFunction = (comFunction: string) => setComFunction(comFunction);

    const handleSubmission = () => {
        setLoader(true);
        dispatch({
            type: CompanyActionTypes.ADD_COMPANY, payload: {
                name, capital, contact, certification, country,
                function: comFunction, sector, category
                , number_of_employees,
                language, legal_status, address
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
                <div className="company-name">
                    <Input type='text' placeholder='Company Name' onChange={getName} />
                </div>
                <div className="company-language">
                    <Input type='text' placeholder='language' onChange={getLanguage} />
                </div>
                <div className="company-Sector">
                    <Input type='text' placeholder='Sector' onChange={getSector} />
                </div>
                <div className="company-Contact">
                    <Input type='text' placeholder='Contact' onChange={getContact} />
                </div>
                <div className="company-Country">
                    <Input type='text' placeholder='Country' onChange={getCountry} />
                </div>
                <div className="company-address">
                    <Input type='address' placeholder='Company address' onChange={getAddress} />
                </div>
                <div className="company-LegalStatus">
                    <Input type='text' placeholder='Legal Status' onChange={getLegalStatus} />
                </div>
                <div className="company-Category">
                    <Input type='text' placeholder='Category' onChange={getCategory} />
                </div>
                <div className="company-Certification">
                    <Input type='text' placeholder='Certification' onChange={getCertification} />
                </div>
                <div className="company-Capital">
                    <Input type='text' placeholder='Capital' onChange={getCapital} />
                </div>
                <div className="company-NumOfEmpl">
                    <Input type='number' placeholder='Number Of Employees' onChange={getNumOfEmpl} />
                </div>
                <div className="company-ComFunction">
                    <Input type='text' placeholder='Function' onChange={getComFunction} />
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
        title: 'Company information',
        content: addForm
    }

    return (
        <section>
            {/* <BasicCard {...cardProps} /> */}
            {addForm()}
        </section>
    )
}

export default AddCompany