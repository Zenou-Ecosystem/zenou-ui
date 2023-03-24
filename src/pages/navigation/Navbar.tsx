import { NavLink } from "react-router-dom";
import Search from "../../components/filter/Search";
import "./navigation.scss";

const Navbar = () => {
    return (
        <>
            <nav className="navbar text-grayColor w-full pt-2 font-bold capitalize">
                <ul className="flex justify-around items-center gap-3">
                    <li className="p-2 w-1/2">
                        <Search />
                    </li>
                    <li>
                        <NavLink end to="/dashboard/companies">Companies</NavLink>
                    </li>
                    <li>
                        <NavLink end to="/user/profile">profile</NavLink>
                    </li>
                    <li>
                        <NavLink end to="/user/logout">Log out</NavLink>
                    </li>
                </ul>
            </nav>
        </>
    )
};

export default Navbar;
