import React, { useEffect, useState } from 'react'
import ParentNavbar from '../Navbar/ParentNavbar'
import { Link, useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Avatar, Box, Breadcrumbs, Button, Card, Fade, Grid, Modal, Rating, Typography } from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import FemaleIcon from '@mui/icons-material/Female';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import Ratings from './Common/Ratings';

const ParentLearningPlan = () => {
    const [parentdetails, setParentdetails] = useState({});
    useEffect(() => {

        const parentdetails = localStorage.getItem("parentdetails");
        setParentdetails(JSON.parse(parentdetails));
    }, []);
    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/parent/profile');
    };
    const [openRating, setOpenRating] = React.useState(false);
    const handleRatingOpen = () => setOpenRating(true);
    const handleRatingClose = () => setOpenRating(false);
    return (
        <>
            <ParentNavbar parentdetails={parentdetails} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: "white" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Learning</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ marginTop: "20px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/parent/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>learning</Typography>
                    </Breadcrumbs>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={3}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                            <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                            <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                        </Box>
                    </Box>
                </Box>
                {/* child details */}

                <Grid sx={{ pt: "10px", pl: "50px", pr: "50px", width: "100%" }} container spacing={2}>


                    <Grid item xs={12} md={6} width={"49%"} sx={{ height: "470px" }}>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"} sx={{ p: "20px 30px", height: "90%", background: "#F6F7F9", borderRadius: "25px", gap: "20px", width: "100%" }}>
                            <Box width={"100%"} display={"flex"} gap={5} justifyContent={"space-between"} alignItems={"center"}>
                                <Typography sx={{ fontSize: "32px", fontWeight: "600" }} color='primary'

                                >name</Typography>
                                <Box display={"flex"} alignItems={"center"} sx={{ gap: "20px" }}>
                                    <Button startIcon={<ChatIcon />} variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '150px', padding: '10px 35px', fontSize: "14px", fontWeight: "500" }}

                                    >Educator</Button>
                                    <Link>
                                        <Button startIcon={<ChatIcon />} variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '150px', padding: '10px 15px', fontSize: "14px", fontWeight: "500", letterSpacing: "0%" }}

                                        >Theraphist</Button>
                                    </Link>
                                </Box>

                            </Box>
                            <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
                                <Box sx={{ gap: "20px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                    <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                        <Box sx={{ color: "#1967D2" }}><PersonOutlinedIcon /></Box>
                                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Date of birth</Typography>
                                            <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>ee</Typography>
                                        </Box>
                                    </Box>
                                    <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                        <Box sx={{ color: "#1967D2" }}><ApartmentOutlinedIcon /></Box>
                                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>School name</Typography>
                                            <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>ff</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ gap: "20px", pr: "250px", borderLeft: "1px solid #CCCCCC" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                    <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: "50px" }}>
                                        <Box sx={{ color: "#1967D2" }}><DateRangeIcon /></Box>
                                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>gender</Typography>
                                            <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>ee</Typography>
                                        </Box>
                                    </Box>


                                </Box>

                            </Box>



                            <Box sx={{ border: "1px solid #CCCCCC", borderRadius: "12px" }} height={"176px"} width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                <Box display={'flex'} flexDirection={'column'} width={"100%"} p={3}>
                                    <Box width={"100%"} display={'flex'} alignItems={'center'} justifyContent={'space-around'}>
                                        <Typography variant='p' color='secondary' sx={{ fontSize: "18px", fontWeight: "600", mt: "10px" }}>Educator</Typography>
                                        <Button onClick={handleRatingOpen} startIcon={<AddIcon />} variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "25px", width: '118px', padding: '15px 25px', fontSize: "14px", fontWeight: "500" }}>Rating</Button>
                                    </Box>
                                    <Typography variant='p' color='primary' sx={{ fontSize: "14px" }}>Complete Learning plan</Typography>
                                    <Link to={`/parent/educatorlearningplan`}>
                                        <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '227px', padding: '10px 35px', fontSize: "14px", fontWeight: "500" }}>Learning plan</Button>
                                    </Link>
                                </Box>
                                <Box display={'flex'} flexDirection={'column'} width={"100%"} p={3}>
                                    <Box width={"100%"} display={'flex'} alignItems={'center'} justifyContent={'space-around'}>
                                        <Typography variant='p' color='secondary' sx={{ fontSize: "18px", fontWeight: "600", mt: "10px" }}>Theraphist</Typography>

                                        <Button startIcon={<AddIcon />} variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "25px", width: '118px', padding: '15px 25px', fontSize: "14px", fontWeight: "500" }}>Rating</Button>
                                    </Box>
                                    <Typography variant='p' color='primary' sx={{ fontSize: "14px" }}>Complete Learning plan</Typography>
                                    <Link to={`/parent/Theraphistlearningplan`}>

                                        <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '227px', padding: '10px 35px', fontSize: "14px", fontWeight: "500" }}>Learning plan</Button>
                                    </Link>
                                </Box>
                            </Box>

                        </Box>
                    </Grid>

                </Grid>

                <Ratings openRating={openRating} handleRatingClose={handleRatingClose} />

            </Box>

        </>
    )
}

export default ParentLearningPlan
