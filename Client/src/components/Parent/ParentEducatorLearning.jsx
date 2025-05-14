import React, { useEffect, useState } from 'react'
import ParentNavbar from '../Navbar/ParentNavbar'
import { Link, useNavigate, useParams } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Avatar, Box, Breadcrumbs, Button, Card, Fade, Grid, Modal, Typography } from '@mui/material';
import axios from 'axios';

const ParentEducatorLearning = () => {
    const [parentdetails, setParentdetails] = useState({});
    useEffect(() => {

        const parentdetails = localStorage.getItem("parentdetails");
        setParentdetails(JSON.parse(parentdetails));
    }, []);
    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/parent/profile');
    };

    const { childId } = useParams();

    // fetch accepted educator
    const [acceptedEducators, setAcceptedEducators] = useState([]);
    const fetchAcceptedEducators = async () => {
        const token = localStorage.getItem('token');
        const parentId = (JSON.parse(localStorage.getItem("parentdetails")))._id;
        const acceptededucators = await axios.get(`http://localhost:4000/ldss/parent/getacceptededucator/${parentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(acceptededucators.data.acceptedEducators);
        setAcceptedEducators(acceptededucators.data.acceptedEducators);


    }

    // fetch child learning plan given by educator
    const [learningPlan, setLearningPlan] = useState(null);
    const fetchLearningPlanOfSingleChild = async (educatorId) => {
        const token = localStorage.getItem('token');

        const learningPlan = await axios.get(`http://localhost:4000/ldss/educator/getstudentplan/${educatorId}/${childId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(learningPlan.data.childPlan);
        setLearningPlan(learningPlan.data.childPlan);

    };
    const tryAllEducatorsForPlan = async () => {
        for (const educator of acceptedEducators) {
            const found = await fetchLearningPlanOfSingleChild(educator.recipientId._id);
            if (found) break;
        }
    };

    useEffect(() => {
        const loadEducators = async () => {
            await fetchAcceptedEducators();
        };
        loadEducators();
    }, []);

    useEffect(() => {
        if (acceptedEducators.length > 0) {
            tryAllEducatorsForPlan();
        }
    }, [acceptedEducators]);

    // update status by parent
    // const updateStatus=async(educatorId)=>{
    //     const token=localStorage.getItem("token");
    //     const updatedStatus=await axios.put(`http://localhost:4000/ldss/parent/updatelearningplan/${childId}/${educatorId}`,learningPlan,{
    //         headers:{
    //             Authorization:`Bearer ${token}`
    //         }
    //     });
    //     console.log(updatedStatus);
    //     tryAllEducatorsForPlan();
        
    // } 
    const markActivityComplete = async (weekIndex, activityIndex) => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.put(
                `http://localhost:4000/ldss/parent/complete-activity/${childId}/${weekIndex}/${activityIndex}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res.data);
            tryAllEducatorsForPlan(); // Refresh UI
        } catch (err) {
            console.error(err);
        }
    };
    
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

                {learningPlan && (
                    <Box>
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} m={"20px 50px"} sx={{ background: "#F0F6FE", height: "76px" }}>
                            <Typography variant='h4' color='primary' sx={{ fontSize: "24px", fontWeight: "600", pl: "20px" }}>
                                Goal: {learningPlan[0].goal}
                            </Typography>
                            <Typography variant='h4' color='primary' sx={{ fontSize: "24px", fontWeight: "600", pr: "20px" }}>
                                {learningPlan[0].planDuration} Weeks Plan
                            </Typography>
                        </Box>
                       

                        {Array.isArray(learningPlan[0]?.weeks) && learningPlan[0].weeks?.map((week, weekIndex) => (
                            <Box key={weekIndex} display={'flex'} flexDirection={'column'} m={"20px 50px"} sx={{ background: "#F0F6FE", mb: 3 }}>
                                <Typography variant='h6' color='primary' sx={{ fontSize: "24px", fontWeight: "500", p: "20px 30px" }}>
                                    Week {weekIndex + 1}
                                </Typography>

                                <Box display={"flex"} alignItems={"center"} gap={1}>
                                    {week.activities?.map((activity, activityIndex) => (
                                        <Box key={activityIndex} display={'flex'} flexDirection={'column'} gap={1} width={"33%"} p={"10px 30px"}>
                                            <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>
                                                Activity {activityIndex + 1}
                                            </Typography>
                                            <Typography variant='h6' color='primary' sx={{ fontSize: "18px", fontWeight: "500" }}>
                                                {activity.title}
                                            </Typography>
                                            <Typography variant='h6' sx={{ fontSize: "14px", fontWeight: "500", color: "#7F7F7F" }}>
                                                {activity.description}
                                            </Typography>
                                            {activity.completed===true ?
                                        ( <Typography variant='h6' sx={{ fontSize: "18px", fontWeight: "500", color: "#149319" }}>
                                       completed on {new Date(learningPlan[0].updatedStatus).toLocaleDateString('en-GB')}
                                    </Typography>) 
                                    :
                                    (
                                        <Box display={'flex'} alignItems={'center'} gap={2}>
                                            <Typography  color="secondary" variant='h6' sx={{ fontSize: "14px", fontWeight: "500" }}>In Progress</Typography>
                                            <Button variant='outlined' color='secondary' onClick={()=>markActivityComplete(weekIndex, activityIndex)} sx={{width:"250px",p:"10px 20px",height:"40px",borderRadius:"25px"}}>Completed</Button>
                                        </Box>
                                    )   
                                        }
                                           
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}

            </Box>
        </>
    )
}

export default ParentEducatorLearning
