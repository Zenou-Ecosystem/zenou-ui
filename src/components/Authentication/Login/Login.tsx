import React, { useRef, useState } from "react";
import { HiArrowSmRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../core/Button/Button";
import { login } from "../../../services/auth.service";
import "../register.scss";
import { Toast } from "primereact/toast";
import { LocalStore } from "../../../utils/storage.utils";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { currentLanguageValue, translationService } from '../../../services/translation.service';
import Locale from '../../locale';

const initialState = {
  email: {
    value: "",
  },
  password: {
    value: "",
  },
};

function Login() {
  const navigator = useNavigate();

  const toast = useRef({});

  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  const [formValues, setFormValues] =
    useState<Record<string, any>>(initialState);

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

  const signInHandler = async () => {
    let payload: any = {};

    Object.entries(formValues).forEach(([key, value]) => {
      key.toLowerCase() !== "cPassword" && (payload[key] = value.value);
    });

    const data = await login(payload);
    if (data && data?.access_token) {
      (toast.current as any).show({
        severity: "success",
        summary: "Login success",
        detail: "Welcome back",
        life: 5000,
      });

      LocalStore.set("user", data);
      navigator("/dashboard/home", { replace: true });
    } else {
      (toast.current as any).show({
        severity: "error",
        summary: "Login failed",
        detail: data?.message ?? "Request was unsuccessful",
        life: 5000,
      });
    }
  };

  return (
    <section className="block md:flex relative h-screen">
      <Toast ref={toast as any} />
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
        <form className="w-full">
          <h1 className="register-title text-2xl">{translationService(currentLanguage,'LOGIN.TITLE')}
          </h1>
          <Divider />

          {/*email*/}
          <div className="w-full flex flex-col my-4">
            <label htmlFor="email">{translationService(currentLanguage,'REGISTRATION.FORM.ADMIN_INFORMATION.EMAIL')}</label>
            <span className="p-input-icon-left">
              <i className="pi pi-envelope text-gray-400" />
              <InputText
                id="email"
                type="email"
                name="email"
                value={formValues.email.value}
                placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.ADMIN_INFORMATION.EMAIL')}
                className="w-full"
                onChange={handleState}
              />
            </span>
          </div>

          {/*password*/}
          <div className="w-full flex flex-col my-4 form-control">
            <label htmlFor="password">{translationService(currentLanguage,'REGISTRATION.FORM.ADMIN_INFORMATION.PASSWORD')}</label>
            <span className="p-input-icon-left">
              <i className="pi pi-lock text-gray-400" />
              <Password
                placeholder={translationService(currentLanguage,'REGISTRATION.FORM.PLACEHOLDER.ADMIN_INFORMATION.PASSWORD')}
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
