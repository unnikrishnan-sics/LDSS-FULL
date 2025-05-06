import React, { useEffect, useState } from 'react'
import ParentNavbar from '../Navbar/ParentNavbar'
import { Link, useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Avatar, Box, Breadcrumbs, Button, Card, Fade, Grid, Modal, Typography } from '@mui/material';

const ParentEducatorLearning = () => {
    const [parentdetails, setParentdetails] = useState({});
    useEffect(() => {

        const parentdetails = localStorage.getItem("parentdetails");
        setParentdetails(JSON.parse(parentdetails));
    }, []);
    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/parent/profile');
    }
  return (
    <>
      <ParentNavbar parentdetails={parentdetails} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: "white" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Learning Plan</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ marginTop: "20px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/parent/home">
                            Home
                        </Link>
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/parent/learningplan">
                            Learning
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Educators’s Learning Plan</Typography>
                    </Breadcrumbs>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={3}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                            <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                            <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                        </Box>
                    </Box>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} m={"20px 50px"} sx={{ background: "#F0F6FE", height: "76px" }}>
                    <Typography variant='h4' color='primary' sx={{ fontSize: "24px", fontWeight: "600", pl: "20px" }}>Goal : Improve storytelling and sequencing ability</Typography>
                    <Typography variant='h4' color='primary' sx={{ fontSize: "24px", fontWeight: "600", pr: "20px" }}>3 Weeks Plan</Typography>
                </Box>
                <Box display={'flex'} flexDirection={'column'} m={"20px 50px"} sx={{ height: "268px", background: "#F0F6FE" }}>
                    <Typography variant='h6' color='primary' sx={{ fontSize: "24px", fontWeight: "500",p:"20px 30px" }}>Week 1</Typography>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                        <Box display={'flex'} flexDirection={'column'} gap={1} width={"33%"} p={"10px 30px"}>
                            <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>Activity 1</Typography>
                            <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>Picture Story Sequencing</Typography>
                            <Typography variant='h6' sx={{ fontSize: "14px", fontWeight: "500", color: "#7F7F7F" }}>Arrange a set of 4–5 pictures in logical order to form a story. Helps with sequencing and storytelling.</Typography>
                            <Typography variant='h6' sx={{ fontSize: "18px", fontWeight: "500", color: "#149319" }}>Completed on 12/05/2025</Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} gap={1} width={"33%"} p={"10px 30px"}>
                            <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>Activity 1</Typography>
                            <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>Picture Story Sequencing</Typography>
                            <Typography variant='h6' sx={{ fontSize: "14px", fontWeight: "500", color: "#7F7F7F" }}>Arrange a set of 4–5 pictures in logical order to form a story. Helps with sequencing and storytelling.</Typography>
                            <Typography variant='h6' sx={{ fontSize: "18px", fontWeight: "500", color: "#149319" }}>Completed on 12/05/2025</Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} gap={1} width={"33%"} p={"10px 30px"}>
                            <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>Activity 1</Typography>
                            <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>Picture Story Sequencing</Typography>
                            <Typography variant='h6' sx={{ fontSize: "14px", fontWeight: "500", color: "#7F7F7F" }}>Arrange a set of 4–5 pictures in logical order to form a story. Helps with sequencing and storytelling.</Typography>
                            <Typography variant='h6' sx={{ fontSize: "18px", fontWeight: "500", color: "#149319" }}>Completed on 12/05/2025</Typography>
                        </Box>
                    </Box>

                </Box>
            </Box>
    </>
  )
}

export default ParentEducatorLearning
