import { NavLink } from "react-router-dom";
import Search from "../../components/filter/Search";
import "./navigation.scss";
import { can } from "../../utils/access-control.utils";
import { AppUserActions } from "../../constants/user.constants";

const Navbar = () => {
    return (
        <>
            <nav className="navbar text-grayColor w-full pt-2 font-bold capitalize">
                <ul className="flex justify-around items-center gap-3">
                    <li className="p-2 w-1/2">
                        <Search />
                    </li>
                    {
                        !can(AppUserActions.VIEW_COMPANY) ? null :
                            <li>
                                <NavLink end to="/dashboard/companies">Companies</NavLink>
                            </li>
                    }
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
