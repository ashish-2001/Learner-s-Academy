import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Navbar } from "./components/Common/Navbar";
import { getUserDetails } from './services/operations/ProfileApi';
import { Home } from './pages/Home';
import { About } from "./pages/About";
import { Contact } from './pages/Contact';
import { CourseDetails } from './pages/CourseDetails';
import { Catalog } from "./pages/Catalog";
import { OpenRoute } from './components/Core/Auth/OpenRoute';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { UpdatePassword } from './components/Core/Dashboard/Settings/UpdatePassword';
import { Signup } from './pages/Signup';
import { VerifyEmail } from './pages/VerifyEmail';
import { PrivateRoute } from './components/Core/Auth/PrivateRoute';
import { Dashboard } from './pages/Dashboard';
import { MyProfile } from './components/Core/Dashboard/MyProfile';
import { Settings } from './components/Core/Dashboard/Settings/Index';
import { ACCOUNT_TYPE } from './utils/constants';
import { Instructor } from './components/Core/Dashboard/Instructor';
import { MyCourses } from './components/Core/Dashboard/MyCourses';
import { EditCourse } from './components/Core/Dashboard/EditCourse';
import { EnrolledCourses } from './components/Core/Dashboard/EnrolledCourses';
import { Cart } from './components/Core/Dashboard/Cart/Index';
import { ViewCourse } from './pages/ViewCourse';
import { Error } from "./pages/Error";
import { VideoDetails } from './components/Core/ViewCourse/VideoDetails';
import { AddCourse } from './components/Core/Dashboard/AddCourse';


function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);

  useEffect(() =>{
    if(localStorage.getItem("token")){
      const token =  JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate));
    }
  }, [])

  return (
      <div className='flex min-h-screen flex-col bg-richblack-900 font-inter'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/courses/:courseId' element={<CourseDetails/>}/>
        <Route path='/catalog/:catalogName' element={<Catalog/>}/>
        <Route 
        path='login'
        element={
        <OpenRoute>
          <Login/>
        </OpenRoute>
      }
      />

      <Route path='forget-password'
      element={
        <OpenRoute>
          <ForgotPassword/>
        </OpenRoute>
      }
      />

      <Route 
      path='update-password/:id'
      element={
        <OpenRoute>
          <UpdatePassword/>
        </OpenRoute>
      }
      />

      <Route 
      path='signup'
      element={
        <OpenRoute>
          <Signup/>
        </OpenRoute>
      }
      />

      <Route 
      path='verify-email'
      element={
        <OpenRoute>
          <VerifyEmail/>
        </OpenRoute>
      }
      />

      <Route 
      element={
        <PrivateRoute>
          <Dashboard/>
        </PrivateRoute>
      }
      >
        <Route path='dashboard/my-profile' element={<MyProfile/>}/>
        <Route path='dashboard/settings' element={<Settings/>}/>
        {
          user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
            <Route path='dashboard/instructor' element={<Instructor/>}/>
            <Route path='dashboard/my-courses' element={<MyCourses/>}/>
            <Route path='dashboard/add-course' element={<AddCourse/>}/>
            <Route path='dashboard/edit-course/:courseId' element={<EditCourse/>}/>
            </>
          )
        }

        {user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
            <Route path='dashboard/enrolled-courses' element={<EnrolledCourses/>}/>
            <Route path='/dashboard/cart' element={<Cart/>}/>
          </>
        )}
        <Route path='dashboard/settings' element={<Settings/>}/>
      </Route>

      <Route element={
        <PrivateRoute>
          <ViewCourse/>
        </PrivateRoute>}>

        {user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
            <Route path='view-course/:courseId/section/:sectionId/sub-section/:subSectionId' element={<VideoDetails/>}/>
          </>
        )}
      </Route>

      <Route path='*' element={<Error/>}/>
      </Routes>
    </div>
  )
}

export default App
