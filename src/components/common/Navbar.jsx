import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { Learners_Academy } from "../../assets/logo";
import { NavbarLinks } from "../../data/NavbarLinks";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants.js";
import { ProfileDropdown } from "../core/auth/ProfileDropdown";
import { setProgress } from "../../slices/loadingBarSlice";
import { HiSearch } from "react-icons/hi";
import { TiShoppingCart } from "react-icons/ti";
import { GiHamburgerMenu } from "react-icons/gi";


function Navbar(){

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    
    const [subLinks, setSubLinks] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();


    function matchRoute(route){
        return matchPath({ path: route }, location.pathname)
    };
    

    useEffect(()=> {

        const cached = localStorage.getItem("subLinks");
        if(cached){
            setSubLinks(JSON.parse(cached));
        };
        (async () => {
            try {
                const result = await apiConnector("GET", categories.CATEGORIES_API);
                if(Array.isArray(result?.data?.data)){
                    setSubLinks(result.data.data);
                    localStorage.setItem("subLinks", JSON.stringify(result.data.data));
                }
            } catch(error){
                console.log("Could not fetch Categories.", error)
            };
        })();
    }, []);

    const show = useRef(null);
    const overlay = useRef(null);

    const showNav = () => {

        if(window.innerWidth >= 768) return;
        show.current?.classList.toggle("navshow");
        overlay.current?.classList.toggle("hidden");
    };

    const handleScroll = () => {
        const currentScrollPos = window.scrollY;

        if(currentScrollPos > prevScrollPos){
            setVisible(false);
        } else{
            setVisible(true);
        };

        setPrevScrollPos(currentScrollPos);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if(searchValue.length > 0){
            navigate(`/search/${searchValue}`);
            setSearchValue("");
        };
    };


return(
    <div className={`flex sm:relative bg-[#000814] w-screen relative z-50 h-14 items-center justify-center border-b-[1px] border-b-[#2C333F] transition-all duration-500 ${visible ? "transition-y-0" : "-translate-y-full"}`}>
        <div className='flex w-11/12 max-w-["1260px"] items-center justify-between'>
            <Link to='/' onClick={() => { dispatch(setProgress(100)) }}>
                <img src={Learners_Academy} width={160} alt="Learners-Academy" height={42} className="h-[45px] w-[50px] rounded-full"/>
            </Link>    
                {
                    user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                        <div className='md:hidden'>
                            <Link to='/dashboard/cart' className='relative left-10' onClick={() => { dispatch(setProgress(100)) }} >
                                    <TiShoppingCart className=' fill-[#DBDDEA] w-8 h-8' />
                                {
                                    totalItems > 0 && (
                                        <span className='font-medium text-[12px] shadow-[3px ] shadow-black bg-yellow-100 text-[#000814] rounded-full px-[4px] absolute -top-[2px] right-[1px]'>
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        </div>
                    )
                }
                <div className={`flex md:hidden`}>
                    <GiHamburgerMenu className={`cursor-pointer w-16 h-8 fill-[#DBDDEA] `} onClick={showNav} />
                    <div ref={overlay} className=' fixed inset-0 z-30 bg hidden  bg-[rgba(0,0,0,0.5)] ' onClick={showNav}></div>
                    <div ref={show} className='mobNav z-50'>
                        <nav className='items-center flex flex-col absolute w-[200px] -left-[80px] -top-7  glass2'>
                            {
                                token == null && (
                                    <>
                                        <Link to='/login' className='' onClick={() => { dispatch(setProgress(100)) }} >
                                            <button onClick={showNav} className='cursor-pointer mt-4 text-center text-[15px] px-6 py-2 rounded-md font-semibold bg-yellow-500 text-black hover:scale-95 transition-all duration-200'>
                                                Login
                                            </button>
                                        </Link>
                                        <Link to='/signup' className='text-yellow-500' onClick={() => { dispatch(setProgress(100)) }} >
                                            <button onClick={showNav} className=' cursor-pointer mt-4 text-center text-[15px] px-5 py-2 rounded-md font-semibold bg-yellow-500 text-black hover:scale-95 transition-all duration-200' >
                                                Signup
                                            </button>
                                        </Link>
                                    </>
                                )
                            }

                            {
                                token  && <ProfileDropdown />
                            }
                            <div className='mt-4 mb-4 bg-[#DBDDEA] w-[200px] h-[2px]'/>
                            <p className='text-xl text-yellow-50 font-semibold'>Courses</p>
                            {
                                subLinks?.length < 0 ? null : (
                                    subLinks?.map((element, index) => (
                                    <Link to={`/catalog/${element?.name}`} key={index} onClick={() => showNav} className="p-2 text-sm text-[#F1F2FF]">
                                        {element?.name}                                          
                                    </Link>
                                )))
                            }
                        </nav>
                    </div>
                </div>
                <nav className="hidden md:flex">
                    <ul className=' flex-row gap-x-6 text-[#DBDDEA]'>
                        {
                            NavbarLinks?.map((element, index) => (
                                <li key={index} >
                                    <Link to={element.path}>
                                        <p className={
                                            matchRoute(element.path)
                                            ? "text-yellow-25"
                                            : "text-[#DBDDEA]"
                                            }
                                        >
                                            {element?.name}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        <form onSubmit={handleSearch} className='relative'>
                            <input value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} id='searchInput' type="text" placeholder="Search..." className='pl-4 rounded-full text-[#F1F2FF] bg-[#2C333F]' />
                            <HiSearch type='submit' id='searchIcon' size={20} className="absolute cursor-pointer right-2 top-2" />
                        </form>
                    </ul>
                </nav>

                <div className='gap-5 hidden md:flex items-center'>
                    {
                        user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                            <Link to='/dashboard/cart' className='relative' onClick={() => { dispatch(setProgress(100)) }} >
                                <div className=' z-50'>
                                    <TiShoppingCart className=' fill-[#DBDDEA] w-7 h-7' />
                                </div>
                                {
                                    totalItems > 0 && (
                                        <span className='text-[10px] bg-yellow-500 text-[#000814] rounded-full px-1 absolute -top-[2px] right-[8px]'>
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }

                    {
                        token ? <ProfileDropdown/> : null
                    }
                    {
                        token === null && (
                            <Link to='/login' className='text-[#DBDDEA]' onClick={() => { dispatch(setProgress(100)) }} >
                                <button className='cursor-pointer rounded-[8px] border border-[#2C333F] bg-[#161D29] px-[12px] py-[7px] text-[#AFB2BF]'>
                                    Login
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to='/signup' className='text-[#DBDDEA]' onClick={() => { dispatch(setProgress(100)) }} >
                                <button className='cursor-pointer rounded-[8px] border border-[#2C333F] bg-[#161D29] px-[12px] py-[7px] text-[#AFB2BF]' >
                                    Signup
                                </button>
                            </Link>
                        )
                    }
                    {
                        token !== null && (
                            <div className='pt-2' >
                                <ProfileDropdown />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};


export {
    Navbar
};