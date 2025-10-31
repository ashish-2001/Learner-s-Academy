import { toast } from "react-hot-toast"
import { setProgress } from "../../slices/loadingBarSlice";
import { apiConnector } from '../apiConnector';
import { catalogData } from '../apis';

const getCatalogPageData = async(categoryId, dispatch) => {
  
  dispatch(setProgress(50));
  let result = [];

  try{
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, { categoryId: categoryId });
        console.log("CATALOG PAGE DATA API RESPONSE....", response);
        if(!response.data.success){
          throw new Error("Could not Fetch Category page data error", response);
        }
        result = response?.data.data;
      }
      catch(error) {
        toast.error("No Course added to this category yet");
        result = error?.response?.data || { success: false };
      }
      dispatch(setProgress(100));
    return result;
}

export {
    getCatalogPageData
}