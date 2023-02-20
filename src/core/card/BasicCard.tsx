import React from 'react'

function BasicCard(props: { title: string, content: string | Function }) {
    const { title, content } = props;

    return (
        <div className="container p-3 rounded bg-white border shadow-xl">
            <div className="card-header">
                <h1 className="text-center font-extrabold text-primary">{title}</h1>
            </div>
            <div className="card-content">
                <div className="p-5 text-center card-body">
                    {typeof content == 'string' ? content : content()}
                </div>
            </div>
        </div>
    )
}

export default BasicCard