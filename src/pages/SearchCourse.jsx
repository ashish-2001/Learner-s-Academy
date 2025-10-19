import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { searchCourses } from "../services/operations/courseDetailsAPI";


function SearchCourse(){
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { searchQuery } = useParams();

    asyn function fetchSearchResults(){
        setLoading(true);
        const res = await searchCourses(searchQuery, dispatch);
        setSearchResults(res);
        setLoading(false);
        console.log(res);
    }

    useEffect(() => {
        fetchSearchResults();
    }, [searchQuery]);

    return (
        <div className="mx-auto flex min-h[260px] flex-col justify-center gap-4 bg-[]">
            <p className="text-sm text-[]">
                Home / Search / 
                <span className="text-yellow-300">
                    {searchQuery}
                </span>
            </p>
            <p className="text-3xl text-[]">
                Search Results for {searchQuery}
            </p>
            <p className="max-w-[870px] text-[]">
                {searchResults?.length} results not found for {searchQuery}
            </p>
        </div>
    )
}

export {
    SearchCourse
}