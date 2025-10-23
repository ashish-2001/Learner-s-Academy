import React from "react";
import { Template } from "../components/Core/Auth/Template";
import { login } from "../assets/images/index";

function Login(){
    return(
        <Template
            title={"Welcome back"}
            description1={"Build skills for today, tomorrow, and beyond."}
            description2={"Education to future-proof your career"}
            formType={"login"}
            image={login}
        />
    )
    
}

export {
    Login
}