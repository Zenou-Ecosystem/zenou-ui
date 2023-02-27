import React from 'react';
import './input.scss';

function Input(prop: { type: string; onChange: Function, placeholder?: string, Icon?: any; name?: string, id?: string }) {
    const { Icon, type, name, id, placeholder, onChange } = prop;

    const handleOnChange = (e: any) => {
        e.preventDefault();
        onChange(e.target.value);
    }
    return (
        <div className='relative'>
            {
                Icon ? <span className={Icon.classes}>
                    <Icon.Name size={Icon.size ?? 22} color={Icon.color ?? 'black'} />
                </span> : null
            }
            <input type={type} name={name ?? type} id={id ?? type}
                className='formControls outline-none'
                placeholder={placeholder ?? ''}
                onChange={(e) => handleOnChange(e)}
            />
        </div>
    )
}

export default Input