import React, { useEffect, useState } from 'react'
import EducatorNavbar from '../Navbar/EducatorNavbar'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import EducatorChatSideBar from './Common/EducatorChatSideBar';
import { Box, Typography } from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatIcon from '@mui/icons-material/Chat';

const EducatorChat = () => {
    const [educator, setEducator] = useState("");
    const fetchEducator = async () => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const educator = await axios.get(`http://localhost:4000/ldss/educator/geteducator/${decoded.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const educatorsDetails = localStorage.setItem("educatorDetails",
            JSON.stringify(educator.data.educator));
        setEducator(educator.data.educator);
        console.log(educator);

    }
    useEffect(() => {
        fetchEducator();
    }, []);

    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/educator/profile');
    }
    return (
        <>
            <EducatorNavbar educatorDetails={educator} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: '#F6F7F9', width: "100%", height: "100%" }} display={'flex'} alignItems={'start'}>
                <Box flexBasis={'15%'}>
                    <EducatorChatSideBar />
                </Box>
                <Box flexBasis={'85%'} display={'flex'} alignItems={'center'} justifyContent={'center'} height={"100%"}>
                    <Box
                        sx={{
                            backgroundColor: "white",
                            padding: "10px",
                            margin: "15px",
                            borderRadius: "12px",
                            width: "100%",
                            height: "111vh",
                            
                        }}
                        display={'flex'}
                        alignItems={'center'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        gap={5}
                    >

                        <Typography sx={{ color: 'black', fontSize: '18px', fontWeight: "500" }}>Welcome <WavingHandIcon sx={{ color: "gold" }} /> {educator.name} <AutoAwesomeIcon sx={{ color: "gold" }} /></Typography>
                        <Typography sx={{ color: 'black', fontSize: '18px', fontWeight: "500" }}>Select a chat to start messaging </Typography>
                        <Typography sx={{ color: 'black', fontSize: '18px', fontWeight: "500" }}><ChatIcon /> </Typography>
                    </Box>


                </Box>
            </Box>

        </>
    )
}

export default EducatorChat
