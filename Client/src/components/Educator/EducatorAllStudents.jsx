import React, { useEffect, useState } from 'react'
import EducatorNavbar from '../Navbar/EducatorNavbar'
import { Box, Breadcrumbs, Button, Grid, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import FemaleIcon from '@mui/icons-material/Female';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import { LinearProgress } from '@mui/material';
import axios from 'axios';

const EducatorAllStudents = () => {
    const [educatorDetails, setEducatorDetails] = useState({});
    useEffect(() => {
        const educatorDetails = localStorage.getItem("educatorDetails");
        setEducatorDetails(JSON.parse(educatorDetails));
    }, []);
    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/educator/profile');
    };

    // fetch all approved parents childrens
const [Allchildren,setAllchildren]=useState([]);
    const fetchAllChildrens=async()=>{
        const token=localStorage.getItem("token");
        const educatorId=(JSON.parse(localStorage.getItem("educatorDetails")))._id
        const children=await axios.get(`http://localhost:4000/ldss/educator/getchildrenofallapprovedparents/${educatorId}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        console.log(children.data.children);
        setAllchildren(children.data.children);
    }
   
     useEffect(() => {
        fetchAllChildrens();
         
     }, []);
    return (
        <>
            <EducatorNavbar educatorDetails={educatorDetails} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: "white" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>All Students</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"start"} sx={{ mt: "30px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/educator/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>All Students</Typography>
                    </Breadcrumbs>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                        <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                        <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                    </Box>
                </Box>
                <Grid sx={{ pt: "30px", pl: "50px", pr: "50px", width: "100%" }} container spacing={2}>
{Allchildren.map((children,index)=>{
    return(

                    <Grid item xs={12} md={6} width={"49%"} key={index} sx={{height:"700px"}}>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"} sx={{ p: "50px 30px", height: "80%", background: "#F6F7F9", borderRadius: "25px", gap: "20px", width: "100%" }}>
                            <Box width={"100%"} display={"flex"} gap={5} justifyContent={"space-between"} alignItems={"center"}>
                                <Typography sx={{ fontSize: "32px", fontWeight: "600" }} color='primary'

                                >{children.name}</Typography>
                                <Box display={"flex"} alignItems={"center"} sx={{ gap: "20px" }}>
                                    <Button startIcon={<ChatIcon />} variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '120px', padding: '10px 35px', fontSize: "14px", fontWeight: "500" }}

                                    >Chat</Button>
                                    <Link to={`/educator/addlearningplan/${children._id}`}>
                                    <Button startIcon={<AddIcon />} variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '230px', padding: '10px 15px', fontSize: "14px", fontWeight: "500", letterSpacing: "0%" }}

                                    >Add Learning Plan</Button>
                                    </Link>
                                </Box>

                            </Box>
                            <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
                                <Box sx={{ gap: "20px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                    <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                        <Box sx={{ color: "#1967D2" }}><PersonOutlinedIcon /></Box>
                                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Parent Name</Typography>
                                            <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{children.parentId.name}</Typography>
                                        </Box>
                                    </Box>
                                    <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                        <Box sx={{ color: "#1967D2" }}><ApartmentOutlinedIcon /></Box>
                                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>School name</Typography>
                                            <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{children.schoolName}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ gap: "20px", pr: "250px", borderLeft: "1px solid #CCCCCC" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                    <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: "50px" }}>
                                        <Box sx={{ color: "#1967D2" }}><DateRangeIcon /></Box>
                                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Date of birth</Typography>
                                            <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{children.dateOfBirth}</Typography>
                                        </Box>
                                    </Box>
                                    <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: "50px" }}>
                                        <Box sx={{ color: "#1967D2" }}><FemaleIcon /></Box>
                                        <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Gender</Typography>
                                            <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{children.gender}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                            </Box>
                            <Box height={'100%'} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                <Typography variant='h5' sx={{ fontSize: "18px", fontWeight: "500" }} color='secondary'>Description</Typography>
                                <Typography variant='p' sx={{ fontSize: "14px", fontWeight: "500" }} color='primary'>{children.description}</Typography>
                            </Box>
                            <Box width={"100%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                <Typography variant='h5' sx={{ fontSize: "18px", fontWeight: "600" }} color='secondary'>Progress</Typography>
                                <Typography variant='h5' sx={{ fontSize: "14px", fontWeight: "500" }} color='secondary'>Weeks</Typography>
                            </Box>
                            <Box width={"100%"} sx={{ background: "#DBE8FA", height: "100px", display: "flex", alignItems: "center" }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={60}
                                    sx={{
                                        height: 20,
                                        borderRadius: 2,
                                        backgroundColor: "#DBE8FA",
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#1976d2',
                                        },
                                        width: '100%'
                                    }}
                                />
                            </Box>
                            <Box width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '275px', padding: '10px 35px', fontSize: "14px", fontWeight: "500" }}
                                >Meeting</Button>
                                <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '275px', padding: '10px 35px', fontSize: "14px", fontWeight: "500" }}
                                >Activities</Button>
                            </Box>

                        </Box>
                    </Grid>
    )
})}


                </Grid>
            </Box>

        </>
    )
}

export default EducatorAllStudents
