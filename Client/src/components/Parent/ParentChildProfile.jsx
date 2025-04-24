import React, { useEffect, useState } from 'react'
import ParentNavbar from '../Navbar/ParentNavbar'
import { useNavigate } from 'react-router-dom';

const ParentChildProfile = () => {
    const aboutBg = {
        background: "#F6F7F9"
    }
    const [parentdetails,setParentdetails]=useState({});
    useEffect(()=>{
       const parentdetails=  localStorage.getItem("parentdetails");
       setParentdetails(JSON.parse(parentdetails));
    },[]);
    const navigate = useNavigate();
    const navigateToProfile=()=>{
         navigate('/parent/profile');
    }
  return (
    <>
    <ParentNavbar aboutBg={aboutBg} parentdetails={parentdetails} navigateToProfile={navigateToProfile}/>
      
    </>
  )
}

export default ParentChildProfile
