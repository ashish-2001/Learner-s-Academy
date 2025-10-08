import React from "react";
import { useRef, useState } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { logout } from "../../../services/operations/authAPI";

function ProfileDropdown(){
    const { user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useOnClickOutside(ref, () => setOpen(false));

    if(!user){
        return null;
    }

    return(
        <div className="relative" onClick={() => setOpen(true)}>
            <div className="flex items-center gap-x-1">
                <img 
                    className="aspect-square w-[30px] rounded-full object-cover"
                    alt={`profile-${user?.firstName}`}
                    src={user?.image}
                />
                <AiOutlineCaretDown className="text-sm text-[#AFB2BF]"/>
            </div>
            {open && (
                <div 
                className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-[#2C333F] overflow-hidden rounded-md border-[1px] border-[#2C333F] bg-[#161D29]"
                ref={ref}
                >
                    <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
                        <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-[#AFB2BF] hover:bg-[#2C333F] hover:text-[#DBDDEA]">
                            <VscDashboard className="text-lg"/>
                            Dashboard
                        </div>
                    </Link>
                    <div onClick={() => {
                        dispatch(logout(navigate))
                        setOpen(false)
                    }}
                        className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-[#AFB2BF] hover:bg-[#2C333F] hover:text-[#DBDDEA]"
                    >
                        <VscSignOut className="text-lg"/>
                        Logout
                    </div>
                </div>
            )}
        </div>
    )
}

export {
    ProfileDropdown
}