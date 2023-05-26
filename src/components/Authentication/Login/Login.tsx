import React, { useRef, useState } from "react";
import { HiUser, HiLockClosed, HiMail, HiArrowSmRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../core/Button/Button";
import Input from "../../../core/Input/Input";
import { login } from "../../../services/auth.service";
import "../register.scss";
import { Toast } from "primereact/toast";
import { LocalStore } from "../../../utils/storage.utils";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { UserTypes } from "../../../constants/user.constants";

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

  const [formValues, setFormValues] =
    useState<Record<string, any>>(initialState);

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
      <div className="signup-section p-4 md:px-10 w-full md:w-4/12 flex items-center flex-col justify-center gap-1">
        <form className="w-full">
          <h1 className="register-title text-2xl">Log in to your account</h1>
          <Divider />

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

          <div className="w-full flex flex-col items-end my-4 form-control">
            <p className="text-gray-500 text-sm font-light">
              Don't have an account?{" "}
              <Link
                className="text-orange-500 underline hover:text-orange-700 font-medium"
                to="/register"
              >
                Create one
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
            styles="w-full md:w-auto py-2.5 px-5 items-center justify-center"
            onClick={signInHandler}
          />
        </form>
      </div>
    </section>
  );
}

export default Login;
