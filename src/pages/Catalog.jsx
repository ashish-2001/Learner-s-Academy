import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Course_Card } from "../components/core/Catalog/Course_Card";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndcomponentDatas"
import { Course_Slider } from "../components/core/Catalog/Course_Slider";
import { useDispatch } from "react-redux";

function Catalog(){

    const Catalog = useParams();
    const [Desc, setDesc] = useState([]);
    const [CatalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [activeOption, setActiveOption] = useState(1);
    const dispatch = useDispatch();

    const fetchSubLinks = async () => {
        try{
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            const category = result.data.data.find((item) => item.name === Catalog.catalog);

            if(category){
                setCategoryId(category._id);
                setDesc(category);
            } else{
                console.log("Category not found for:", Catalog.catalog);
            }
            
        } catch(error){
            console.log("Could not fetch subLinks", error);
        }
    }

    useEffect(() => {
        fetchSubLinks()
    }, [Catalog]);

    useEffect(() => {
        const fetchCatalogPageData = async () => {
            const result = await getCatalogPageData(categoryId, dispatch);
            console.log("Result", result);
            setCatalogPageData(result);
        }

        if(categoryId){
            fetchCatalogPageData();
        }
    }, [categoryId]);

return(
        <div>
            <div className="box-content bg-[#161D29] px-4">
                <div className="mx-auto flex min-h-[260px] max-w-620px flex-col justify-center gap-4 lg:max-w-[1260px] ">
                    <p className="text-sm text-[#838894]">
                        Home / Catalog / 
                        <span className="text-[#FFE83D]">
                            {Catalog.catalog}
                        </span>
                    </p>
                    <p className="text-3xl text-[#FFF970]">
                        {Desc?.description}
                    </p>
                </div>
            </div>
            <div className="mx-auto box-content w-full max-w-[620px] px-4 py-12 lg:max-w-[1260px]">
                <h2 className="text-[#F1F2FF] text-2xl font-bold leading-8">Courses to get you started</h2>
                <div className="my-4 flex border-b border-b-[#424854] text-sm">
                    <button onClick={() => { setActiveOption(1)}} className={activeOption === 1 ? `px-4 py-2 border-b border-b-[#FFE83D] text-[#FFE83D] cursor-pointer` : `px-4 py-2 text-[#C5C7D4] cursor-pointer`}>Most Popular</button>
                    <button onClick={() => { setActiveOption(2)}} className={activeOption === 2 ? `px-4 py-2 border-b border-b-[#FFE83D] text-[#FFE83D] cursor-pointer` : `px-4 py-2 text-[#C5C7D4] cursor-pointer`}>New</button>
                </div>
                <div>
                    <Course_Slider courses={CatalogPageData?.selectedCourses}/>
                </div>
            </div>
            <div className="mx-auto box-content w-full max-w-[620px] px-4 py-12 lg:max-w-[1260px]">
                <h2 className="text-[#F1F2FF] text-2xl font-bold leading-8 mb-6 md:text-3xl ">
                    Similar to {Catalog.catalog}
                </h2>
                <div className="py-8">
                    <Course_Slider courses={CatalogPageData?.differentCourses || []} />
                </div>
            
            <div className="mx-auto box-content w-full max-w-[620px] px-4 py-12 lg:max-w-1260px">
                <h2 className="text-[#F1F2FF] text-2xl font-bold leading-8 mb-6 md:text-3xl">Frequently Bought Together</h2>
                <div className="grid grid-cols-2 gap-3 lg:gap-6 lg:grid-cols-2 pr-4">
                        { Array.isArray(CatalogPageData?.mostSellingCourses) &&
                            CatalogPageData?.mostSellingCourses.map((item, i) => (
                            <Course_Card  key={i} course={item} Height={"h-[400px] lg:h-[400px]"}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


export {
    Catalog
}