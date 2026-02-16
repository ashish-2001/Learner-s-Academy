import React from "react";
import { Template } from "../components/core/Auth/Template";
import { signup } from "../assets/images/index";

function Signup(){
    return(
        <Template
            title={"Join the millions learning to code with Learners Academy for free"}
            description1={"Build skills for today, tomorrow, and beyond."}
            description2={"Education to future-proof your career"}
            formType={"signup"}
            image={signup}
        />
    )
}

export {
    Signup
}