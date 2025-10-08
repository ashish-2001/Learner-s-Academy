import React from "react";
import { ContactUsForm } from "./ContactUsForm";

function ContactForm(){
    return (
        <div className="border border-[#424854] text-[#838894] rounded-xl p-7 lg:p-14 flex gap-3 flex-col">
            <h1 className="text-4xl leading-10 font-semibold text-[#F1F2FF]">
                Got a Idea? We&apos;ve got the skills. Let&apos;s team up
            </h1>
            <p className="">Tell us more about yourself and what you&apos;re got in mind.</p>
            <div className="mt-7">
                <ContactUsForm/>
            </div>
        </div>
    )
}

export {
    ContactForm
}