import React, { useEffect, useState } from 'react';
import EducatorNavbar from '../Navbar/EducatorNavbar';
import { Box, Breadcrumbs, Button, Grid, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import { toast } from 'react-toastify';

const EducatorLearningPlan = () => {
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };
    const inputStyle = { height: "40px", borderRadius: "8px", border: "1px solid #CCCCCC", padding: '8px' };


    const { childId } = useParams();

    const [educatorDetails, setEducatorDetails] = useState({});
    const [learningPlan, setLearningPlan] = useState({
        goal: '',
        planDuration: '',
        weeks: [
            {
                activities: [
                    { title: '', description: '' }
                ]
            }
        ],

    });



    useEffect(() => {
        const educatorDetails = localStorage.getItem("educatorDetails");
        if (educatorDetails) {
            setEducatorDetails(JSON.parse(educatorDetails));
        }
    }, []);

    const navigateToProfile = () => {
        navigate('/educator/profile');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLearningPlan(prev => ({ ...prev, [name]: value }));
    };

    const handleActivityChange = (weekIndex, activityIndex, e) => {
        const { name, value } = e.target;
        const updatedWeeks = [...learningPlan.weeks];
        updatedWeeks[weekIndex].activities[activityIndex][name] = value;
        setLearningPlan(prev => ({ ...prev, weeks: updatedWeeks }));
    };

    const handleAddActivity = (weekIndex) => {
        const updatedWeeks = [...learningPlan.weeks];
        updatedWeeks[weekIndex].activities.push({ title: '', description: '' });
        setLearningPlan(prev => ({ ...prev, weeks: updatedWeeks }));
    };

    const handleAddWeek = () => {
        setLearningPlan(prev => ({
            ...prev,
            weeks: [...prev.weeks, { activities: [{ title: '', description: '' }] }]
        }));
    };
    const navigate = useNavigate();
    const handleSubmit = async () => {
        console.log("Submitted Learning Plan:", learningPlan);
        const token = localStorage.getItem('token');
        const educatorId = (JSON.parse(localStorage.getItem("educatorDetails")))._id;
        const payload = {
            ...learningPlan,
            educatorId: educatorId,
            childId: childId
        };

        const plan = await axios.post(`http://localhost:4000/ldss/educator/addlearning`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(plan);
        if (plan.data.message === "Learning plan already added for this student.") {
            toast.error("Learning plan already added for this student");
            navigate(`/educator/viewlearningplan/${childId}`);
        }
        navigate(`/educator/viewlearningplan/${childId}`);


    };

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
                    <Link to="/educator/home" style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }}>
                        All Students
                    </Link>
                    <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Learning Plan
                    </Typography>
                </Breadcrumbs>
            </Box>

            <Box display="flex" flexDirection="column" gap={3} alignItems="center" sx={{ width: "774px", mx: "auto", mt: 5 }}>
                <Typography color='primary' sx={{ fontSize: "24px", fontWeight: "500" }}>Add Learning Plan</Typography>

                {/* Goal & Plan Duration */}
                <Stack direction="row" spacing={3}>
                    <div style={textFieldStyle}>
                        <label>Goal</label>
                        <input
                            style={inputStyle}
                            name='goal'
                            value={learningPlan.goal}
                            onChange={handleInputChange}
                            type='text'
                        />
                    </div>
                    <div style={textFieldStyle}>
                        <label>Plan Duration (Weekly)</label>
                        <input
                            style={inputStyle}
                            name='planDuration'
                            value={learningPlan.planDuration}
                            onChange={handleInputChange}
                            type='text'
                        />
                    </div>
                </Stack>

                <Box sx={{ borderBottom: "1px solid black", width: "100%" }}></Box>

                {/* Weeks and Activities */}
                {learningPlan.weeks.map((week, weekIndex) => (
                    <Box key={weekIndex} display="flex" flexDirection="column" gap={2} alignItems="center">
                        <Typography color='primary' sx={{ fontSize: "18px", fontWeight: "600" }}>{`Week ${weekIndex + 1}`}</Typography>

                        {week.activities.map((activity, activityIndex) => (
                            <Grid container spacing={2} key={activityIndex}>
                                <Grid item xs={12}>
                                    <Box display="flex" gap={3} justifyContent="center">
                                        <div style={textFieldStyle}>
                                            <label>Title</label>
                                            <input
                                                style={inputStyle}
                                                name='title'
                                                value={activity.title}
                                                onChange={(e) => handleActivityChange(weekIndex, activityIndex, e)}
                                            />
                                        </div>
                                        <div style={textFieldStyle}>
                                            <label>Description</label>
                                            <input
                                                style={inputStyle}
                                                name='description'
                                                value={activity.description}
                                                onChange={(e) => handleActivityChange(weekIndex, activityIndex, e)}
                                            />
                                        </div>
                                    </Box>
                                </Grid>
                            </Grid>
                        ))}

                        <Button
                            variant='outlined'
                            color='secondary'
                            sx={{ borderRadius: "25px", mt: 2, width: '200px' }}
                            startIcon={<AddIcon />}
                            onClick={() => handleAddActivity(weekIndex)}
                        >
                            Add activity
                        </Button>

                        <Box sx={{ borderBottom: "1px solid black", width: "100%" }}></Box>
                    </Box>
                ))}

                {/* Add Week Button */}
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "100px", width: "744px", border: "1px dashed #CCCCCC" }}>
                    <Button
                        variant='outlined'
                        color='secondary'
                        sx={{ borderRadius: "25px", height: "40px", width: '200px' }}
                        startIcon={<AddIcon />}
                        onClick={handleAddWeek}
                    >
                        Add week
                    </Button>
                </Box>

                {/* Submit Button */}
                <Button
                    variant='contained'
                    color='secondary'
                    sx={{ borderRadius: "25px", height: "40px", width: '200px' }}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
        </>
    );
};

export default EducatorLearningPlan;
