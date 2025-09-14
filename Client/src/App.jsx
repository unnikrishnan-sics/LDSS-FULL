import React from 'react'
import LandingPage from './components/LandingPage/LandingPage'
import { Box, ThemeProvider, createTheme } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Contact from './components/LandingPage/Contact';
import ParentSiginIn from './components/Parent/ParentSiginIn';
import ParentLogin from './components/Parent/ParentLogin';
import ParentForgotPassword from './components/Parent/ParentForgotPassword';
import ParentResetPassword from './components/Parent/ParentResetPassword';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
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

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#384371', // Setrgb(33, 167, 48) as the primary color
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

          {/* admin */}
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
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





          {/* theraphist */}
          <Route path='/therapist/registration' element={<TheraphistRegistration />} />
          <Route path='/therapist/login' element={<TheraphistLogin />} />
          <Route path='/therapist/forgotpassword' element={<TheraphistForgot />} />
          <Route path='/therapist/resetpassword/:email' element={<TheraphistRest/>} />
          <Route path='/therapist/personalinfo' element={<TheraphistPersonal/>} />
          <Route path='/therapist/home' element={<TheraphistHome />} />
          <Route path='/therapist/profile' element={<TheraphistProfile/>} />
          <Route path='/therapist/about' element={<TheraphistAbout/>} />
          <Route path='/therapist/contact' element={<TheraphistContact/>} />

        </Routes>
      </ThemeProvider>
      
    </>
  )
}

export default App
