import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Fev',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Avr',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Mai',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Jun',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Jui',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function SimpleBarChartComponent() {
  return(
      <ResponsiveContainer width="100%" height="75%">
        <BarChart width={150} height={40} data={data}>
          <Bar dataKey="uv" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
  )
}
