import React, { useEffect, useRef, useState } from "react";
import { HiArrowSmRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../core/Button/Button";
import { register } from "../../../services/auth.service";
import "../register.scss";
import { Toast } from "primereact/toast";
import { LocalStore } from "../../../utils/storage.utils";
import { UserTypes } from "../../../constants/user.constants";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { MultiSelect } from "primereact/multiselect";
import { createCompany } from "../../../services/companies.service";
import { MenuItem } from "primereact/menuitem";
import { Dropdown } from "primereact/dropdown";
import { countryConstants } from "../../../constants/country.constants";
import { InputNumber } from "primereact/inputnumber";
import useCompanyContext from "../../../hooks/useCompanyContext";
import { CompanyActionTypes } from "../../../store/action-types/company.actions";

const domainsList = [
  {
    label: "Air",
    value: "air",
  },
  { label: "Land", value: "land" },
  { label: "Water", value: "water" },
  { label: "Environment", value: "environment" },
  { label: "Business", value: "business" },
  { label: "Education", value: "education" },
  { label: "Transport", value: "transport" },
  { label: "Health", value: "health" },
  { label: "Agriculture", value: "agriculture" },
];

const languageOptions = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "French",
    value: "fr",
  },
];

const initialState = {
  company_name: {
    value: "",
  },
  language: {
    value: "",
  },
  domains: {
    value: "",
  },
  contact: {
    value: "",
  },
  country: {
    value: "",
  },
  address: {
    value: "",
  },
  legal_status: {
    value: "",
  },
  category: {
    value: "",
  },
  certification: {
    value: "",
  },
  number_of_employees: {
    value: "",
  },
  capital: {
    value: "",
  },
  function: {
    value: "",
  },
  username: {
    value: "",
  },
  email: {
    value: "",
  },
  password: {
    value: "",
  },
  cPassword: {
    value: "",
  },
};

function Register() {
  const [formValues, setFormValues] =
    useState<Record<string, any>>(initialState);
  const [nextPage, setNextPage] = useState(false);

  const navigator = useNavigate();

  const { state, dispatch } = useCompanyContext();

  const toast = useRef({});

  useEffect(() => {
    (async () => {
      const resolvedState = await state;
      if (resolvedState.hasCreated) {
      }
    })();
  }, [state]);

  const handleState = (e: any) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: {
        ...formValues[name],
        value,
      },
    });
  };

  const signInHandler = async () => {
    let payload: any = {
      role: UserTypes.COMPANY_OWNER,
    };
    Object.entries(formValues).forEach(([key, value]) => {
      key.toLowerCase() !== "cPassword" && (payload[key] = value.value);
    });

    const newCompany = await createCompany({
      name: payload.company_name,
      admin_email: payload.email,
      contact: payload.contact,
      sector: payload.domains,
      language: payload.language,
      capital: payload.capital,
      category: payload.category,
      certification: payload.certification,
      country: payload.country,
      function: payload.function,
      legal_status: payload.legal_status,
      number_of_employees: payload.number_of_employees,
      address: payload.address,
    });

    if (newCompany) {
      const data = await register({
        username: payload.username,
        email: payload.email,
        password: payload.password,
        company_id: newCompany.id,
      });
      console.log(data);
      if (data) {
        (toast.current as any).show({
          severity: "success",
          summary: "Signup success",
          detail: "Account successfully created",
          life: 5000,
        });
        LocalStore.set("user", data);
        setTimeout(() => navigator("/dashboard/home"), 5000);
      } else {
        (toast.current as any).show({
          severity: "error",
          summary: "Registration failed",
          detail: "Request was unsuccessful",
          life: 5000,
        });
      }
    }
  };

  return (
    <section className="block md:flex h-screen">
      <Toast ref={toast as any} />

      <div className="welcome-container w-full md:w-4/12 md:px-20 p-6 md:flex flex-col justify-center items-center">
        <h1 className="welcome-main-text hidden md:block md:w-full">
          The best compliance management and ISO standardization software
        </h1>
        <br />
        <p className="text-gray-200 hidden md:block w-full">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente sit,
          suscipit reprehenderit voluptate, tenetur error enim iure esse iusto
          rem, quasi provident quas aliquid asperiores necessitatibus?
        </p>
      </div>

      {/*form section*/}
      <div className="signup-section p-4 md:px-10 w-full md:w-8/12 flex items-center flex-col justify-center gap-1">
        <form className="w-9/12">
          <div hidden={nextPage}>
            <h1 className="register-title text-2xl pb-6 border-b">
              Company's information
            </h1>
            <div className="grid gird-cols-1 mt-6 md:grid-cols-2 gap-4">
              {/*company name*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="company_name">Company name</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-user text-gray-400" />
                  <InputText
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formValues?.company_name?.value}
                    className="w-full"
                    placeholder="Enter company's name"
                    onChange={handleState}
                  />
                </span>
              </div>

              {/*language*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="language">Language</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-user text-gray-400" />
                  <Dropdown
                    id="language"
                    name="language"
                    value={formValues.language.value}
                    onChange={handleState}
                    options={languageOptions}
                    optionLabel="label"
                    placeholder="Choose a language"
                    className="w-full"
                  />
                </span>
              </div>

              {/*domain */}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="domains">Domains of action</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-building text-gray-400" />
                  <MultiSelect
                    id="domains"
                    name="domains"
                    filter
                    display="chip"
                    value={formValues.domains.value}
                    onChange={handleState}
                    className="w-full"
                    options={domainsList}
                    placeholder="Select the domains of action"
                  />
                </span>
              </div>

              {/*company contact*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="contact">Company's contact</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-user text-gray-400" />
                  <InputText
                    type="text"
                    id="contact"
                    name="contact"
                    className="w-full"
                    value={formValues.contact.value}
                    placeholder="Enter company's contact"
                    onChange={handleState}
                  />
                </span>
              </div>

              {/*company country*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="country">Company country</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-building text-gray-400" />
                  <Dropdown
                    value={formValues.country.value}
                    onChange={handleState}
                    options={countryConstants}
                    optionLabel="name"
                    id="country"
                    placeholder="Select a country"
                    filter
                    valueTemplate={selectedCountryTemplate}
                    itemTemplate={countryOptionTemplate}
                    className="w-full md:w-14rem"
                  />
                </span>
              </div>

              {/*address*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="address">Address</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-map-marker text-gray-400" />
                  <InputText
                    id="address"
                    type="text"
                    name="address"
                    value={formValues.address.value}
                    placeholder="Enter address"
                    className="w-full"
                    onChange={handleState}
                  />
                </span>
              </div>

              {/*company legal status*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="legal_status">Legal status</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-pencil text-gray-400" />
                  <InputText
                    id="legal_status"
                    type="text"
                    name="legal_status"
                    value={formValues.legal_status.value}
                    placeholder="Enter company's legal status"
                    className="w-full"
                    onChange={handleState}
                  />
                </span>
              </div>

              {/*Category*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="category">Category</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-pencil text-gray-400" />
                  <InputText
                    id="category"
                    type="text"
                    name="category"
                    value={formValues.category.value}
                    placeholder="Enter company's category"
                    className="w-full"
                    onChange={handleState}
                  />
                </span>
              </div>

              {/*certification*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="certification">Certification</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-pencil text-gray-400" />
                  <InputText
                    id="certification"
                    type="text"
                    name="certification"
                    value={formValues.certification.value}
                    placeholder="Enter company's category"
                    className="w-full"
                    onChange={handleState}
                  />
                </span>
              </div>

              {/*capital*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="capital">Company capital</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-pencil text-gray-400" />
                  <InputText
                    id="capital"
                    type="text"
                    name="capital"
                    value={formValues.capital.value}
                    placeholder="Enter company's capital"
                    className="w-full"
                    onChange={handleState}
                  />
                </span>
              </div>

              {/*number of employees*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="number_of_employees">Number of employees</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-pencil text-gray-400" />
                  <InputNumber
                    id="number_of_employees"
                    type="text"
                    name="number_of_employees"
                    value={formValues.number_of_employees.value}
                    placeholder="Number of employees"
                    className="w-full"
                    onValueChange={handleState}
                  />
                </span>
              </div>

              {/*company function*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="function">Function</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-pencil text-gray-400" />
                  <InputText
                    id="function"
                    type="text"
                    name="function"
                    value={formValues.function.value}
                    placeholder="Enter company's function"
                    className="w-full"
                    onChange={handleState}
                  />
                </span>
              </div>
            </div>
          </div>

          <div hidden={!nextPage}>
            <h1 className="register-title text-2xl pb-6 border-b">
              Administrator's information
            </h1>
            {/*username*/}
            <div className="w-full flex flex-col my-4">
              <label htmlFor="username">Administrator's name</label>
              <span className="p-input-icon-left">
                <i className="pi pi-user text-gray-400" />
                <InputText
                  id="username"
                  name="username"
                  value={formValues.username.value}
                  placeholder="Enter username"
                  type="text"
                  className="w-full"
                  onChange={handleState}
                />
              </span>
            </div>

            {/*email*/}
            <div className="w-full flex flex-col my-4">
              <label htmlFor="email">Email</label>
              <span className="p-input-icon-left">
                <i className="pi pi-envelope text-gray-400" />
                <InputText
                  id="email"
                  type="email"
                  name="email"
                  value={formValues.email.value}
                  placeholder="Email address"
                  className="w-full"
                  onChange={handleState}
                />
              </span>
            </div>

            {/*password*/}
            <div className="w-full flex flex-col my-4 form-control">
              <label htmlFor="password">Password</label>
              <span className="p-input-icon-left">
                <i className="pi pi-lock text-gray-400" />
                <Password
                  placeholder="Enter password"
                  name="password"
                  id="password"
                  value={formValues.password.value}
                  className="password"
                  onChange={handleState}
                  toggleMask
                />
              </span>
            </div>

            {/*confirm password*/}
            <div className="w-full flex flex-col my-4 form-control">
              <label htmlFor="cPassword">Confirm password</label>
              <span className="p-input-icon-left">
                <i className="pi pi-lock-open text-gray-400" />
                <Password
                  placeholder="Re-enter password"
                  className="password"
                  name="cPassword"
                  id="password"
                  value={formValues.cPassword.value}
                  onChange={handleState}
                  toggleMask
                />
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col items-end my-4 form-control">
            <p className="text-gray-500 text-sm font-light">
              Already have an account?{" "}
              <Link
                className="text-orange-500 underline hover:text-orange-700 font-medium"
                to="/login"
              >
                Log in
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-5">
            <button
              id="return"
              className={`py-2 ${
                !nextPage ? "hidden" : "flex"
              } items-center gap-4 text-red-500 rounded-md  w-auto px-4 border border-red-500`}
              onClick={(e: any) => {
                e.preventDefault();
                setNextPage(false);
              }}
            >
              <i className="pi pi-arrow-left"></i>
              Back
            </button>
            <Button
              title={!nextPage ? "Next page" : "Submit"}
              Icon={{
                classes: "",
                Name: HiArrowSmRight,
                color: "white",
              }}
              styles="w-full md:w-auto py-2.5 items-center justify-center"
              onClick={(e: any) => {
                setNextPage(true);
              }}
            />
          </div>
        </form>
      </div>
    </section>
  );
}

export default Register;

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
