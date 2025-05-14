import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import { Box, Breadcrumbs, Button, Typography } from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FemaleIcon from '@mui/icons-material/Female';
import DateRangeIcon from '@mui/icons-material/DateRange';
import axiosInstance from '../../Api_service/baseUrl';

const EducatorMeeting = () => {
    const [educatorDetails, setEducatorDetails] = useState({});
    useEffect(() => {
        const educatorDetails = localStorage.getItem("educatorDetails");
        setEducatorDetails(JSON.parse(educatorDetails));
    }, []);
    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/educator/profile');
    };
const [meetings,setMeetings]=useState([]);
    const fetchAllMeetings=async()=>{
        const token=localStorage.getItem("token");
        const educatorId=(JSON.parse(localStorage.getItem("educatorDetails")))._id;
        const meetings=await axiosInstance.get(`/educator/viewmeeting/${educatorId}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        console.log(meetings.data.meetings);
        setMeetings(meetings.data.meetings);
    };
    useEffect(()=>{
        fetchAllMeetings();
    },[])
  return (
    <>
    <EducatorNavbar educatorDetails={educatorDetails} navigateToProfile={navigateToProfile} />
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Meetings
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mt: "30px", mx: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link to="/educator/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Home
                    </Link>
                    
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Meetings
                    </Typography>
                </Breadcrumbs>
            </Box>
            <Box sx={{background:"white"}}>
            <Box display={'flex'} flexDirection={'column'} gap={2}>
                {meetings.map((meeting,index)=>{
                    return(

                    <Box key={index} display={'flex'} alignItems={'center'} sx={{ height: "198px", background: "#F0F6FE", borderRadius: "20px",m:"20px 50px" }}>
                        <Box sx={{m:"20px",borderRadius:"15px",border:"1px solid #CCCCCC",height:"150px",flexBasis:"40%"}} display={"flex"} justifyContent={"space-between"}>
                            <Box sx={{ gap: "20px",p:"20px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                    <Box sx={{ color: "#1967D2" }}><PersonOutlinedIcon /></Box>
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                        <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Students name</Typography>
                                        <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{meeting.childId.name}</Typography>
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                    <Box sx={{ color: "#1967D2" }}><PersonOutlinedIcon /></Box>
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                        <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>parent name</Typography>
                                        <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{meeting.childId.parentId?.name}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{borderLeft:"1px solid #CCCCCC",m:"10px 0px"}}></Box>
                            <Box sx={{ gap: "20px", p:"20px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: "50px" }}>
                                    <Box sx={{ color: "#1967D2" }}><DateRangeIcon /></Box>
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                        <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Date of birth</Typography>
                                        <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{meeting.childId.dateOfBirth}</Typography>
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: "50px" }}>
                                    <Box sx={{ color: "#1967D2" }}><FemaleIcon /></Box>
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                        <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>gender</Typography>
                                        <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{meeting.childId.gender}</Typography>
                                    </Box>
                                </Box>


                            </Box>

                        </Box>
                        <Box sx={{m:"20px",borderRadius:"15px",border:"1px solid #CCCCCC",height:"150px",flexBasis:"40%"}} display={"flex"} justifyContent={"space-between"}>
                            <Box sx={{ gap: "20px",p:"20px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                    
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                        <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Meeting</Typography>
                                        <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{meeting.meetingTitle}</Typography>
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                    
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                        <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Date</Typography>
                                        <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{meeting.date}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{borderLeft:"1px solid #CCCCCC",m:"10px 0px"}}></Box>
                            <Box sx={{ gap: "20px", p:"20px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: "50px" }}>
                                    
                                    <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                        <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Time</Typography>
                                        <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{meeting.startTime} - {meeting.endTime}</Typography>
                                    </Box>
                                </Box>
                                


                            </Box>

                        </Box>
                        <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '150px', padding: '10px 35px' }}>Join</Button>
                    </Box>
                    )
                })}
                </Box>
            </Box>
    </>
  )
}

export default EducatorMeeting
