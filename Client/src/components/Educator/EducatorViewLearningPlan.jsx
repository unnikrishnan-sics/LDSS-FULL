import React, { useEffect, useState } from 'react';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import { Box, Breadcrumbs, Button, Grid, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";

const EducatorViewLearningPlan = () => {
    const [educatorDetails, setEducatorDetails] = useState({});
    useEffect(() => {
        const educatorDetails = localStorage.getItem("educatorDetails");
        setEducatorDetails(JSON.parse(educatorDetails));
    }, []);
    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/educator/profile');
    };
    const { childId } = useParams();

    const [studentPlan, setStudentsPlan] = useState(null);
    const fetchLearningPlanOfStudent = async () => {
        const token = localStorage.getItem("token");
        const educatorId = (JSON.parse(localStorage.getItem("educatorDetails")))._id;


        const studentPlan = await axios.get(`http://localhost:4000/ldss/educator/getstudentplan/${educatorId}/${childId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(studentPlan.data.childPlan);
        setStudentsPlan(studentPlan.data.childPlan);
    };
    useEffect(() => {
        fetchLearningPlanOfStudent();
    }, []);

    const deleteLearningPlan = async (planid) => {
        const token = localStorage.getItem("token");
        const deletedPlan = await axios.delete(`http://localhost:4000/ldss/educator/deleteplan/${planid}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(deletedPlan);
        fetchLearningPlanOfStudent();
    }
    return (
        <>
            <EducatorNavbar educatorDetails={educatorDetails} navigateToProfile={navigateToProfile} />

            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "46px", background: "#DBE8FA" }}>
                <Typography color='primary' textAlign="center" sx={{ fontSize: "18px", fontWeight: "600" }}>
                    Learning Plan
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mt: "30px", mx: "50px" }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›">
                    <Link to="/educator/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        Home
                    </Link>
                    <Link to="/educator/allstudents" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        All Students
                    </Link>
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Learning Plan
                    </Typography>
                </Breadcrumbs>
            </Box>


            {studentPlan ?
                (
                    <Box >
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} m={"20px 50px"} sx={{ background: "#F0F6FE", height: "76px" }}>
                            <Typography variant='h4' color='primary' sx={{ fontSize: "24px", fontWeight: "600", pl: "20px" }}>Goal :{studentPlan[0]?.goal} </Typography>
                            <Typography variant='h4' color='primary' sx={{ fontSize: "24px", fontWeight: "600", pr: "20px" }}>{studentPlan[0]?.planDuration} Weeks Plan</Typography>
                        </Box>
                        {Array.isArray(studentPlan[0]?.weeks) && studentPlan[0]?.weeks.map((week, weekIndex) => {
                            return (

                                <Box key={weekIndex} display={'flex'} flexDirection={'column'} m={"20px 50px"} sx={{ height: "268px", background: "#F0F6FE" }}>

                                    <Typography variant='h6' color='primary' sx={{ fontSize: "24px", fontWeight: "500", p: "20px 30px" }}>Week {weekIndex + 1}</Typography>

                                    <Box display={"flex"} alignItems={"center"} gap={1}>


                                        {Array.isArray(week.activities) && week.activities.map((activity, index) => {
                                            return (

                                                <Box key={index} display={'flex'} flexDirection={'column'} gap={1} width={"33%"} p={"10px 30px"}>
                                                    <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>Activity {index + 1}</Typography>

                                                    <Box >
                                                        <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>{activity.title}</Typography>
                                                        <Typography variant='h6' sx={{ fontSize: "14px", fontWeight: "500", color: "#7F7F7F" }}>{activity.description}</Typography>
                                                    </Box>


                                                </Box>
                                            )
                                        })}
                                    </Box>


                                </Box>
                            )
                        })}
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
                            <Button onClick={() => deleteLearningPlan(studentPlan[0]._id)} variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}>Delete</Button>
                            <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }}>Edit</Button>
                        </Box>
                    </Box>

                ) :
                (<Typography color='primary' sx={{ mt: "50px", fontSize: "32px", fontWeight: "600" }} textAlign={'center'}>No learing plan added yet</Typography>)

            }




        </>
    )
}

export default EducatorViewLearningPlan
