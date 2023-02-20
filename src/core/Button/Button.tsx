import React from 'react';
import './button.scss';

function Button(prop: { title: string; onClick: Function; Icon?: any; styles?: string; id?: string }) {
    const { Icon, title, styles, id, onClick } = prop;

    const handler = (e: any) => {
        e.preventDefault();
        onClick();
    }

    return (
        <div className='relative'>
            <button id={id ?? ''} className={`bg-primary border-none rounded-md p-2 text-white w-24 ${styles ? styles : ''}`} onClick={handler}>
                <span>{title}</span>
                {
                    Icon ? <span className={Icon.classes}>
                        <Icon.Name size={Icon.size ?? 22} color={Icon.color ?? 'black'} />
                    </span> : null
                }
            </button>
        </div>
    )
}

export default Button