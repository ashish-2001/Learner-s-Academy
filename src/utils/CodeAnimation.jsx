import React, { useEffect, useState } from "react";

function HtmlAnimation({ htmlSequence = [], speed = 50 }){
    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText]  = useState("");
    const [charIndex, setCharIndex] = useState(0)

    const escapeHTML = (str) => {
        return str.replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, "'")
        .replace(/'/g, "'");
    }

    const cleanString = (str) => {
            return str
            .split("\n")
            .map((line) => line.replace(/^\s+/, "")) // trim leading spaces
            .join("\n");
        };

    useEffect(() => {

        if(!htmlSequence){
            return;
        }

        const currentString = cleanString(escapeHTML(htmlSequence[index]));

        if(charIndex < currentString.length){
            const timeout = setTimeout(() => {
                setDisplayedText(currentString.slice(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, speed)

            return () => clearTimeout(timeout);
        } else{
            const timeout = setTimeout(() => {
                setIndex((index + 1) % htmlSequence.length);
                setCharIndex(0);
                setDisplayedText("");
            }, 1000);

            return () => clearTimeout(timeout)
        }
    }, [charIndex, index, htmlSequence, speed]);

    return (
        <pre className="text-yellow-300">
            {displayedText}
        </pre>
    )
}

export {
    HtmlAnimation
}