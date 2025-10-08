import React from "react";
import { Template } from "../components/Core/Auth/Template";

function Signup(){
    return(
        <Template
            title={"Join the millions learning to code with StudyNotion for free"}
            description1={"Build skills for today, tomorrow, and beyond."}
            description2={"Education to future-proof your career"}
            formType={"signup"}
        />
    )
}

export {
    Signup
}