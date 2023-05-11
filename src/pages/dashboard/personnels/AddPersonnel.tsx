import React, { useEffect, useRef, useState } from "react";
import Button from "../../../core/Button/Button";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import { PersonnelActionTypes } from "../../../store/action-types/personnel.actions";
import usePersonnelContext from "../../../hooks/usePersonnelContext";
import { Dropdown } from "primereact/dropdown";
import { UserTypes } from "../../../constants/user.constants";
import { register } from "../../../services/auth.service";
import { Toast } from "primereact/toast";
import { LocalStore } from "../../../utils/storage.utils";

const initialFormValues = {
  first_name: {
    value: "",
  },
  last_name: {
    value: "",
  },
  email: {
    value: "",
  },
  role: {
    value: "",
  },
  domains: {
    value: "",
  },
};
const domainsOptions = [
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
const rolesOptions = [
  { label: "Department administrator", value: UserTypes.DEPARTMENT_ADMIN },
  { label: "Simple personnel", value: UserTypes.PERSONNEL },
];

function AddPersonnel() {
  const [formValues, setFormValues] =
    useState<Record<string, any>>(initialFormValues);

  const [loader, setLoader] = useState(false);
  const { state, dispatch } = usePersonnelContext();
  const toast = useRef({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: {
        ...formValues[name],
        value,
      },
    });
  };

  const handleSubmission = () => {
    const user = LocalStore.get("user");
    const password = new Array(8)
      .fill(0)
      .map(() => String.fromCharCode(Math.random() * 86 + 40))
      .join("");

    setLoader(true);
    const payload: Record<string, any> = {
      password,
    };
    Object.entries(formValues).forEach(([key, value]) => {
      payload[key] = value?.value;
    });
    payload["username"] = `${payload.first_name} ${payload.last_name}`;
    payload["domains"] = [payload.domains];
    payload["org_id"] = user.org_id;
    delete payload.first_name;
    delete payload.last_name;

    console.log(payload);

    register(payload).then((result) => {
      (toast.current as any).show({
        severity: "success",
        summary: "Employee created with success",
        detail: `Here is the employee's password: ${password}`,
        life: 10000,
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
        <Toast ref={toast as any} />
        <div className="form-elements grid md:grid-cols-2 gap-4">
          {/*first name*/}
          <div className="control-type">
            <label htmlFor="first_name">First name</label>
            <InputText
              type="text"
              id="first_name"
              name="first_name"
              className="p-inputtext-md w-full"
              placeholder="Enter first name"
              onChange={handleChange}
            />
          </div>

          {/*last name*/}
          <div className="control-type">
            <label htmlFor="last_name">Last name</label>
            <InputText
              type="text"
              id="last_name"
              name="last_name"
              className="p-inputtext-md w-full"
              placeholder="Enter last name"
              onChange={handleChange}
            />
          </div>

          {/*email*/}
          <div className="control-type col-span-2">
            <label htmlFor="email">Email address</label>
            <InputText
              type="text"
              id="email"
              name="email"
              className="p-inputtext-md w-full"
              placeholder="Enter email address"
              onChange={handleChange}
            />
          </div>

          {/*department*/}
          <div className="control-type">
            <label htmlFor="department">Department</label>
            <Dropdown
              id="department"
              name="domains"
              value={formValues.domains.value}
              onChange={handleChange}
              options={domainsOptions}
              placeholder="Select a department for this personnel"
              className="w-full md:w-14rem"
            />
          </div>

          {/*role*/}
          <div className="control-type">
            <label htmlFor="role">Role</label>
            <Dropdown
              id="role"
              name="role"
              value={formValues.role.value}
              onChange={handleChange}
              options={rolesOptions}
              placeholder="Select a role for this personnel"
              className="w-full md:w-14rem"
            />
          </div>
        </div>

        {/*submit button*/}
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
    title: "Personnel information",
    content: addForm,
  };

  return (
    <section>
      {/* <BasicCard {...cardProps} /> */}
      {addForm()}
    </section>
  );
}

export default AddPersonnel;
