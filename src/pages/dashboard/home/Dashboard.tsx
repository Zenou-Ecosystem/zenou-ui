import React from 'react'
import BasicCard from '../../../core/card/BasicCard'

function Dashboard() {
    const controlCardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Control Statistics'
    }
    const actionCardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Action Statistics'
    }
    const lawCardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Law Statistics'
    }
    const companyCardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Company Statistics'
    }
    const assesmentCardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Assesment Statistics'
    }
    const subscriptionCardProps = {
        content: `Statistics for the month of February. This is really making
        sense in all areas`,
        title: 'Subscription Statistics'
    }
    return (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="controls">
                <BasicCard {...controlCardProps} />
            </div>
            <div className="actions">
                <BasicCard {...actionCardProps} />
            </div>
            <div className="laws col-span-2">
                <BasicCard {...lawCardProps} />
            </div>
            <div className="companies">
                <BasicCard {...companyCardProps} />
            </div>
            <div className="assesments">
                <BasicCard {...assesmentCardProps} />
            </div>
            <div className="subscriptions">
                <BasicCard {...subscriptionCardProps} />
            </div>
        </div>
    )
}

export default Dashboard