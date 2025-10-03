import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";

async function getCatalogPageData(categoryId){
    const toastId = toast.loading("Loading...")
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
        console.log("CATALOGPAGEDATA_API api error...........", error)
        toast.error(error.message)
        result = error.message?.data
    }
    toast.dismiss(toastId)
    return result
}


export { 
    getCatalogPageData
}