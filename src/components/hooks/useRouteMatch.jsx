import { matchPath, useLocation } from "react-router-dom";

function useRouteMatch(path){
    const locaation = useLocation();
    return matchPath(location.pathname, { path });
}

export {
    useRouteMatch
}