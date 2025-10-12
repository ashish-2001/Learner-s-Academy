import axios from "axios";

const axiosInstance = axios.create({});

function apiConnector(method, url, bodyData, headers, params){
    console.log("Api connector called", method, url, bodyData, headers, params)
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData || null,
        headers: headers || null,
        params: params || null
    })
}

export { 
    axiosInstance,
    apiConnector
}