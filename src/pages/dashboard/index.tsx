import React from 'react'
import './dashboard.scss';
import { Outlet } from 'react-router-dom'
import BasicCard from '../../core/card/BasicCard'
import Navbar from '../navigation/Navbar'
import Sidebar from '../navigation/Sidebar'

function DashboardHome() {
    return (
        <div className="w-full flex">
            <section className="sidebar-container md:w-1/5 lg:w-1/4">
                <BasicCard title='Zenou' content={() => (<Sidebar />)} styles={`border-0`} />
            </section>
            <section className="main-content md:w-4/5 lg:w-3/4">
                <Navbar />
                <main className="pt-10">
                    <Outlet />
                </main>
            </section>
        </div>
    )
}

export default DashboardHome