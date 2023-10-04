import React, { useState } from "react";
import { HiArrowSmRight, HiCheck } from 'react-icons/hi';
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../core/Button/Button";
import "../register.scss";
import { UserTypes } from "../../../constants/user.constants";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { TabMenu } from 'primereact/tabmenu';
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import Locale from '../../locale';
import CountryList from 'country-list-with-dial-code-and-flag';
import httpHandlerService from '../../../services/httpHandler.service';
import { CompanyActionTypes, ICompanyActions } from '../../../store/action-types/company.actions';
import Config from '../../../constants/config.constants';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { initialState } from '../../../store/state';
import { IUserActions, UserActionTypes } from '../../../store/action-types/user.actions';
import { IModalActions, ModalActionsTypes } from '../../../store/action-types/modal.actions';

const initialFormState = {
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
  const [formValues, setFormValues] = React.useState<Record<string, any>>(initialFormState);

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  const navigator = useNavigate();

  const companies = useSelector((state: typeof initialState) => state.companies);

  const modal = useSelector((state: typeof initialState) => state.modal);

  const dispatch = useDispatch<Dispatch<ICompanyActions | IUserActions | IModalActions>>();

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), []);

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

  const items = [
    {label: translationService(currentLanguage,'REGISTRATION.TAB.PRIMARY'), icon: 'pi pi-eraser'},
    {label: translationService(currentLanguage,'REGISTRATION.TAB.SECONDARY'), icon: 'pi pi-file-edit'},
    {label: translationService(currentLanguage,'REGISTRATION.TAB.INFORMATION'), icon: 'pi pi-user-plus'}
  ];

  const [activeTab, setActiveTab] = useState<any>(0);

  const signInHandler = async () => {

    let payload: any = {
      role: UserTypes.COMPANY_OWNER,
    };

    Object.entries(formValues).forEach(([key, value]) => {
      key.toLowerCase() !== "cPassword" && (payload[key] = value.value);
    });

    const newData = {
      name: payload.company_name,
      admin_email: payload.email,
      contact: payload.contact,
      domains: payload.domains,
      language: payload.language,
      capital: payload.capital,
      category: payload.category,
      certification: payload.certification,
      country: payload.country,
      function: payload.function,
      legal_status: payload.legal_status,
      number_of_employees: payload.number_of_employees,
      address: payload.address,
    }

    dispatch(
      httpHandlerService({
        endpoint: 'company',
        method: 'POST',
        data: newData
      }, CompanyActionTypes.ADD_COMPANY) as any
    );

    const currentCompany = companies.find(company => company.admin_email === newData.admin_email);

    if(currentCompany) {
      const data = {
        username: payload.username,
        email: payload.email,
        password: payload.password,
        company_id: currentCompany.id,
        address: payload.address,
        role: payload.role,
        sector: payload.domains,
      };
      dispatch(
        httpHandlerService({
          endpoint: 'register',
          method: 'POST',
          baseUrl: `${Config.authBaseUrl}/register`,
          data,
        }, UserActionTypes.AUTHENTICATE_USER) as any
      )
      navigator('/dashboard/home');
    }

  };

  function HandleModal () {
    if(modal) {
      return (
        <div className="py-4 w-full">
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-center mb-2">
              <h3 className="text-red-800 font-medium">{modal?.headerText}</h3>
              <button className="ml-auto" onClick={(e) => {
                e.preventDefault();
                dispatch({type: ModalActionsTypes.HIDE_MODAL, payload: null});
              }}>
                <svg className="text-red-800" width="12" height="12" viewBox="0 0 12 12" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.93341 6.00008L11.1334 1.80008C11.4001 1.53341 11.4001 1.13341 11.1334 0.866748C10.8667 0.600081 10.4667 0.600081 10.2001 0.866748L6.00008 5.06675L1.80008 0.866748C1.53341 0.600081 1.13341 0.600081 0.866748 0.866748C0.600082 1.13341 0.600082 1.53341 0.866748 1.80008L5.06675 6.00008L0.866748 10.2001C0.733415 10.3334 0.666748 10.4667 0.666748 10.6667C0.666748 11.0667 0.933415 11.3334 1.33341 11.3334C1.53341 11.3334 1.66675 11.2667 1.80008 11.1334L6.00008 6.93341L10.2001 11.1334C10.3334 11.2667 10.4667 11.3334 10.6667 11.3334C10.8667 11.3334 11.0001 11.2667 11.1334 11.1334C11.4001 10.8667 11.4001 10.4667 11.1334 10.2001L6.93341 6.00008Z"
                    fill="currentColor"></path>
                </svg>
              </button>
            </div>
            <div className="pr-6">
              <p className="text-sm text-red-700">{modal?.bodyText}</p>
            </div>
          </div>
        </div>
      )
    }else {
      return <></>
    }
  }

  return (
    <section className="block md:flex relative h-screen">
      <div className='absolute right-5 top-[93%] md:top-5'>
       <Locale />
      </div>

      <div className="welcome-container w-full m md:w-5/12  md:flex flex-col ">
        <div className='welcome-image md:h-screen h-[5vh]'></div>
        <div className='welcome-text register hidden flex-col md:flex'>
          <h1 className="welcome-main-text hidden md:block">
            {translationService(currentLanguage,'REGISTRATION.SIDE_MESSAGE.TITLE')}
          </h1>
          <br />
          <p className="text-gray-200 hidden md:block">
            {translationService(currentLanguage,'REGISTRATION.SIDE_MESSAGE.SUBTITLE')}
          </p>
        </div>
      </div>

      {/*form section*/}
      <div className="signup-section p-4 md:px-10 w-full md:w-7/12 flex items-center flex-col justify-center gap-1">
        <HandleModal />
        <form className=" w-full md:w-9/12">

          <TabMenu className='tab-menu truncate' model={items} activeIndex={activeTab} onTabChange={(e) => {
           setActiveTab(e.index);
          }} />

          {/*primary information*/}
          <div hidden={activeTab !== 0}>
            <br/>

            {/*company name*/}
            <div className="w-full flex my-4 flex-col form-control">
              <label htmlFor="company_name">{translationService(currentLanguage,'REGISTRATION.FORM.NAME')}</label>
              <span className="p-input-icon-left">
                  <i className="pi pi-user text-gray-400" />
                  <InputText
                    id="company_name"
                    name="company_name"
                    value={formValues?.company_name?.value}
                    className="w-full"
                    placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.NAME')}
                    onChange={handleState}
                  />
                </span>
            </div>

            {/*legal status / certification*/}
            <div className="grid grid-cols-1 my-4 md:grid-cols-2 gap-4">

              {/*company legal status*/}
                <div className="w-full flex flex-col form-control">
                  <label htmlFor="legal_status">{translationService(currentLanguage,'REGISTRATION.FORM.LEGAL_STATUS')}</label>
                  <span className="p-input-icon-left">
                      <i className="pi pi-check-circle text-gray-400" />
                      <InputText
                        id="legal_status"
                        name="legal_status"
                        value={formValues.legal_status.value}
                        placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.LEGAL_STATUS')}
                        className="w-full"
                        onChange={handleState}
                      />
                    </span>
                </div>

              {/*certification*/}
                <div className="w-full flex flex-col form-control">
                  <label htmlFor="certification">{translationService(currentLanguage,'REGISTRATION.FORM.CERTIFICATION')}</label>
                  <span className="p-input-icon-left">
                      <i className="pi pi-file-pdf text-gray-400" />
                      <InputText
                        id="certification"
                        name="certification"
                        value={formValues.certification.value}
                        placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.CERTIFICATION')}
                        className="w-full"
                        onChange={handleState}
                      />
                    </span>
                </div>
            </div>

            {/*company country*/}
            <div className="w-full flex flex-col my-4 form-control">
              <label htmlFor="country">{translationService(currentLanguage,'REGISTRATION.FORM.COUNTRY')}</label>
              <span className="p-input-icon-left">
                  <i className="pi pi-globe text-gray-400" />
                  <Dropdown
                    value={formValues.country.value}
                    onChange={handleState}
                    name="country"
                    options={CountryList.getAll()}
                    optionLabel="name"
                    id="country"
                    placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.COUNTRY')}
                    filter
                    valueTemplate={selectedCountryTemplate}
                    itemTemplate={countryOptionTemplate}
                    className="w-full md:w-14rem"
                  />
                </span>
            </div>

            <div className="grid grid-cols-1 my-4 md:grid-cols-2 gap-4">

              {/*number of employees*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="number_of_employees">{translationService(currentLanguage,'REGISTRATION.FORM.NUMBER_OF_EMPLOYEES')}</label>
                <span className="p-input-icon-left">
                    <i className="pi pi-hashtag text-gray-400" />
                    <InputNumber
                      id="number_of_employees"
                      name="number_of_employees"
                      value={formValues.number_of_employees.value}
                      placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.NUMBER_OF_EMPLOYEES')}
                      className="w-full"
                      onValueChange={handleState}
                    />
                  </span>
              </div>

              {/*company function*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="function">{translationService(currentLanguage,'REGISTRATION.FORM.FUNCTION')}</label>
                <span className="p-input-icon-left">
                    <i className="pi pi-wrench text-gray-400" />
                    <InputText
                      id="function"
                      type="text"
                      name="function"
                      value={formValues.function.value}
                      placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.FUNCTION')}
                      className="w-full"
                      onChange={handleState}
                    />
                  </span>
              </div>
            </div>
          </div>

          {/*secondary information*/}
          <div hidden={activeTab !== 1}>
            <br/>

            {/*capital*/}
            <div className="w-full flex flex-col my-4 form-control">
              <label htmlFor="capital">{translationService(currentLanguage,'REGISTRATION.FORM.CAPITAL')}</label>
              <span className="p-input-icon-left">
                  <i className="pi pi-flag text-gray-400" />
                  <InputText
                    id="capital"
                    type="text"
                    name="capital"
                    value={formValues.capital.value}
                    placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.CAPITAL')}
                    className="w-full"
                    onChange={handleState}
                  />
                </span>
            </div>

            {/*contact / address*/}
            <div className="grid grid-cols-1 my-4 md:grid-cols-2 gap-4">
              {/*company contact*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="contact">{translationService(currentLanguage,'REGISTRATION.FORM.CONTACT')}</label>
                <span className="p-input-icon-left">
                      <i className="pi pi-phone text-gray-400" />
                      <InputText
                        type="text"
                        id="contact"
                        name="contact"
                        className="w-full"
                        value={formValues.contact.value}
                        placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.CONTACT')}
                        onChange={handleState}
                      />
                    </span>
              </div>

              {/*address*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="address">{translationService(currentLanguage,'REGISTRATION.FORM.ADDRESS')}</label>
                <span className="p-input-icon-left">
                      <i className="pi pi-map-marker text-gray-400" />
                      <InputText
                        id="address"
                        type="text"
                        name="address"
                        value={formValues.address.value}
                        placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.ADDRESS')}
                        className="w-full"
                        onChange={handleState}
                      />
                    </span>
              </div>
            </div>

            {/*Category*/}
            <div className="w-full flex flex-col form-control">
              <label htmlFor="category">{translationService(currentLanguage,'REGISTRATION.FORM.CATEGORY')}</label>
              <span className="p-input-icon-left">
                  <i className="pi pi-stop-circle text-gray-400" />
                  <InputText
                    id="category"
                    type="text"
                    name="category"
                    value={formValues.category.value}
                    placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.CATEGORY')}
                    className="w-full"
                    onChange={handleState}
                  />
                </span>
            </div>

            {/*domain / category*/}
            <div className="grid grid-cols-1 my-4 md:grid-cols-2 gap-4">
              {/*domain */}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="domains">{translationService(currentLanguage,'REGISTRATION.FORM.DOMAIN_OF_ACTION')}</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-chart-pie text-gray-400" />
                  <MultiSelect
                    id="domains"
                    name="domains"
                    filter
                    value={formValues.domains.value}
                    onChange={handleState}
                    className="w-full"
                    options={
                      [
                        { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.AIR'), value: "air"},
                        { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.LAND'), value: "land" },
                        { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.WATER'), value: "water" },
                        { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.ENVIRONMENT'), value: "environment" },
                        { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.BUSINESS'), value: "business" },
                        { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.EDUCATION'), value: "education" },
                        { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.TRANSPORT'), value: "transport" },
                        { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.HEALTH'), value: "health" },
                        { label: translationService(currentLanguage,'OPTIONS.SECTORS_OF_ACTIVITIES.AGRICULTURE'), value: "agriculture" },
                      ]
                    }
                    placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.DOMAIN_OF_ACTION')}
                  />
                </span>
              </div>

              {/*language*/}
              <div className="w-full flex flex-col form-control">
                <label htmlFor="language">{translationService(currentLanguage,'REGISTRATION.FORM.LANGUAGE')}</label>
                <span className="p-input-icon-left">
                  <i className="pi pi-language text-gray-400" />
                  <Dropdown
                    id="language"
                    name="language"
                    value={formValues.language.value}
                    onChange={handleState}
                    options={
                      [ {
                        label: translationService(currentLanguage,'OPTIONS.LANGUAGE.ENGLISH'),
                        value: "en",
                      },
                        {
                          label: translationService(currentLanguage,'OPTIONS.LANGUAGE.FRENCH'),
                          value: "fr",
                        }]
                    }
                    optionLabel="label"
                    placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.LANGUAGE')}
                    className="w-full"
                  />
                </span>
              </div>

            </div>
          </div>


          <div hidden={activeTab !== 2}>
            <br/>
            {/*username*/}
            <div className="w-full flex flex-col my-4">
              <label htmlFor="username">{translationService(currentLanguage,'REGISTRATION.FORM.NAME')}</label>
              <span className="p-input-icon-left">
                <i className="pi pi-user text-gray-400" />
                <InputText
                  id="username"
                  name="username"
                  value={formValues.username.value}
                  placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.NAME')}
                  type="text"
                  className="w-full"
                  onChange={handleState}
                />
              </span>
            </div>

            {/*email*/}
            <div className="w-full flex flex-col my-4">
              <label htmlFor="email">{translationService(currentLanguage,'REGISTRATION.FORM.EMAIL')}</label>
              <span className="p-input-icon-left">
                <i className="pi pi-envelope text-gray-400" />
                <InputText
                  id="email"
                  type="email"
                  name="email"
                  value={formValues.email.value}
                  placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.EMAIL')}
                  className="w-full"
                  onChange={handleState}
                />
              </span>
            </div>

            {/*password*/}
            <div className="w-full flex flex-col my-4 form-control">
              <label htmlFor="password">{translationService(currentLanguage,'REGISTRATION.FORM.PASSWORD')}</label>
              <span className="p-input-icon-left">
                <i className="pi pi-lock text-gray-400" />
                <Password
                  placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.PASSWORD')}
                  name="password"
                  mediumLabel={translationService(currentLanguage,'OPTIONS.MEDIUM')}
                  weakLabel={translationService(currentLanguage,'OPTIONS.WEAK')}
                  strongLabel={translationService(currentLanguage,'OPTIONS.STRONG')}
                  promptLabel={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.PASSWORD')}
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
              <label htmlFor="cPassword">{translationService(currentLanguage,'REGISTRATION.FORM.CONFIRM_PASSWORD')}</label>
              <span className="p-input-icon-left">
                <i className="pi pi-lock-open text-gray-400" />
                <Password
                  placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.CONFIRM_PASSWORD')}
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
              {translationService(currentLanguage, 'REGISTRATION.FORM.ALREADY_HAVE_AN_ACCOUNT')}{" "}
              <Link
                className="text-orange-500 underline hover:text-orange-700 font-medium"
                to="/login"
              >
                {translationService(currentLanguage, 'REGISTRATION.FORM.LOGIN')}
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              id="return"
              className={`py-2 ${
                activeTab === 0 ? "hidden" : "flex"
              } items-center gap-4 text-red-500 rounded-md  w-auto px-4 border border-red-500`}
              onClick={(e: any) => {
                e.preventDefault();
                setActiveTab((prev:number) => prev - 1);
              }}
            >
              <i className="pi pi-arrow-left"></i>
              {translationService(currentLanguage,'REGISTRATION.BUTTON.BACK')}
            </button>
            <Button
              title={activeTab !== 2 ? translationService(currentLanguage,'REGISTRATION.BUTTON.NEXT') : translationService(currentLanguage,'REGISTRATION.BUTTON.SUBMIT')}
              Icon={{
                classes: "",
                Name: activeTab !== 2 ? HiArrowSmRight : HiCheck,
                color: "white",
              }}
              styles={`w-full md:w-auto py-2.5 px-4 items-center justify-center ${activeTab !== 2?'':'flex-row-reverse'}`}
              onClick={() => {
                activeTab !== 2 ? setActiveTab((prev:number) => prev +1) : signInHandler().then(console.log);
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
      <div className="flex items-center">
        <div>{option?.flag}&nbsp;{option?.name}</div>
      </div>
    );
  }

  return <span>{props.placeholder}</span>;
};

const countryOptionTemplate = (option: any) => {
  return (
    <div className="flex items-center">
      <span className='text-3xl'>{option?.flag}</span>
      <div>&nbsp;{option?.name}</div>
    </div>
  );
};
