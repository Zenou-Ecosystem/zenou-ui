import React from 'react'
import JoinLineChartComponent from '../../../core/charts/Line/JoinLineChart';
import CustomBarChartComponent from '../../../core/charts/Bar/Custom';
import SimpleAreaChartComponent from '../../../core/charts/Area/Simple';
import CustomActiveShapeChartComponent from '../../../core/charts/Pie/CustomActiveShapePieChart';
import PieWithNeedleChartComponent from '../../../core/charts/Pie/PieWithNeedle';
import PieWithCustomLabelChartComponent from '../../../core/charts/Pie/PieWithCustomLabel';
import LineChartComponent from '../../../core/charts/Line/SimpleLineChart';

function Statistics() {
    return (
        <div>
            {/*<CustomActiveShapeChartComponent />*/}
            <JoinLineChartComponent />
            <CustomBarChartComponent />
            <SimpleAreaChartComponent />
            {/*<PieWithNeedleChartComponent />*/}
            {/*<PieWithCustomLabelChartComponent />*/}
            <LineChartComponent />
        </div>
    )
}

export default Statistics
