import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../../Api_service/baseUrl';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddMeeting = ({ handleAddMeetingClose, addMeetingopen, fetchAllMeetings, childId }) => {
    const navigate = useNavigate();
    
    const textFieldStyle = { 
        height: "65px", 
        width: "360px", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "start", 
        position: "relative" 
    };
    
    const styleAddMeeting = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 550,
        bgcolor: 'background.paper',
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
    };

    const [data, setData] = useState({
        meetingTitle: "",
        date: "",
        startTime: "",
        endTime: "",
        meetLink: "",
        creatorType: "educator",
    });

    const [errors, setErrors] = useState({
        meetingTitle: "",
        date: "",
        startTime: "",
        endTime: "",
        meetLink: "",
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            meetingTitle: "",
            date: "",
            startTime: "",
            endTime: "",
            meetLink: "",
        };

        // Validate meeting title
        if (!data.meetingTitle.trim()) {
            newErrors.meetingTitle = "Meeting title is required";
            valid = false;
        } else if (data.meetingTitle.length > 100) {
            newErrors.meetingTitle = "Title must be less than 100 characters";
            valid = false;
        }

        // Validate date
        if (!data.date) {
            newErrors.date = "Date is required";
            valid = false;
        } else {
            const selectedDate = new Date(data.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                newErrors.date = "Date cannot be in the past";
                valid = false;
            }
        }

        // Validate times
        if (!data.startTime) {
            newErrors.startTime = "Start time is required";
            valid = false;
        }
        
        if (!data.endTime) {
            newErrors.endTime = "End time is required";
            valid = false;
        } else if (data.startTime && data.endTime <= data.startTime) {
            newErrors.endTime = "End time must be after start time";
            valid = false;
        }

        // Validate meet link
        if (!data.meetLink) {
            newErrors.meetLink = "Meeting link is required";
            valid = false;
        } else if (!isValidUrl(data.meetLink)) {
            newErrors.meetLink = "Please enter a valid URL";
            valid = false;
        } else if (!data.meetLink.includes('meet.google.com')) {
            newErrors.meetLink = "Please enter a valid Google Meet link";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setData(prev => {
            return { ...prev, [name]: value }
        });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const token = localStorage.getItem("token");
        const educatorId = JSON.parse(localStorage.getItem("educatorDetails"))?._id;
        
        if (!educatorId || !childId) {
            toast.error("Missing required parameters");
            return;
        }

        try {
            const response = await axiosInstance.post(`/educator/addmeeting/${educatorId}/${childId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.message === "Meeting added successfully") {
                setData({
                    meetingTitle: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                    meetLink: "",
                    creatorType: "educator"
                });
                handleAddMeetingClose();
                fetchAllMeetings();
                navigate('/educator/allstudents');
                toast.success("Meeting created successfully");
            } else {
                console.log(response.data.message || "Error creating meeting");
            }
        } catch (error) {
            console.error("Meeting creation error:", error);
            toast.error(error.response?.data?.message || "Error creating meeting");
        }
    }

    // Get today's date in YYYY-MM-DD format for the date input min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal
            open={addMeetingopen}
            onClose={handleAddMeetingClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={styleAddMeeting} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Box display={"flex"} width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Add New Meeting</Typography>
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                        <CloseIcon onClick={handleAddMeetingClose} sx={{ fontSize: "28px", cursor: "pointer" }} />
                    </Box>
                </Box>
                <hr />
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={3}>
                    <Box>
                        <div style={textFieldStyle}>
                            <label>Meeting title</label>
                            <input 
                                style={{ 
                                    height: "40px", 
                                    borderRadius: "8px", 
                                    border: errors.meetingTitle ? "1px solid red" : "1px solid #CCCCCC", 
                                    padding: '8px' 
                                }}
                                onChange={handleOnchange}
                                name='meetingTitle'
                                value={data.meetingTitle}
                                type='text'
                                maxLength={100}
                            />
                            {errors.meetingTitle && (
                                <Typography color="error" variant="caption" sx={{ fontSize: "12px" }}>
                                    {errors.meetingTitle}
                                </Typography>
                            )}
                        </div>
                    </Box>
                    <Box>
                        <div style={textFieldStyle}>
                            <label>Date</label>
                            <input 
                                style={{ 
                                    height: "40px", 
                                    borderRadius: "8px", 
                                    border: errors.date ? "1px solid red" : "1px solid #CCCCCC", 
                                    padding: '8px' 
                                }}
                                onChange={handleOnchange}
                                name='date'
                                value={data.date}
                                type='date'
                                min={today}
                            />
                            {errors.date && (
                                <Typography color="error" variant="caption" sx={{ fontSize: "12px" }}>
                                    {errors.date}
                                </Typography>
                            )}
                        </div>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
                        <div style={{ height: "65px", width: "170px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }}>
                            <label>Start time</label>
                            <input 
                                style={{ 
                                    height: "40px", 
                                    borderRadius: "8px", 
                                    border: errors.startTime ? "1px solid red" : "1px solid #CCCCCC", 
                                    padding: '8px' 
                                }}
                                onChange={handleOnchange}
                                name='startTime'
                                value={data.startTime}
                                type='time'
                            />
                            {errors.startTime && (
                                <Typography color="error" variant="caption" sx={{ fontSize: "12px" }}>
                                    {errors.startTime}
                                </Typography>
                            )}
                        </div>
                        <div style={{ height: "65px", width: "170px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }}>
                            <label>End time</label>
                            <input 
                                style={{ 
                                    height: "40px", 
                                    borderRadius: "8px", 
                                    border: errors.endTime ? "1px solid red" : "1px solid #CCCCCC", 
                                    padding: '8px' 
                                }}
                                onChange={handleOnchange}
                                name='endTime'
                                value={data.endTime}
                                type='time'
                            />
                            {errors.endTime && (
                                <Typography color="error" variant="caption" sx={{ fontSize: "12px" }}>
                                    {errors.endTime}
                                </Typography>
                            )}
                        </div>
                    </Box>
                    <Box>
                        <div style={textFieldStyle}>
                            <label>Google Meet Link</label>
                            <input 
                                style={{ 
                                    height: "40px", 
                                    borderRadius: "8px", 
                                    border: errors.meetLink ? "1px solid red" : "1px solid #CCCCCC", 
                                    padding: '8px' 
                                }}
                                onChange={handleOnchange}
                                name='meetLink'
                                value={data.meetLink}
                                type='url'
                                placeholder="https://meet.google.com/..."
                            />
                            {errors.meetLink && (
                                <Typography color="error" variant="caption" sx={{ fontSize: "12px" }}>
                                    {errors.meetLink}
                                </Typography>
                            )}
                        </div>
                    </Box>
                </Box>
                <hr />
                <Button 
                    onClick={handleSubmit} 
                    variant='contained' 
                    color='secondary' 
                    sx={{ 
                        borderRadius: "25px", 
                        height: "45px", 
                        width: '150px', 
                        padding: '20px 35px',
                        mt: 2
                    }}
                >
                    Submit
                </Button>
            </Box>
        </Modal>
    )
}

export default AddMeeting;