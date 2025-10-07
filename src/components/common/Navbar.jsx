import React from "react";
import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import { Logo_Full_Light } from "../../assets/logo";
import { NavbarLinks } from "../../data/NavbarLinks";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { ProfileDropdown } from "../Core/Auth/ProfileDropdown";


function Navbar(){

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();
    
    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        ;(async () => {
            setLoading(true)
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API)
                setSubLinks(res.data.data)
            }
            catch(error){
                console.log("Could not fetch Categories.", error)
            }
            setLoading(false)
        })()
    }, []);

    
    function matchRoute(route){
        return matchPath({ path: route }, location.pathname)
    }


    return(

        <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-white ${
            location.pathname !== "/" ? "bg-blue-950" : ""
        } transition-all duration-200`}>
            <div className="flex w-11/12 max-w-1260px items-center justify-between">
            <Link to={"/"}>
                <img src={Logo_Full_Light} alt="Logo" width={160} height={32} loading="lazy"/>
            </Link>

            <nav className="hidden md:block">
                <ul className="flex gap-x-6 text-white">
                    {NavbarLinks.map((link, index) =>(
                        <li key={index}>{link.title === "Catalog" ? (
                            <>
                                <div className={`group relative flex cursor-pointer items-center gap-1 ${
                                    matchRoute("/catalog/:catalogName")
                                    ? "text-yellow-600"
                                    : "text-white"
                                }`}>
                                    <p>{link.title}</p>
                                    <BsChevronDown/>
                                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-blue-950 p-4 text-white opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-blue-950"></div>
                                        {loading ? (
                                            <p className="text-center">Loading...</p>
                                        ) : subLinks.length ? (
                                            <>
                                                {subLinks ?.filter(
                                                    (subLink) => subLink?.courses?.length > 0
                                                ) ?.map((subLink, i) => (
                                                    <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} className="rounded-lg bg-transparent py-4 pl-4 hover: bg-blue-950" key={i}>
                                                        <p>{subLink.name}</p>
                                                    </Link>
                                                ))}
                                            </>
                                        ) : (
                                            <p className="text-center">No Courses Found</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link to={link?.path}>
                                <p className={`${
                                    matchRoute(link?.path) ? "text-yellow-600" : "text-white"
                                }`}></p>
                            </Link>
                        )}</li>
                    ))}
                </ul>
            </nav>

            <div className="hidden items-center gap-x-4 md:flex">
                {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                    <Link to={"/dashboard/cart"} className="relative">
                        <AiOutlineShoppingCart className="text-2xl text-blue-950"/>
                        {totalItems > 0 && (
                            <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-blue-950 text-center text-xs font-bold text-yellow-600">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                )}
                {token === null && (
                    <Link to={"/login"}>
                        <button className="rounded-[8px] border-white bg-blue-950 px-[12px] py-[8px] text-white">
                            Log in
                        </button>
                    </Link>
                )}
                { token === null && (
                    <Link to={"/Signup"}>
                        <button className="rounded-[8px] border border-white bg-blue-950 px-[12px] py-[8px] text-white">
                            Sign up
                        </button>
                    </Link>
                )}
                { token !== null && <ProfileDropdown/>}
            </div>
            <button className="mr-4 md:hidden">
                <AiOutlineMenu/>
            </button>
            </div>
        </div>
    )
}


export {
    Navbar
}