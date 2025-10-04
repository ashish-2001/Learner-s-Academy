import React from "react";
import { login } from "../assets/images";
import { Template } from "../components/Core/Auth/Template";

function Login(){
    return(
        <Template
            title={"Welcome back"}
            description1={"Build skills for today, tomorrow, and beyond."}
            description2={"Education to future-proof your career"}
            image={login}
            formType={"login"}
        />
    )
    
}

export {
    Login
}