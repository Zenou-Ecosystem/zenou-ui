import React from 'react'
import { HiOutlineBeaker } from 'react-icons/hi';
import BasicCard from '../../core/card/BasicCard';
import Input from '../../core/Input/Input';

function Filter(props: { fields: any[] }) {

    const { fields } = props;

    // Icon={{
    //     classes: 'absolute top-3 left-3',
    //     Name: HiOutlineBeaker
    // }} 

    const constructFilter = () => {
        return (<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
            {fields.map((element: any, index: number) => {
                let inputElement = <Input {...element} />
                return (
                    <div key={index}>
                        {inputElement}
                    </div>
                )
            }
            )}
        </div>);
    }
    return (
        <BasicCard title='Filter Companies' content={constructFilter} />
    )
}

export default Filter