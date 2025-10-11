import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { deleteProfile } from "../../../../services/operations/SettingsAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function DeleteAccount(){
    const { token } = useSelector((State) => State.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleDeleteAccount(){
        try{
            dispatch(deleteProfile(token, navigate))
        } catch(error){
            console.log("Error message", error.message);
        }
    }

    return(
        <>
            <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-[#691432] bg-[#340019] p-8 px-12">
                <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-[#691432]">
                    <FiTrash2 className="text-3xl text-red-600"/>
                </div>
                <div className="flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold text-[#F1F2FF]">
                        Delete Account
                    </h2>
                    <div className="w-3/5 text-red-600">
                        <p>Would you like to delete account</p>
                        <p>
                            This account may contain Paid Courses. Deleting your account is 
                            permanent and will remove all the contain associated with it.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="w-fit cursor-pointer italic text-red-600 hover:scale-103 border-1 p-2 rounded-md border-gray-400 transition-all duration-200"
                        onClick={handleDeleteAccount}
                    >I want to delete my account</button>
                </div>
            </div>
        </>
    )
}

export {
    DeleteAccount
}