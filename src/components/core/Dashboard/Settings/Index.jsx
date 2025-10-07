import React from "react";
import { ChangeProfilePicture } from "./ChangeProfilePicture";
import { DeleteAccount } from "./DeleteAccount";
import { EditProfile } from "./EditProfile";
import { UpdatePassword } from "./UpdatePassword";


function Settings(){
    return(
        <>
            <h1 className="mb-14 text-3xl font-medium text-white">Edit Profile</h1>
            <ChangeProfilePicture/>
            <EditProfile/>
            <UpdatePassword/>
            <DeleteAccount/>
        </>
    )
}

export {
    Settings
}