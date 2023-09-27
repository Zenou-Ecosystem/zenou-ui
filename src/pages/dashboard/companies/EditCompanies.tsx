import React, { useState } from "react";
import "./index.scss";
import { LocalStore } from "../../../utils/storage.utils";
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import { TabMenu } from "primereact/tabmenu";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import CountryList from "country-list-with-dial-code-and-flag";
import { MultiSelect } from "primereact/multiselect";
import Button from "../../../core/Button/Button";
import { HiArrowSmRight, HiCheck } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import httpHandlerService from '../../../services/httpHandler.service';
import { CompanyActionTypes, ICompanyActions } from '../../../store/action-types/company.actions';
import { Dispatch } from 'redux';

export default function EditCompany(props: {hideAction: Function, stateGetter: Function}) {
  const editItems = LocalStore.get("EDIT_DATA");
  const dispatch = useDispatch<Dispatch<ICompanyActions>>();

  const initialState = {
    company_name: {
      value: editItems?.name ?? "",
    },
    language: {
      value: editItems?.language ?? "",
    },
    domains: {
      value: editItems?.sector ?? "",
    },
    contact: {
      value: editItems?.contact ?? "",
    },
    country: {
      value: editItems?.country ?? "",
    },
    address: {
      value: editItems?.address ?? "",
    },
    legal_status: {
      value: editItems?.legal_status ?? "",
    },
    category: {
      value: editItems?.category ?? "",
    },
    certification: {
      value: editItems?.certification ?? "",
    },
    number_of_employees: {
      value: editItems?.number_of_employees ?? "",
    },
    capital: {
      value: editItems?.capital ?? "",
    },
    function: {
      value: editItems?.function ?? "",
    },
  };

  const [formValues, setFormValues] = React.useState<Record<string, any>>(initialState);

  const [currentLanguage, setCurrentLanguage] = React.useState<string>('fr');

  React.useMemo(()=>currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

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
  ];

  const [activeTab, setActiveTab] = useState<any>(0);

  const handleSubmit = () => {

    let payload: any = {};

    Object.entries(formValues).forEach(([key, value]) => {
      key.toLowerCase() !== "cPassword" && (payload[key] = value.value);
    });

    const data = {
      name: payload.company_name,
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
    }

    dispatch(
      httpHandlerService({
        endpoint: 'company',
        method: 'PATCH',
        data,
        id: editItems.id,
        showModalAfterRequest: true
      }, CompanyActionTypes.EDIT_COMPANY) as any
    );
    props.hideAction();
  };

  return (
    <section className="">
      <form className="w-full">

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
            title={activeTab !== 1 ? translationService(currentLanguage,'REGISTRATION.BUTTON.NEXT') : translationService(currentLanguage,'REGISTRATION.BUTTON.SUBMIT')}
            Icon={{
              classes: "",
              Name: activeTab !== 1 ? HiArrowSmRight : HiCheck,
              color: "white",
            }}
            styles={`w-full md:w-auto py-2.5 px-4 items-center justify-center ${activeTab !== 1 ?'':'flex-row-reverse'}`}
            onClick={() => {
              activeTab !== 1 ? setActiveTab((prev:number) => prev +1) : handleSubmit();
            }}
          />
        </div>
      </form>
    </section>
  );
}

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
