import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from 'react-router-dom';
import { Navbar } from "./components/Common/Navbar";
import { Home } from './pages/Home';
import { About } from "./pages/About";
import { Contact } from './pages/ContactUs';
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
import LoadingBar from 'react-top-loading-bar';
import { setProgress } from './slices/loadingBarSlice';
import { RiWifiOffLine } from 'react-icons/ri';
import { ScrollToTop } from "./components/ScrollTOTop";
import { SearchCourse } from "./pages/SearchCourse";
import { Footer } from './components/Common/Footer';


function App() {

  const dispatch = useDispatch();
  const progress = useSelector((state) => state.loadingBar);
  const { user } = useSelector((state) => state.profile.user);

  return (
      <div className='w-screen min-h-screen  bg-[#000814] flex flex-col font-inter'>
      <LoadingBar
        color='#FFD60A'
        height={1.4}
        progress={progress}
        onLoaderFinished={() => dispatch(setProgress(0))}
      />
      <Navbar setProgress={setProgress}/>
      {!navigator.onLine && (
        <div className='bg-[#000814] flex text-white text-center p-2 justify-center gap-2 items-center'>
          <RiWifiOffLine size={22}/>
          Please Check your internet connection.
          <button className='ml-2 bg-[#000814] rounded-md p-1 text-white' onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/catalog/:catalog' element={<Catalog />}/>
        <Route
          path='/login'
          element={
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <OpenRoute>
              <Signup/>
            </OpenRoute>
          }
        />

      <Route path='/forget-password'
      element={<ForgotPassword/>}/>

      <Route path='update-password/:id'
        element={
        <OpenRoute>
          <UpdatePassword/>
        </OpenRoute>
        }/>

      <Route 
      path='verify-email'
      element={
        <OpenRoute>
          <VerifyEmail/>
        </OpenRoute>
      }
      />

      <Route
        path='/about'
        element={
          <About/>
        }
      />

      <Route
        path='/contact'
        element={
          <Contact/>
        }
      />

      <Route
        path='/courses/:courseId'
        element={<CourseDetails/>
        }
      />

      <Route path='/courses/:searchQuery' element={<SearchCourse/>}/>
      
      <Route 
        element={
        <PrivateRoute>
          <Dashboard/>
        </PrivateRoute>
      }/>
        <Route path='dashboard/my-profile' element={<MyProfile/>}/>
        <Route path='dashboard/settings' element={<Settings/>}/>
        { user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
            <Route path='dashboard/cart' element={<Cart/>}/>
            <Route path='dashboard/enrolled-courses' element={<EnrolledCourses/>}/>
            <Route path='dashboard/purchase-history' element={<PurchaseHistory/>}/>
            <Route path='dashboard/edit-course/:courseId' element={<EditCourse/>}/>
            </>
          )
        }

        {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
            <Route path='dashboard/add-course' element={<AddCourse/>}/>
            <Route path='/dashboard/my-courses' element={<MyCourses/>}/>
            <Route path='dashboard/edit-course/:courseId' element={<EditCourse />}/>
            <Route path='dashboard/instructor' element={<InstructorDashboard/>}/>
          </>
        )} 
      <Route element={
        <PrivateRoute>
          <ViewCourse/>
        </PrivateRoute>}>

        {user?.accountType === ACCOUNT_TYPE.ADMIN && (
          <>
            <Route path='dashboard/admin-panel' element={<AdminPanel/>}/>
          </>
        )}
      </Route>

      <Route element={
        <PrivateRoute>
          <ViewCourse/>
        </PrivateRoute>}
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path='/dashboard/enrolled-courses/view-course/:courseId/section/:sectionId/sub-section/:subsectionId'
                element={<VideoDetails/>}
              />
            </>
          )}
        </Route>
        <Route path='*' element={<Home/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
