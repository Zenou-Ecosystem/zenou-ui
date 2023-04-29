import { useEffect, useRef, useState } from "react";
import Button from "../../../core/Button/Button";
import { ProgressSpinner } from "primereact/progressspinner";
import { CompanyActionTypes } from "../../../store/action-types/company.actions";
import useCompanyContext from "../../../hooks/useCompanyContext";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { countryConstants } from "../../../constants/country.constants";
import { register } from "../../../services/auth.service";
import { UserTypes } from "../../../constants/user.constants";
import { Toast } from "primereact/toast";

const languageOptions = [
  {
    label: "English",
    value: "eng",
  },
  {
    label: "French",
    value: "fr",
  },
];

const sectorOptions = [
  "air",
  "land",
  "water",
  "environment",
  "business",
  "education",
  "transport",
  "health",
  "agriculture",
];

function AddCompany() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState({});
  const [language, setLanguage] = useState("");
  const [contact, setContact] = useState("");
  const [legal_status, setLegalStatus] = useState("");
  const [capital, setCapital] = useState("");
  const [number_of_employees, setNumOfEmpl] = useState(0);
  const [comFunction, setComFunction] = useState("");
  const [category, setCategory] = useState("");
  const [sector, setSector] = useState("");
  const [certification, setCertification] = useState("");
  const [loader, setLoader] = useState(false);
  const { state, dispatch } = useCompanyContext();
  const toast = useRef({});

  const getName = (name: string) => setName(name);
  const getAddress = (address: string) => setAddress(address);
  const getSector = (sector: string) => setSector(sector);
  const getCategory = (category: string) => setCategory(category);
  const getCertification = (certification: string) =>
    setCertification(certification);
  const getCapital = (capital: string) => setCapital(capital);
  const getContact = (contact: string) => setContact(contact);
  const getLanguage = (language: string) => setLanguage(language);
  const getLegalStatus = (legalStatus: string) => setLegalStatus(legalStatus);
  const getCountry = (country: any) => setCountry(country?.name);
  const getNumOfEmpl = (numOfEmpl: number) => setNumOfEmpl(numOfEmpl);
  const getComFunction = (comFunction: string) => setComFunction(comFunction);

  const handleSubmission = () => {
    const password = Math.random().toString(36).substring(2);

    setLoader(true);

    // create and register the company's login account
    register({
      email: address, username: name, password,
      role: UserTypes.COMPANY_OWNER
    })
      .then(response => {

        dispatch({
          type: CompanyActionTypes.ADD_COMPANY,
          payload: {
            name,
            capital,
            contact,
            certification,
            country,
            function: comFunction,
            sector,
            category,
            number_of_employees,
            language,
            legal_status,
            address,
          },
        });

        // Show password for a while
        (toast.current as any).show(
          {
            severity: 'success',
            summary: 'Company Admin Account created',
            detail: `A new company admin account has been created for
              ${name} with credentials as Email = ${address} and Password = ${password}.
              Please use details to always log into the company account.`,
            life: 15000
          });

      });
  };

  useEffect(() => {
    (async () => {
      const resolvedState = await state;
      if (resolvedState.hasCreated) {
        setLoader(false);
      }
    })();
  }, [state]);

  const addForm = () => {
    return (
      <form className="w-full">
        <div className="form-elements grid md:grid-cols-2 gap-4">
          {/*company name*/}
          <div className="company-name">
            <label htmlFor="name">Company name</label>
            <InputText
              type="text"
              id="name"
              name="name"
              className="p-inputtext-md w-full"
              placeholder="Enter company name"
              onChange={(e) => getName(e.target.value)}
            />
          </div>

          {/*language*/}
          <div className="company-language">
            <label htmlFor="language">Language</label>
            <Dropdown
              id="language"
              name="language"
              value={language}
              onChange={(e) => getLanguage(e.value)}
              options={languageOptions}
              optionLabel="label"
              placeholder="Select language"
              className="w-full md:w-14rem"
            />

            {/*<Input type="text" placeholder="language" onChange={getLanguage} />*/}
          </div>

          {/*company sector */}
          <div className="company-Sector">
            <label htmlFor="sector">Domain</label>
            <Dropdown
              id="sector"
              name="sector"
              value={sector}
              onChange={(e) => getSector(e.value)}
              className="w-full md:w-14rem"
              options={sectorOptions}
              placeholder="Sector of action of this Law"
            />
          </div>

          {/*company contact*/}
          <div className="company-Contact">
            <label htmlFor="contact">Company contact</label>
            <InputText
              type="text"
              id="contact"
              name="contaxt"
              className="p-inputtext-md w-full"
              placeholder="Enter company contact"
              onChange={(e) => getContact(e.target.value)}
            />
            {/*<Input type="text" placeholder="Contact" onChange={getContact} />*/}
          </div>

          {/*company country*/}
          <div className="company-Country">
            <label htmlFor="country">Company country</label>
            <Dropdown
              value={country}
              onChange={(e) => getCountry(e.value)}
              options={countryConstants}
              optionLabel="name"
              id="country"
              placeholder="Select a country"
              filter
              valueTemplate={selectedCountryTemplate}
              itemTemplate={countryOptionTemplate}
              className="w-full md:w-14rem"
            />

            {/*<Input type="text" placeholder="Country" onChange={getCountry} />*/}
          </div>

          {/*company address*/}
          <div className="company-address">
            <label htmlFor="address">Company address</label>
            <InputText
              type="text"
              id="address"
              name="address"
              className="p-inputtext-md w-full"
              placeholder="Enter company's address"
              onChange={(e) => getAddress(e.target.value)}
            />
            {/*<Input*/}
            {/*  type="address"*/}
            {/*  placeholder="Company address"*/}
            {/*  onChange={getAddress}*/}
            {/*/>*/}
          </div>

          {/*company legal status*/}
          <div className="company-LegalStatus">
            <label htmlFor="legalStatus">Legal status</label>
            <InputText
              type="text"
              id="legalStatus"
              name="legalStatus"
              className="p-inputtext-md w-full"
              placeholder="Enter company's legal status"
              onChange={(e) => getLegalStatus(e.target.value)}
            />
            {/*<Input*/}
            {/*  type="text"*/}
            {/*  placeholder="Legal Status"*/}
            {/*  onChange={getLegalStatus}*/}
            {/*/>*/}
          </div>

          {/*Category*/}
          <div className="company-Category">
            <label htmlFor="category">Category</label>
            <InputText
              type="text"
              id="category"
              name="category"
              className="p-inputtext-md w-full"
              placeholder="Enter company's category"
              onChange={(e) => getCategory(e.target.value)}
            />
            {/*<Input type="text" placeholder="Category" onChange={getCategory} />*/}
          </div>

          {/*certification*/}
          <div className="company-Certification">
            <label htmlFor="certification">Certification</label>
            <InputText
              type="text"
              id="certification"
              name="certification"
              className="p-inputtext-md w-full"
              placeholder="Enter company's certification"
              onChange={(e) => getCertification(e.target.value)}
            />
            {/*<Input*/}
            {/*  type="text"*/}
            {/*  placeholder="Certification"*/}
            {/*  onChange={getCertification}*/}
            {/*/>*/}
          </div>

          {/*capital*/}
          <div className="company-Capital">
            <label htmlFor="capital">Company capital</label>
            <InputText
              type="text"
              id="capital"
              name="capital"
              className="p-inputtext-md w-full"
              placeholder="Enter company's capital"
              onChange={(e) => getCapital(e.target.value)}
            />
            {/*<Input type="text" placeholder="Capital" onChange={getCapital} />*/}
          </div>

          {/*number of employees*/}
          <div className="company-NumOfEmpl">
            <label htmlFor="number_of_employees">Number of employees</label>
            <InputNumber
              id="number_of_employees"
              value={number_of_employees}
              placeholder="Number Of Employees"
              onValueChange={(e) => getNumOfEmpl(e.value as number)}
            />
            {/*<Input*/}
            {/*  type="number"*/}
            {/*  placeholder="Number Of Employees"*/}
            {/*  onChange={getNumOfEmpl}*/}
            {/*/>*/}
          </div>

          {/*company function*/}
          <div className="company-ComFunction">
            <label htmlFor="function">Function</label>
            <InputText
              type="text"
              id="function"
              name="function"
              className="p-inputtext-md w-full"
              placeholder="Enter company's function"
              onChange={(e) => getComFunction(e.target.value)}
            />
            {/*<Input*/}
            {/*  type="text"*/}
            {/*  placeholder="Function"*/}
            {/*  onChange={getComFunction}*/}
            {/*/>*/}
          </div>
        </div>

        {/*button*/}
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
    title: "Company information",
    content: addForm,
  };

  return (
    <section>
      <Toast ref={toast as any} />
      {/* <BasicCard {...cardProps} /> */}
      {addForm()}
    </section>
  );
}

export default AddCompany;

const selectedCountryTemplate = (option: any, props: any) => {
  if (option) {
    return (
      <div className="flex align-items-center">
        <img
          alt={option.name}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: "18px" }}
        />
        <div>{option.name}</div>
      </div>
    );
  }

  return <span>{props.placeholder}</span>;
};

const countryOptionTemplate = (option: any) => {
  return (
    <div className="flex align-items-center">
      <img
        alt={option.name}
        src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
        className={`mr-2 flag flag-${option.code.toLowerCase()}`}
        style={{ width: "18px" }}
      />
      <div>{option.name}</div>
    </div>
  );
};
