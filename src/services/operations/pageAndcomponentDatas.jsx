import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";
import { setProgress } from "../../slices/loadingBarSlice";

async function getCatalogPageData(categoryId, dispatch){
    dispatch(setProgress(50));
    let result = [];

    try{
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {
            categoryId: categoryId
        })
        if(!response?.data?.success){
            throw new Error("Could not fetch category page data")
        }
        result = response?.data
    } catch(error){
        console.log("CATALOG PAGEDATA API api error...........", error)
        toast.error(error.message)
        result = error.message?.data
    }
    dispatch(setProgress(100));
    return result;
}


export { 
    getCatalogPageData
}