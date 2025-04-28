import React from 'react'
import LandingPage from './components/LandingPage/LandingPage'
import { Box, ThemeProvider, createTheme } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Contact from './components/LandingPage/Contact';
import ParentSiginIn from './components/Parent/ParentSiginIn';
import ParentLogin from './components/Parent/ParentLogin';
import ParentForgotPassword from './components/Parent/ParentForgotPassword';
import ParentResetPassword from './components/Parent/ParentResetPassword';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminViewEducator from './components/Admin/AdminViewEducator';
import EducatorRegistration from './components/Educator/EducatorRegistration';
import EducatorLogin from './components/Educator/EducatorLogin';
import EducatorForgotPassword from './components/Educator/EducatorForgotPassword';
import EducatorResetPassword from './components/Educator/EducatorResetPassword';
import EducatorPersonal from './components/Educator/EducatorPersonal';
import TheraphistRegistration from './components/Theraphist/TheraphistRegistration';
import TheraphistLogin from './components/Theraphist/TheraphistLogin';
import TheraphistForgot from './components/Theraphist/TheraphistForgot';
import TheraphistRest from './components/Theraphist/TheraphistRest';
import TheraphistPersonal from './components/Theraphist/TheraphistPersonal';
import AboutUs from './components/LandingPage/AboutUs';
import { ToastContainer } from 'react-toastify';
import ParentHome from './components/Parent/ParentHome';
import ParentProfile from './components/Parent/ParentProfile';
import ParentAboutUs from './components/Parent/ParentAboutUs';
import ParentContactUs from './components/Parent/ParentContactUs';
import EducatorHome from './components/Educator/EducatorHome';
import EducatorProfile from './components/Educator/EducatorProfile';
import EducatorAbout from './components/Educator/EducatorAbout';
import EducatorContact from './components/Educator/EducatorContact';
import TheraphistHome from './components/Theraphist/TheraphistHome';
import TheraphistAbout from './components/Theraphist/TheraphistAbout';
import TheraphistContact from './components/Theraphist/TheraphistContact';
import TheraphistProfile from './components/Theraphist/TheraphistProfile';
import ParentChildProfile from './components/Parent/ParentChildProfile';
import EducatorAllStudents from './components/Educator/EducatorAllStudents';
import EducatorLearningPlan from './components/Educator/EducatorLearningPlan';
import ParentAllEducator from './components/Parent/ParentAllEducator';
import ParentAllTheraphist from './components/Parent/ParentAllTheraphist';

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#384371', // Set #384371 as the primary color
      },
      secondary: {
        main: '#1967D2', // Optional: customize secondary color
      },
    },
  });
  return (
    <>
    
    <ToastContainer/>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/aboutus' element={<AboutUs />} />

          {/* parents */}
          <Route path='/parent/siginin' element={<ParentSiginIn />} />
          <Route path='/parent/login' element={<ParentLogin />} />
          <Route path='/parent/forgotpassword' element={<ParentForgotPassword />} />
          <Route path='/parent/resetpassword/:email' element={<ParentResetPassword/>}/>
          <Route path='/parent/home' element={<ParentHome/>}/>
          <Route path='/parent/profile' element={<ParentProfile/>}/>
          <Route path='/parent/about' element={<ParentAboutUs/>}/>
          <Route path='/parent/contact' element={<ParentContactUs/>}/>
          <Route path='/parent/childprofile' element={<ParentChildProfile/>}/>
          <Route path='/parent/viewalleducators' element={<ParentAllEducator/>}/>
          <Route path='/parent/viewalltheraphist' element={<ParentAllTheraphist/>}/>

          {/* admin */}
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/viewEducator' element={<AdminViewEducator />} />

          {/* educator */}
          <Route path='/educator/registration' element={<EducatorRegistration />} />
          <Route path='/educator/login' element={<EducatorLogin />} />
          <Route path='/educator/forgotpassword' element={<EducatorForgotPassword />} />
          <Route path='/educator/resetpassword/:email' element={<EducatorResetPassword />} />
          <Route path='/educator/personalinfo' element={<EducatorPersonal />} />
          <Route path='/educator/home' element={<EducatorHome />} />
          <Route path='/educator/profile' element={<EducatorProfile/>} />
          <Route path='/educator/about' element={<EducatorAbout/>} />
          <Route path='/educator/contact' element={<EducatorContact/>} />
          <Route path='/educator/allstudents' element={<EducatorAllStudents/>} />
          <Route path='/educator/addlearningplan' element={<EducatorLearningPlan/>} />

          {/* theraphist */}
          <Route path='/theraphist/registration' element={<TheraphistRegistration />} />
          <Route path='/theraphist/login' element={<TheraphistLogin />} />
          <Route path='/theraphist/forgotpassword' element={<TheraphistForgot />} />
          <Route path='/theraphist/resetpassword/:email' element={<TheraphistRest/>} />
          <Route path='/theraphist/personalinfo' element={<TheraphistPersonal/>} />
          <Route path='/theraphist/home' element={<TheraphistHome />} />
          <Route path='/theraphist/profile' element={<TheraphistProfile/>} />
          <Route path='/theraphist/about' element={<TheraphistAbout/>} />
          <Route path='/theraphist/contact' element={<TheraphistContact/>} />
        </Routes>
      </ThemeProvider>
      
    </>
  )
}

export default App
