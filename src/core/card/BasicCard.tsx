import React from 'react'

function BasicCard(props: { title: string, content: string | Function, styles?: string }) {
    const { title, content, styles } = props;

    return (
        <div className={`container p-3 rounded bg-white border shadow-xl ${styles ? styles : ''}`}>
            <div className="card-header">
                <h1 className="text-center font-extrabold text-primary">{title}</h1>
            </div>
            <div className="card-content my-4">
                <div className="text-center card-body">
                    {typeof content == 'string' ? content : content()}
                </div>
            </div>
        </div>
    )
}

export default BasicCard