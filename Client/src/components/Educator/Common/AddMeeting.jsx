import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axiosInstance from '../../../Api_service/baseUrl';
import { toast } from 'react-toastify';

const AddMeeting = ({ handleAddMeetingClose, addMeetingopen, handleAddMeetingOpen,childId,fetchChildMeeting }) => {
    
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };
    const styleAddMeeting = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 478,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        borderRadius: "10px",
        boxShadow: 24,
        p: 4,
    };

    const [data, setData] = useState({
        meetingTitle: "",
        date: "",
        startTime: "",
        endTime: "",
        creatorType: "educator",

    })
    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setData(prev => {
            return { ...prev, [name]: value }
        })

    };
    const [meeting, setMeeting] = useState({});
    const handleSubmit = async (e) => {
        const token = localStorage.getItem("token");
        const educatorId = (JSON.parse(localStorage.getItem("educatorDetails")))._id;

        e.preventDefault();
        console.log(data);

        const newMeeting = await axiosInstance.post(`/educator/addmeeting/${educatorId}/${childId}`, data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        console.log(newMeeting.data);
        setMeeting(newMeeting.data);

        if (newMeeting.data.message === "meeting added successfully") {
            toast.success("Meeting created");
            setData({
                meetingTitle: "",
                date: "",
                startTime: "",
                endTime: "",
                creatorType: "educator"
            })
            handleAddMeetingClose();
            fetchChildMeeting();
        };
        

    }

    return (
        <>
            <Modal
                open={addMeetingopen}
                onClose={handleAddMeetingClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={styleAddMeeting} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <Box display={"flex"} width={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Meeting</Typography>
                        <Box display={"flex"} alignItems={"center"} gap={2}>

                            <CloseIcon onClick={handleAddMeetingClose} sx={{ fontSize: "28px" }} />
                        </Box>

                    </Box>
                    <hr />
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={3}>
                        <Box>
                            <div style={textFieldStyle}>
                                <label>Meeting title</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleOnchange}
                                    name='meetingTitle'
                                    value={data.meetingTitle}
                                    type='text'

                                />

                            </div>
                        </Box>
                        <Box>
                            <div style={textFieldStyle}>
                                <label>Date</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleOnchange}
                                    name='date'
                                    value={data.date}
                                    type='date'

                                />

                            </div>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
                            <div style={{ height: "65px", width: "170px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }}>
                                <label>Start time</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleOnchange}
                                    name='startTime'
                                    value={data.startTime}
                                    type='number'

                                />
                                <AccessTimeIcon
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '70%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                />

                            </div>
                            <div style={{ height: "65px", width: "170px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" }}>
                                <label>End time</label>
                                <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                    onChange={handleOnchange}
                                    name='endTime'
                                    value={data.endTime}
                                    type='number'

                                />
                                <AccessTimeIcon
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '70%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                />

                            </div>
                        </Box>

                    </Box>
                    <hr />
                    <Button onClick={handleSubmit} variant='contained' color='secondary' sx={{ borderRadius: "25px", height: "45px", width: '150px', padding: '20px 35px' }} >Submit</Button>

                </Box>
            </Modal>

        </>
    )
}

export default AddMeeting
