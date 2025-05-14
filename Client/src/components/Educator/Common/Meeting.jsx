import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import { Box, Button, Fade, Modal, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddMeeting from './addMeeting';
import axiosInstance from '../../../Api_service/baseUrl';

const Meeting = ({ openMeeting, handleMeetingClose, childId }) => {

    const styleMeeting = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 736,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
    };
    // add meeting 
    const [addMeetingopen, setAddMeetingOpen] = React.useState(false);
    const handleAddMeetingOpen = () => {
        setAddMeetingOpen(true);
    };
    const handleAddMeetingClose = () => {
        setAddMeetingOpen(false);
    };
    const [meeting, setMeeting] = useState([]);
    const fetchChildMeeting = async () => {
        const token = localStorage.getItem("token");
        const educatorId = (JSON.parse(localStorage.getItem("educatorDetails")))._id;
        const childMeeting = await axiosInstance.get(`/educator/viewmeeting/${educatorId}/${childId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(childMeeting.data.meeting);
        setMeeting(childMeeting.data.meeting)
    };
    useEffect(() => {
        if (openMeeting && childId) {
            fetchChildMeeting();
        }
    }, [openMeeting, childId]);
    return (
        <>
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openMeeting}
                    onClose={handleMeetingClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={openMeeting}>
                        <Box sx={styleMeeting}>
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Meeting</Typography>
                                <Box display={"flex"} alignItems={"center"} gap={2}>
                                    <Button onClick={handleAddMeetingOpen} startIcon={<AddIcon />} variant='outlined' color='secondary' sx={{ borderRadius: "25px", height: "45px", width: '250px', padding: '20px 35px' }} >Add meeting</Button>
                                    <CloseIcon onClick={handleMeetingClose} sx={{ fontSize: "28px" }} />
                                </Box>

                            </Box>
                            <hr />
                            {meeting.length===0 ? 
                        (
                            <Box><Typography textAlign={'center'} variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>No meetings scheduled yet</Typography></Box>
                        )   
                        :
                        (

                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} gap={4}>
                                {meeting.map((meet, index) => {
                                    return (
       
                                        <Box key={index} width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"space-around"}>
                                            <Box display={"flex"} alignItems={"start"} justifyContent={"center"} flexDirection={"column"}>
                                                <Typography color='secondary' variant='h6' sx={{ fontSize: "12px", fontWeight: "500" }}>Meeting</Typography>
                                                <Typography color='primary' variant='h6' sx={{ fontSize: "14px", fontWeight: "500" }}>{meet.meetingTitle}</Typography>
                                            </Box>
                                            <Box display={"flex"} alignItems={"start"} justifyContent={"center"} flexDirection={"column"}>
                                                <Typography color='secondary' variant='h6' sx={{ fontSize: "12px", fontWeight: "500" }}>Date</Typography>
                                                <Typography color='primary' variant='h6' sx={{ fontSize: "14px", fontWeight: "500" }}>{new Date(meet.date).toISOString().split('T')[0]}</Typography>
                                            </Box>
                                            <Box display={"flex"} alignItems={"start"} justifyContent={"center"} flexDirection={"column"}>
                                                <Typography color='secondary' variant='h6' sx={{ fontSize: "12px", fontWeight: "500" }}>Time</Typography>
                                                <Typography color='primary' variant='h6' sx={{ fontSize: "14px", fontWeight: "500" }}>{meet.startTime} - {meet.endTime}</Typography>
                                            </Box>

                                            <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", height: "45px", width: '150px', padding: '10px 35px', fontSize: "14px", fontWeight: "500" }}>Meeting</Button>

                                        </Box>
                                    )
                                })}

                            </Box>
                        ) 
                        }

                        </Box>
                    </Fade>
                </Modal>
            </div>
            {/*  */}
            <AddMeeting handleAddMeetingOpen={handleAddMeetingOpen} addMeetingopen={addMeetingopen} handleAddMeetingClose={handleAddMeetingClose} childId={childId} fetchChildMeeting={fetchChildMeeting} />
        </>
    )
}

export default Meeting
