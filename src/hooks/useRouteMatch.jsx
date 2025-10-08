import { matchPath, useLocation } from "react-router-dom";

function useRouteMatch(path){
    const location = useLocation();
    return matchPath(location.pathname, { path });
}

export {
    useRouteMatch
}