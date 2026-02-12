import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Common/Navbar.jsx"
import { Footer } from "./components/Common/Footer";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { VerifyOtp } from "./pages/VerifyOtp";
import { About } from "./pages/About";
import { ContactUs } from "./pages/ContactUs";
import LoadingBar from "react-top-loading-bar";
import { setProgress } from "./slices/loadingBarSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Dashboard } from "./pages/Dashboard";
import { OpenRoute } from "./components/Core/Auth/OpenRoute";
import { PrivateRoute } from "./components/Core/Auth/PrivateRoute";
import { MyProfile } from "./components/Core/Dashboard/MyProfile";
import { Settings } from "./components/Core/Dashboard/Settings";
import { EnrolledCourses } from "./components/Core/Dashboard/EnrolledCourses";
import { Cart } from "./components/Core/Dashboard/Cart/index";
import { ACCOUNT_TYPE } from "./utils/constants.js";
import { AddCourse } from "./components/Core/Dashboard/AddCourse/Index"
import { MyCourses } from "./components/Core/Dashboard/MyCourses/MyCourses";
import { EditCourse } from "./components/Core/Dashboard/EditCourse/EditCourse";
import { Catalog } from "./pages/Catalog";
import { ScrollToTop } from "./components/ScrollToTop";
import { CourseDetails } from "./pages/CourseDetails";
import { SearchCourse } from "./pages/SearchCourse";
import { ViewCourse } from "./pages/ViewCourse";
import { VideoDetails } from "./components/Core/ViewCourse/VideoDetails";
import { PurchaseHistory } from "./components/Core/Dashboard/PurchaseHistory"
import { InstructorDashboard } from "./components/Core/Dashboard/InstructorDashboard/InstructorDashboard";
import { Error } from "./pages/Error"
import { RiWifiOffLine } from "react-icons/ri";
import { AdminPanel } from "./components/Core/Dashboard/AdminPanel";

function App() {
  console.log = function () {};
  const user = useSelector((state) => state.profile.user);
  const progress = useSelector((state) => state.loadingBar);
  const dispatch = useDispatch();
  return (
    <div className=" w-screen min-h-screen bg-[#000814] flex flex-col font-inter">
      <LoadingBar
        color="#FFD60A"
        height={1.4}
        progress={progress}
        onLoaderFinished={() => dispatch(setProgress(0))}
      />
      <Navbar setProgress={setProgress}></Navbar>
      {!navigator.onLine && (
        <div className="flex text-[#fff] text-center p-2 bg-[#838894] justify-center gap-2 items-center">
          <RiWifiOffLine size={22} />
          Please check your internet connection.
          <button
            className="ml-2 bg-[#585D69] rounded-md p-1 px-2 text-[#fff]"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/catalog/:catalog" element={<Catalog />} />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/update-password/:id" element={<ResetPassword />} />

        <Route path="/verify-email" element={<VerifyOtp />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<ContactUs />} />

        <Route path="/courses/:courseId" element={<CourseDetails />} />

        <Route path="/search/:searchQuery" element={<SearchCourse />} />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route
                path="dashboard/purchase-history"
                element={<PurchaseHistory />}
              />
            </>
          )}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
              <Route
                path="dashboard/instructor"
                element={<InstructorDashboard />}
              />
            </>
          )}
          {user?.accountType === ACCOUNT_TYPE.ADMIN && (
            <>
              <Route path="course/createCategory" element={<AdminPanel />} />
            </>
          )}
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="/dashboard/enrolled-courses/view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export {
  App
}