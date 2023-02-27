import React from 'react'
import { FaHouseUser, FaRegChartBar, FaUsers, FaDirections, FaCheckDouble, FaBook, FaSignOutAlt, FaCogs, FaFileInvoiceDollar } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

function Sidebar() {
    return (
        <section className="bg-white text-grayColor w-full h-full pt-5">
            <ul className="flex flex-col justify-center items-center gap-3">
                <li className="py-2 w-1/2">
                    <NavLink to="/dashboard/home" className="flex flex-wrap items-center gap-2 text-lg">
                        <FaHouseUser />
                        <span>Home</span>
                    </NavLink>
                </li>
                <li className="py-2 w-1/2">
                    <NavLink to="/dashboard/stats" className="flex flex-wrap items-center gap-2 text-lg">
                        <FaRegChartBar />
                        <span>Statistics</span>
                    </NavLink>
                </li>
                <li className="py-2 w-1/2">
                    <NavLink to="/dashboard/companies" className="flex flex-wrap items-center gap-2 text-lg">
                        <FaUsers />
                        <span>Companies</span>
                    </NavLink>
                </li>
                <li className="py-2 w-1/2">
                    <NavLink to="/dashboard/laws" className="flex flex-wrap items-center gap-2 text-lg">
                        <FaDirections />
                        <span>Laws</span>
                    </NavLink>
                </li>
                <li className="py-2 w-1/2">
                    <NavLink to="/dashboard/controls" className="flex flex-wrap items-center gap-2 text-lg">
                        <FaCheckDouble />
                        <span>Controls</span>
                    </NavLink>
                </li>
                <li className="py-2 w-1/2">
                    <NavLink to="/dashboard/actions" className="flex flex-wrap items-center gap-2 text-lg">
                        <FaBook />
                        <span>Actions</span>
                    </NavLink>
                </li>
                <li className="py-2 w-1/2">
                    <NavLink to="/dashboard/subscriptions" className="flex flex-wrap items-center gap-2 text-lg">
                        <FaFileInvoiceDollar />
                        <span>Subscriptions</span>
                    </NavLink>
                </li>
                <li className="py-2 w-1/2">
                    <NavLink to="/user/profile" className="flex flex-wrap items-center gap-2 text-lg">
                        <FaCogs />
                        <span>Settings</span>
                    </NavLink>
                </li>
                <li className="py-2 w-1/2">
                    <NavLink to="/user/logout" className="flex flex-wrap items-center gap-2 text-lg">
                        <FaSignOutAlt />
                        <span>Log out</span>
                    </NavLink>
                </li>
            </ul>
        </section>
    )
}

export default Sidebar