import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { Learners_Academy } from "../../assets/logo";
import { NavbarLinks } from "../../data/NavbarLinks";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants.js";
import { ProfileDropdown } from "../core/auth/ProfileDropdown.js";
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
    }
    

    useEffect(()=> {

        const cached = localStorage.getItem("subLinks");
        if(cached){
            setSubLinks(JSON.parse(cached));
        }
        (async () => {
            try {
                const result = await apiConnector("GET", categories.CATEGORIES_API);
                if(Array.isArray(result?.data?.data) && result.data.data.length > 0){
                    setSubLinks(result.data.data);
                }
                localStorage.setItem("subLinks", JSON.stringify(result.data.data));
            }
            catch(error){
                console.log("Could not fetch Categories.", error)
            }
        })()
    }, []);

    const show = useRef();
    const overlay = useRef();

    const showNav = () => {
        show.current.classList.toggle("navshow");
        overlay.current.classList.toggle("hidden");
    }

    const handleScroll = () => {
        const currentScrollPos = window.scrollY

        if(currentScrollPos > prevScrollPos){
            setVisible(false);
        } else{
            setVisible(true);
        }

        setPrevScrollPos(currentScrollPos);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if(searchValue?.length > 0){
            navigate(`/search/${searchValue}`);
            setSearchValue("");
        }
    }


    return(
<div className={"flex sm:relative bg-[#000814] w-screen relative z-50 h-14 items-center justify-center border-b-[1px] border-b-[#2C333F] translate-y-  transition-all duration-500"}>
    <div className='flex w-11/12 max-w-["1260px"] items-center justify-between'>
        <Link to='/' onClick={() => { dispatch(setProgress(100)) }}>
            <img src={Learners_Academy} width={160} alt="Learners-Academy" height={42} className="h-[45px] w-[50px] rounded-full"/>
        </Link>
                
            {
                user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                    <div className='md:hidden'>
                        <Link to='/dashboard/cart' className='relative left-10' onClick={() => { dispatch(setProgress(100)) }} >
                            <div className=''>
                                <TiShoppingCart className=' fill-[#DBDDEA] w-8 h-8' />
                            </div>
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
                <div className={`flex md:hidden  relative gap-4 flex-row ${token !== null && user?.accountType !== "Instructor" ? " -left-12" : ""}`}>
                    <GiHamburgerMenu className={`w-16 h-8 fill-[#DBDDEA] absolute left-10 -bottom-4 `} onClick={showNav} />
                    <div ref={overlay} className=' fixed top-0 bottom-0 left-0 right-0 z-30 bg w-[100vw] hidden h-[100vh] overflow-y-hidden bg-[rgba(0,0,0,0.5)] ' onClick={showNav}></div>
                    <div ref={show} className='mobNav z-50'>
                        <nav className=' items-center flex flex-col absolute w-[200px] -left-[80px] -top-7  glass2' ref={show}>
                            {
                                token == null && (
                                    <Link to='/login' className='' onClick={() => { dispatch(setProgress(100)) }} >
                                        <button onClick={showNav} className='mt-4 text-center text-[15px] px-6 py-2 rounded-md font-semibold bg-yellow-50 text-black hover:scale-95 transition-all duration-200'>
                                            Login
                                        </button>
                                    </Link>
                                )
                            }
                            {
                                token == null && (
                                    <Link to='/signup' className='text-yellow-50' onClick={() => { dispatch(setProgress(100)) }} >
                                        <button onClick={showNav} className='mt-4 text-center text-[15px] px-5 py-2 rounded-md font-semibold bg-yellow-50 text-black hover:scale-95 transition-all duration-200' >
                                            Signup
                                        </button>
                                    </Link>
                                )
                            }

                            {
                                token != null && (
                                    <div className='mt-2' >
                                        <p className=' text-[#C5C7D4] text-center mb-2'>Account</p>
                                        <ProfileDropdown />
                                    </div>
                                )
                            }
                            <div className='mt-4 mb-4 bg-[#DBDDEA] w-[200px] h-[2px]'></div>
                            <p className='text-xl text-yellow-50 font-semibold'>Courses</p>
                            <div className=' flex flex-col items-end pr-4'>
                                {
                                    subLinks?.length < 0 ? (<div></div>) : (
                                    subLinks?.map((element, index) => (
                                        <Link to={`/catalog/${element?.name}`} key={index} onClick={() => { dispatch(setProgress(30)); showNav() }} className="p-2 text-sm">
                                            <p className=' text-[#F1F2FF] '>
                                                {element?.name}
                                            </p>
                                        </Link>
                                    )))
                                }
                            </div>
                            <div className=' mt-4 mb-4 bg-[#DBDDEA] w-[200px] h-[2px]'></div>
                            <Link to='/about' onClick={() => { dispatch(setProgress(100)); showNav() }} className="p-2">
                                <p className=' text-[#F1F2FF] '>
                                    About
                                </p>
                            </Link>
                            <Link to='/contact' onClick={() => { dispatch(setProgress(100)); showNav() }} className="p-2">
                                <p className=' text-[#F1F2FF] '>
                                    Contact
                                </p>
                            </Link>
                        </nav>
                    </div>
                </div>


                {/* Desktop Navbar */}
                <nav>
                    <ul className=' flex-row gap-x-6 text-[#DBDDEA] gap-5 hidden md:flex'>
                        {
                            NavbarLinks?.map((element, index) => (
                                <li key={index} >
                                    {
                                        element.title === "Catalog" ? (<div className='flex items-center group relative cursor-pointer'>
                                            <p>{element.title}</p>
                                            <svg width="25px" height="20px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.384"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#ffffff"></path> </g></svg>

                                            <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-[#F1F2FF] p-4 text-[#000814] opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]'>
                                                <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-[#F1F2FF]'></div>
                                                {
                                                    subLinks?.length < 0 ? (<div></div>) : (
                                                        subLinks?.map((element, index) => (
                                                            <Link to={`/catalog/${element?.name}`} key={index} className="font-semibold text-[17px] rounded-lg bg-transparent py-4 pl-4 hover:bg-[#808188]" onClick={() => { dispatch(setProgress(30)) }}>
                                                                <p className=''>
                                                                    {element?.name}
                                                                </p>
                                                            </Link>
                                                        ))
                                                    )

                                                }

                                            </div>
                                        </div>) : (

                                            <Link to={element?.path} onClick={() => { dispatch(setProgress(100)) }} >
                                                <p className={`${matchRoute(element?.path) ? " text-yellow-25" : " text-[#DBDDEA] hidden md:block"}`} >
                                                    {element?.title}
                                                </p>
                                            </Link>
                                        )
                                    }
                                </li>
                            ))
                        }
                        <form onSubmit={handleSearch} className='flex items-center relative'>
                            <input value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} id='searchInput' type="text" placeholder="Search..." className='absolute pl-4 top-0 left-0 border-0 focus:ring-1 ring-[#6E727F] rounded-full px-2 py-1 text-[15px] w-[280px] text-[#F1F2FF] focus:outline-none focus:border-transparent bg-[#2C333F]' />
                            <HiSearch type='submit' id='searchIcon' size={20} className=" text-[#AFB2BF] top-1 absolute cursor-pointer left-[250px]" />
                        </form>
                    </ul>
                </nav>

                <div className='flex-row gap-5 hidden md:flex items-center'>
                    {
                        user && user?.accountType !== "Instructor" && (
                            <Link to='/dashboard/cart' className=' relative px-4 ' onClick={() => { dispatch(setProgress(100)) }} >
                                <div className=' z-50'>
                                    <TiShoppingCart className=' fill-[#DBDDEA] w-7 h-7' />
                                </div>
                                {
                                    totalItems > 0 && (
                                        <span className=' shadow-sm shadow-black text-[10px] font-bold bg-yellow-100 text-[#000814] rounded-full px-1 absolute -top-[2px] right-[8px]'>
                                            {totalItems}
                                        </span>
                                    )
                                }

                            </Link>
                        )
                    }
                    {
                        token == null && (
                            <Link to='/login' className='text-[#DBDDEA]' onClick={() => { dispatch(setProgress(100)) }} >
                                <button className='rounded-[8px] border border-[#2C333F] bg-[#161D29] px-[12px] py-[7px] text-[#AFB2BF]'>
                                    Login
                                </button>
                            </Link>
                        )
                    }
                    {
                        token == null && (
                            <Link to='/signup' className='text-[#DBDDEA]' onClick={() => { dispatch(setProgress(100)) }} >
                                <button className='rounded-[8px] border border-[#2C333F] bg-[#161D29] px-[12px] py-[7px] text-[#AFB2BF]' >
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
    )
}


export {
    Navbar
}