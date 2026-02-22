import React from "react";

function HighLightText({ text }){
    return(
        <span className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-[#ffffff00] bg-clip-text font-bold">
            {" "}
            {text}
        </span>
    );
};

export { 
    HighLightText
};