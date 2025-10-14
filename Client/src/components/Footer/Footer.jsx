// src/components/Footer.js

import { Container, Stack, Box, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom installed
import logo from "../../assets/logo2.png";

// Reusable style for links to remove underlines and set color
const linkStyle = {
    textDecoration: 'none',
    color: 'white'
};

const Footer = ({ userRole = '' }) => { // Accept userRole prop, default to empty string

    // Dynamically build the base path. If a role is passed, it will be '/parent', '/educator', etc.
    // If no role is passed, it will be an empty string.
    const basePath = userRole ? `/${userRole}` : '';

    // Construct the full paths for the links
    const homePath = `${basePath}/home`;
    const aboutPath = `${basePath}/about`;
    const contactPath = `${basePath}/contact`;

    return (
        <>
            <Container maxWidth={false} disableGutters sx={{ backgroundColor: "#293460", margin:0, padding:0, height:"auto" }}>
                <Stack sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginTop: '40px' }}>
                    {/* Left side with logo and text (no changes here) */}
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: 'start', alignItems: "flex-start", marginTop: '10px', marginLeft: "50px" }}>
                        <Box sx={{ width: "372px", height: "115px", display: "flex", justifyContent: "flex-start", alignItems: 'center' }}>
                            <Box component="img" src={logo} alt='logo'></Box>
                            <Typography sx={{ fontSize: "33px", fontWeight: "600", color: "white" }}>LearnHub</Typography>
                        </Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", color: "white" }}>Start your journey to success by exploring learning </Typography>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", color: "white" }}>with top educator & therapist today!</Typography>
                    </Box>

                    {/* Right side with dynamic links */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: '50px', marginTop: "50px" }}>
                        <Link to={homePath} style={linkStyle}>
                            <Typography variant='p' sx={{ color: "white", marginTop: "20px", '&:hover': { textDecoration: 'underline' } }}>
                                Home
                            </Typography>
                        </Link>
                        <Link to={aboutPath} style={linkStyle}>
                            <Typography variant='p' sx={{ color: "white", marginTop: "20px", '&:hover': { textDecoration: 'underline' } }}>
                                About
                            </Typography>
                        </Link>
                        <Link to={contactPath} style={linkStyle}>
                            <Typography variant='p' sx={{ color: "white", marginTop: "20px", '&:hover': { textDecoration: 'underline' } }}>
                                Contact
                            </Typography>
                        </Link>
                    </Box>
                </Stack>
                <Box sx={{ borderBottom: "1px solid white", marginLeft:"auto", marginRight:"auto", width:"95%", marginTop: "20px" }}></Box>
                {/* Bottom section (no changes here) */}
                <Stack sx={{ display: "flex", flexDirection: "row", justifyContent:"space-between", paddingTop:"20px", paddingLeft:"50px", paddingBottom:"20px" }}>
                    <Box>
                        <Typography sx={{ color: 'white', fontSize: "14px", fontWeight: "500" }}>Copy right @2024. All rights reserved</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", marginLeft:"50px", paddingRight:"50px", gap:"20px" }}>
                        <Typography sx={{ color: 'white', fontSize: "14px", fontWeight: "500" }}>Terms of conditions</Typography>
                        <Typography sx={{ color: 'white', fontSize: "14px", fontWeight: "500" }}>F & Q</Typography>
                        <Typography sx={{ color: 'white', fontSize: "14px", fontWeight: "500" }}>Privacy policy</Typography>
                    </Box>
                </Stack>
            </Container>
        </>
    )
}

export default Footer;