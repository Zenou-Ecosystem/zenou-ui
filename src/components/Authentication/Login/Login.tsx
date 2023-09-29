import React from "react";
import { HiArrowSmRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../core/Button/Button";
import "../register.scss";
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import Locale from '../../locale';
import httpHandlerService from '../../../services/httpHandler.service';
import Config from '../../../constants/config.constants';
import { IUserActions, UserActionTypes } from '../../../store/action-types/user.actions';
import { Dispatch } from 'redux';
import { initialState } from '../../../store/state';
import { IModalActions, ModalActionsTypes } from '../../../store/action-types/modal.actions';

const initialFormState = {
  email: {
    value: "",
  },
  password: {
    value: "",
  },
};

function Login() {
  const navigator = useNavigate();

  const [currentLanguage, setCurrentLanguage] = React.useState<string>('fr');

  const user = useSelector((state: typeof initialState) => state.user);
  const modal = useSelector((state: typeof initialState) => state.modal);

  const dispatch = useDispatch<Dispatch<IUserActions | IModalActions>>();

  const [formValues, setFormValues] = React.useState<Record<string, any>>(initialFormState);

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

  const signInHandler = async () => {
    let payload: any = {};

    Object.entries(formValues).forEach(([key, value]) => {
      key.toLowerCase() !== "cPassword" && (payload[key] = value.value);
    });

    dispatch(
      httpHandlerService({
        endpoint: 'login',
        method: 'POST',
        baseUrl: `${Config.authBaseUrl}/login`,
        data: payload,
        showModalAfterRequest: true,
      }, UserActionTypes.AUTHENTICATE_USER) as any
    )

    if(user) {
      navigator("/dashboard/home", { replace: true });
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
      <div className='absolute right-5 top-5'>
        <Locale />
      </div>

      <div className="welcome-container w-full md:w-8/12  md:flex flex-col justify-center items-center">
        <div className='welcome-image'></div>
        <div className='welcome-text'>
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
      <div className="signup-section p-4 md:px-16 w-full md:w-4/12 flex items-center flex-col justify-center gap-1">
        <HandleModal />
        <form className="w-full">
          <h1 className="register-title text-2xl">{translationService(currentLanguage,'LOGIN.TITLE')}
          </h1>
          <Divider />


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
                id="password"
                value={formValues.password.value}
                className="password"
                onChange={handleState}
                toggleMask
              />
            </span>
          </div>

          <div className="w-full flex flex-col items-end my-4 form-control">
            <p className="text-gray-500 text-sm font-light">
              {translationService(currentLanguage,'LOGIN.FORM.DONT_HAVE_AN_ACCOUNT')}
              {" "}
              <Link
                className="text-orange-500 underline hover:text-orange-700 font-medium"
                to="/register"
              >
                {translationService(currentLanguage,'LOGIN.FORM.CREATE_ACCOUNT')}
              </Link>
            </p>
          </div>

          <Button
            title={translationService(currentLanguage,'REGISTRATION.BUTTON.SUBMIT')}
            Icon={{
              classes: "",
              Name: HiArrowSmRight,
              color: "white",
            }}
            styles="w-full md:w-auto py-2.5 px-5 items-center justify-center"
            onClick={signInHandler}
          />
        </form>
      </div>
    </section>
  );
}

export default Login;
