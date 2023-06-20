import React, { useState } from "react";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import FranceFlag from "../../assets/france_flag.png";
import EnglishFlag from "../../assets/Flag_of_Great_Britain.png";
import { updateCurrentLanguage } from '../../services/translation.service';

interface Country {
  name: string;
  code: string;
}

export default function Locale() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(  { name: 'Français', code: 'FR' });
  const countries: Country[] = [
    { name: 'Français', code: 'FR' },
    { name: 'English', code: 'EN' }
  ];

  const selectedCountryTemplate = (option: Country, props: any) => {
    if (option) {
      return (
        <div className="flex items-center">
          <img alt={option.name} src={option.code === "FR"? FranceFlag: EnglishFlag } className='mr-2 rounded-sm' style={{ width: '24px', height: '20px' }} />
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option: Country) => {
    return (
      <div className="flex items-center">
        <img alt={option.name} src={option.code === "FR"? FranceFlag: EnglishFlag } className='mr-2 rounded-sm' style={{ width: '24px', height: '20px' }} />
        <span className="text-sm">{option.name}</span>
      </div>
    );
  };

  const panelFooterTemplate = () => {
    return (
      <div className="py-2 px-3 border-t">
        {selectedCountry ? (
          <small className="text-red-500">{selectedCountry.name} selected.</small>
        ) : (
          'No country selected.'
        )}
      </div>
    );
  };

  return (
    <div className="card flex justify-content-center">
      <Dropdown value={selectedCountry} onChange={(e: DropdownChangeEvent) => {
        updateCurrentLanguage(e.value?.code?.toLowerCase());
        setSelectedCountry(e.value);
      }} options={countries} optionLabel="name" placeholder="Select language"
                valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate} className="p-inputtext-sm" panelFooterTemplate={panelFooterTemplate} />
    </div>
  )
}
