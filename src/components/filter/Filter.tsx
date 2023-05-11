import React from "react";
import BasicCard from "../../core/card/BasicCard";
import Input from "../../core/Input/Input";

function Filter(props: { fields: any[]; title: string }) {
  const { fields, title } = props;

  // Icon={{
  //     classes: 'absolute top-3 left-3',
  //     Name: HiOutlineBeaker
  // }}

  const constructFilter = () => {
    return (
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {fields.map((element: any, index: number) => {
          let inputElement = <Input {...element} />;
          return <div key={index}>{inputElement}</div>;
        })}
      </div>
    );
  };
  return (
    <BasicCard
      title={title}
      headerStyles={"text-left"}
      styles={"border-0 shadow-none"}
      content={constructFilter}
    />
  );
}

export default Filter;
