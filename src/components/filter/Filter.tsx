import React, { useRef } from 'react';
import BasicCard from "../../core/card/BasicCard";
import Input from "../../core/Input/Input";
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';

function Filter(props: { fields: any[]; title: string }) {
  const { fields, title } = props;

  // Icon={{
  //     classes: 'absolute top-3 left-3',
  //     Name: HiOutlineBeaker
  // }}

  const constructFilter = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const menu =  useRef<Menu>(null);
    const items = fields;
    return (
      <form className="w-full">
        <div className="w-full flex flex-col items-start justify-end">
          <label htmlFor="search">{title}</label>
          <span className="p-input-icon-left relative w-full">
              <i className="pi pi-search text-gray-400" />
              <InputText
                id="search"
                type="text"
                name="search"
                placeholder="Search "
                className="w-full"
              />
            <button onClick={(event) => {
              event.preventDefault()
              menu?.current?.toggle(event)
            }} className='text-sm border border-gray-400 text-gray-500 rounded absolute right-2 top-2.5 px-2 gap-2 py-1 flex items-center'>
              <i className='pi pi-filter'></i>
              Filter by
            </button>
            <Menu model={items} popup ref={menu} id="popup_menu" />
            </span>
        </div>
        {/*{fields.map((element: any, index: number) => {*/}
        {/*  let inputElement = <Input {...element} />;*/}
        {/*  return <div key={index}>{inputElement}</div>;*/}
        {/*})}*/}
      </form>
    );
  };
  return (
    <BasicCard
      title={''}
      headerStyles={"text-left"}
      styles={"border-0 shadow-none"}
      content={constructFilter}
    />
  );
}

export default Filter;
