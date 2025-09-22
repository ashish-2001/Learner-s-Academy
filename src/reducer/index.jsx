import { combineReducers } from "redux";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import courseReducer from "../slices/CourseSlice";
import profileReducer from "../slices/ProfileSlice";
import viewCourseReducer from "../slices/ViewCourseSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    course: courseReducer,
    cart: cartReducer,
    viewCourse: viewCourseReducer
})

export {
    rootReducer
}