import React, { useEffect, useState } from 'react'
import ParentNavbar from '../Navbar/ParentNavbar'
import { Link, useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Grid, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import image68 from "../../assets/image 68.png";
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';

const ParentAllEducator = () => {
    const [parentdetails, setParentdetails] = useState({});
    useEffect(() => {

        const parentdetails = localStorage.getItem("parentdetails");
        setParentdetails(JSON.parse(parentdetails));
    }, []);
    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/parent/profile');
    }
    return (
        <>
            <ParentNavbar parentdetails={parentdetails} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: "white" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Educator</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ marginTop: "20px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/parent/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Child</Typography>
                    </Breadcrumbs>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={3}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                            <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                            <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                        </Box>
                    </Box>
                </Box>

                {/* all educators */}
                <Grid container spacing={2} sx={{ p: "20px 50px" }}>
                    <Grid item xs={12} sm={6} md={4} width={"32%"}>
                        <Card sx={{ width: "100%", height: "197px", borderRadius: "20px", padding: "20px" }}>
                            <CardActionArea>
                                <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: "157px" }}>
                                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" sx={{ height: "150px", gap: "10px" }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ height: "150px", width: '150px', borderRadius: "10px", flexShrink: 0 }}
                                            image={image68}
                                            alt="Profile"
                                        />
                                        <CardContent
                                            sx={{
                                                height: "150px",
                                                overflow: "hidden",
                                                padding: "10px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="h6" color='primary'>
                                                    Name
                                                </Typography>
                                                <Typography sx={{ color: '#7F7F7F', fontSize: "13px", fontWeight: "500" }}>
                                                    Qualification
                                                </Typography>
                                                <Box><StarOutlineOutlinedIcon fontSize="small" /></Box>
                                            </Box>

                                            <Box sx={{ borderBottom: "1px solid black" }} />

                                            <Box>
                                                <Typography sx={{ color: '#7F7F7F', fontSize: "12px", fontWeight: "500" }}>
                                                    3+ years Experience
                                                </Typography>
                                                <Typography sx={{ color: '#7F7F7F', fontSize: "12px", fontWeight: "500" }}>
                                                    Monday to Friday, 10 AM – 6 PM
                                                </Typography>
                                                <Box><Link>View all</Link></Box>
                                            </Box>
                                        </CardContent>
                                    </Box>
                                </Box>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} width={"32%"} >
                        <Card sx={{ width: "100%", height: "197px", borderRadius: "20px", padding: "20px" }}>
                            <CardActionArea>
                                <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: "157px" }}>
                                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" sx={{ height: "150px", gap: "10px" }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ height: "150px", width: '150px', borderRadius: "10px", flexShrink: 0 }}
                                            image={image68}
                                            alt="Profile"
                                        />
                                        <CardContent
                                            sx={{
                                                height: "150px",
                                                overflow: "hidden",
                                                padding: "10px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="h6" color='primary'>
                                                    Name
                                                </Typography>
                                                <Typography sx={{ color: '#7F7F7F', fontSize: "13px", fontWeight: "500" }}>
                                                    Qualification
                                                </Typography>
                                                <Box><StarOutlineOutlinedIcon fontSize="small" /></Box>
                                            </Box>

                                            <Box sx={{ borderBottom: "1px solid black" }} />

                                            <Box>
                                                <Typography sx={{ color: '#7F7F7F', fontSize: "12px", fontWeight: "500" }}>
                                                    3+ years Experience
                                                </Typography>
                                                <Typography sx={{ color: '#7F7F7F', fontSize: "12px", fontWeight: "500" }}>
                                                    Monday to Friday, 10 AM – 6 PM
                                                </Typography>
                                                <Box><Link>View all</Link></Box>
                                            </Box>
                                        </CardContent>
                                    </Box>
                                </Box>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} width={"32%"} >
                        <Card sx={{ width: "100%", height: "197px", borderRadius: "20px", padding: "20px" }}>
                            <CardActionArea>
                                <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: "157px" }}>
                                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" sx={{ height: "150px", gap: "10px" }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ height: "150px", width: '150px', borderRadius: "10px", flexShrink: 0 }}
                                            image={image68}
                                            alt="Profile"
                                        />
                                        <CardContent
                                            sx={{
                                                height: "150px",
                                                overflow: "hidden",
                                                padding: "10px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="h6" color='primary'>
                                                    Name
                                                </Typography>
                                                <Typography sx={{ color: '#7F7F7F', fontSize: "13px", fontWeight: "500" }}>
                                                    Qualification
                                                </Typography>
                                                <Box><StarOutlineOutlinedIcon fontSize="small" /></Box>
                                            </Box>

                                            <Box sx={{ borderBottom: "1px solid black" }} />

                                            <Box>
                                                <Typography sx={{ color: '#7F7F7F', fontSize: "12px", fontWeight: "500" }}>
                                                    3+ years Experience
                                                </Typography>
                                                <Typography sx={{ color: '#7F7F7F', fontSize: "12px", fontWeight: "500" }}>
                                                    Monday to Friday, 10 AM – 6 PM
                                                </Typography>
                                                <Box><Link>View all</Link></Box>
                                            </Box>
                                        </CardContent>
                                    </Box>
                                </Box>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    
                </Grid>

            </Box>


        </>
    )
}

export default ParentAllEducator
