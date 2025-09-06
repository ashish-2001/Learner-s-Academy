const rootReducer = combileReducers({
    auth: authReducer,
    profile: profileReducer,
    course: courseReducer,
    cart: cartReducer,
    viewCourse: viewCourseReducer
})

export default rootReducer