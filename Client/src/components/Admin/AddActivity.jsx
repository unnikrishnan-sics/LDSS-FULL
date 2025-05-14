import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import AdminSideBar from './Common/AdminSideBar'
import LogoutIcon from '@mui/icons-material/Logout';

const AddActivity = () => {
    const textFieldStyle = { height: "65px", width: "360px", display: "flex", flexDirection: "column", justifyContent: "start", position: "relative" };
    // logout
    const [openLogout, setOpenLogout] = useState(false);
    const handleOpenLogout = () => setOpenLogout(true);
    const handleCloseLogout = () => setOpenLogout(false);
    return (
        <>
            <Box display={"flex"} sx={{ background: "#F6F7F9", p: "30px", height: "100%", width: "100%" }}>

                <AdminSideBar />

                {/* Content (right part) */}
                <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "start", padding: "0px 15px", borderRadius: "8px", flexGrow: 1 }}>
                    <Box sx={{ height: "70px", background: "white", borderRadius: "8px", width: "100%" }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500", ml: "30px" }} color='primary'>Add Activity </Typography>
                        <Button onClick={handleOpenLogout} variant="text" color='primary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} sx={{ mt: "20px", height: "394px", background: "white", borderRadius: "8px", width: "100%" ,p:"30px",gap:"15px"}}>
                        <Typography variant='h3' sx={{ fontSize: "18px", fontWeight: "600" }} color='primary'>Add Job </Typography>
                        {/* input */}
                        <Box mt={4} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={3}>
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
                                <div style={textFieldStyle}>
                                    <label>Activity name</label>
                                    <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                        // onChange={handleOnchange}
                                        name='meetingTitle'
                                        // value={data.meetingTitle}
                                        type='text'

                                    />

                                </div>
                                <div style={textFieldStyle}>
                                    <label>Photo</label>
                                    <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px'}}
                                        // onChange={handleOnchange}
                                        name='meetingTitle'
                                        // value={data.meetingTitle}
                                        type='file'

                                    />

                                </div>
                            </Box>
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
                                <div style={textFieldStyle}>
                                    <label>Description</label>
                                    <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                        // onChange={handleOnchange}
                                        name='meetingTitle'
                                        // value={data.meetingTitle}
                                        type='text'

                                    />

                                </div>
                                <div style={textFieldStyle}>
                                    <label>Activity Category</label>
                                    <input style={{ height: "40px", borderRadius: "8px", border: " 1px solid #CCCCCC", padding: '8px' }}
                                        // onChange={handleOnchange}
                                        name='meetingTitle'
                                        // value={data.meetingTitle}
                                        type='text'

                                    />

                                </div>
                            </Box>
                        </Box>
                        <Button variant='contained' color='secondary' sx={{mt:"20px", borderRadius: "25px", height: "45px", width: '150px', padding: '20px 35px' }} >Submit</Button>





                    </Box>
                </Box>
            </Box>

        </>
    )
}

export default AddActivity
