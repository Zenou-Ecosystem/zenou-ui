import React, { useRef, useState } from "react";
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

const domainsList = [
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
const initialState = {
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
  domains: {
    value: "",
  },
  address: {
    value: "",
  },
};
function Register() {
  const [formValues, setFormValues] =
    useState<Record<string, any>>(initialState);

  const navigator = useNavigate();

  const toast = useRef({});

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

    const data = await register(payload);
    if (data) {
      (toast.current as any).show({
        severity: "success",
        summary: "Signup success",
        detail: "Account successfully created",
        life: 5000,
      });
      LocalStore.set("token", data?.access_token);
      navigator("/dashboard/home");
    } else {
      (toast.current as any).show({
        severity: "error",
        summary: "Registration failed",
        detail: "Request was unsuccessful",
        life: 5000,
      });
    }
  };

  return (
    <section className="block md:flex h-screen">
      <Toast ref={toast as any} />

      <div className="welcome-container w-full md:w-8/12 md:px-20 p-6 md:flex flex-col justify-center items-center">
        <h1 className="welcome-main-text hidden md:block md:w-3/5">
          The best compliance management and ISO standardization software
        </h1>
        <br />
        <p className="text-gray-200 hidden md:block w-3/5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente sit,
          suscipit reprehenderit voluptate, tenetur error enim iure esse iusto
          rem, quasi provident quas aliquid asperiores necessitatibus?
        </p>
      </div>

      {/*form section*/}
      <div className="signup-section p-4 md:px-10 w-full md:w-4/12 flex items-start flex-col justify-center gap-1">
        <form className="w-full">
          <h1 className="register-title text-2xl">Create an account</h1>
          <Divider />
          {/*username*/}
          <div className="w-full flex flex-col my-4">
            <label htmlFor="username">Username</label>
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

          {/*domain */}
          <div className="w-full flex flex-col my-4 form-control">
            <label htmlFor="domain">Domains of action</label>
            <span className="p-input-icon-left">
              <i className="pi pi-building text-gray-400" />
              <MultiSelect
                id="domain"
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

          {/*address*/}
          <div className="w-full flex flex-col my-4 form-control">
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

          <Button
            title="Submit"
            Icon={{
              classes: "",
              Name: HiArrowSmRight,
              color: "white",
            }}
            styles="w-full md:w-auto py-2.5 items-center justify-center"
            onClick={signInHandler}
          />
        </form>
      </div>
    </section>
  );
}

export default Register;
