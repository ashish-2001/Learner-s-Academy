import axios from "axios";

const axiosInstance = axios.create({});

function apiConnector(method, url, bodyData, headers, params){
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null
    })
}

export { 
    axiosInstance,
    apiConnector
}