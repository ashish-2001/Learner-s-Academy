import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Footer } from "../components/Common/Footer";
import { Course_Card } from "../components/Core/Catalog/Course_Card";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndcomponentDatas"
import { Error } from "./Error";
import { Course_Slider } from "../components/Core/Catalog/Course_Slider";

function Catalog(){
    const { loading } = useSelector((state) => state.profile)
    const { catalogName } = useParams();
    const [active, setActive] = useState(1);
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
        ;(async () => {
            try{
                const res = await apiConnector("GET", categories.CATEGORY_API)
                const category_id = res?.data?.data?.filter(
                    (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
                )[0].category_id
                setCategoryId(category_id)
            }catch(e){
                console.log("Could not fetch data", e.message)
            }
        })()
    }, [catalogName])

    useEffect(() => {
        if(categoryId){
            ;(async()=>{
                try{
                    const res = await getCatalogPageData(categoryId)
                    setCatalogPageData(res)
                }
                catch(e){
                    console.log(e.message)
                }
            })()
        }
    }, [categoryId])

    if(loading || !catalogPageData){
        return(
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }
    if(!loading && !catalogPageData.success){
        return <Error/>
    }

    return(
        <>
            <div className="box-content bg-[#161D29] px-4">
                <div className="mx-auto flex min-h-[260px] max-w-620px flex-col justify-center gap-4 lg:max-w-[1260px] ">
                    <p className="text-sm text-[#838894]">
                        {`Home / Catalog / `}
                        <span className="text-[#FFE83D]">
                            {catalogPageData?.data?.selectedCategory?.name}
                        </span>
                    </p>
                    <p className="text-3xl text-[#FFF970]">
                        {catalogPageData?.data?.selectedCategory?.name}
                    </p>
                    <p className="max-w-[870px] text-[#CFAB08]">
                        {catalogPageData?.data?.selectedCategory?.description}
                    </p>
                </div>
            </div>
            <div className="mx-auto box-content w-full max-w-[620px] px-4 py-12 lg:max-w-[1260px]">
                <div className="section_heading">Courses to get you started</div>
                <div className="my-4 flex border-b border-b-[#424854] text-sm">
                    <p className={`px-4 py-2 ${
                        active === 1
                        ? "border-b border-b-[#FFE83D] text-[#FFE83D]"
                        : "text-[#C5C7D4]"
                    } cursor-pointer`} onClick={() => setActive(1)}>
                        Most Popular
                    </p>
                    <p className={`px-4 py-2 ${
                        active === 2
                        ? "border-b border-b-[#FFE83D] text-[#FFE83D]"
                        : "text-[#C5C7D4]"
                    } cursor-pointer`} onClick={() => setActive(2)}>
                        New
                    </p>
                </div>
                <div>
                    <Course_Slider Courses={catalogPageData?.data?.selectedCategory?.courses}/>
                </div>
            </div>
            <div className="mx-auto box-content w-full max-w[620px] px-4 py-12 lg:max-w-[1260px]">
                <div className="section_heading">
                    Top courses in {catalogPageData?.data?.differentCategory?.name}
                </div>
                <div className="py-8">
                    <Course_Slider courses={catalogPageData?.data?.differentCategory?.courses}/>
                </div>
            </div>
            <div className="mx-auto box-content w-full max-w-[620px] px-4 py-12 lg:max-w-1260px">
                <div className="section_heading">Frequently Bought</div>
                <div className="py-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {catalogPageData?.data?.mostSellingCourses?.slice(0, 4).map((course, i) => (
                            <Course_Card course={course} key={i} Height={"h-[400px]"}/>
                        ))}
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export {
    Catalog
}