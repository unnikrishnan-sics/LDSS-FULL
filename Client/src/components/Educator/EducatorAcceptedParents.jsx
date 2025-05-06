import React, { useEffect, useState } from 'react'
import EducatorNavbar from '../Navbar/EducatorNavbar'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Card, CardActionArea, CardContent, CardMedia, Fade, Grid, Modal, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import image68 from "../../assets/image 68.png";
import Backdrop from '@mui/material/Backdrop';
import EducatorViewParentDetails from './Common/EducatorViewParentDetails';

const EducatorAcceptedParents = () => {
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
        fetchParentsRequest();

    }, []);

    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/educator/profile');
    };

    const [parentRequest, setParentRequest] = useState([]);
    const fetchParentsRequest = async () => {
        const token = localStorage.getItem("token");
        const educatorId = JSON.parse(localStorage.getItem("educatorDetails"))._id;
        const request = await axios.get(`http://localhost:4000/ldss/educator/parentsrequest/${educatorId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setParentRequest(request.data.request);
        console.log(request.data.request);


    };

    // model
    const [requestDetail, setRequestDetail] = useState({});
    const [openParent, setOpenParent] = useState(false);
    const handleParentOpen = () => setOpenParent(true);
    const handleParentClose = () => setOpenParent(false);
    const fetchParentByRequestId=async(requestId)=>{
        const token=localStorage.getItem("token");
        const parent=await axios.get(`http://localhost:4000/ldss/educator/viewrequestedparent/${requestId}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        console.log(parent);
        setRequestDetail(parent.data.viewRequest);
        handleParentOpen();
    }
    return (
        <>
            <EducatorNavbar educatorDetails={educator} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: "white", width: "100vw" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Parents</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"start"} sx={{ mt: "30px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/educator/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>All Students</Typography>
                    </Breadcrumbs>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                        <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                        <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                    </Box>
                </Box>
                {/* parents list */}
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ width: "100vw", overflowX: "hidden" }}>
                    <Grid display={"flex"} justifyContent={"center"} container spacing={3} sx={{ marginTop: "50px", width: "100vw", p: "0" }}>
                        {parentRequest.filter(request=>request.status==="accepted").length===0 ? 
                    (<Typography sx={{fontSize:"32px"}} color='primary'>No parents accepted till</Typography>)
                    :
                    (parentRequest.filter(request => request.status === "accepted")
                    .map((request, index) => (   
                        <Grid item xs={12} sm={12} md={4} key={index}>
                            <Card sx={{ width: "100%", height: "197px", borderRadius: "20px", padding: "20px" }}>
                                <CardActionArea>
                                    <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: "157px" }}>
                                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" sx={{ height: "150px", gap: "10px" }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ height: "150px", width: '150px', borderRadius: "10px", flexShrink: 0 }}
                                                image={`http://localhost:4000/uploads/${request.parentId.profilePic.filename}`}
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
                                                <Box display={"flex"} flexDirection={"column"} gap={2}>
                                                    <Typography variant="h6" color='primary'>
                                                        {request.parentId.name}
                                                    </Typography>
                                                    <Typography sx={{ color: '#7F7F7F', fontSize: "13px", fontWeight: "500" }}>
                                                        {request.parentId.address}
                                                    </Typography>
                                                    <Typography sx={{ color: '#7F7F7F', fontSize: "13px", fontWeight: "500" }}>
                                                        {request.parentId.phone}
                                                    </Typography>
                                                    <Typography onClick={()=>fetchParentByRequestId(request._id)}>View all</Typography>
                                                </Box>
                                            </CardContent>
                                        </Box>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))) 
                    }
                        
                    </Grid>
                </Box>
                <Modal
                    open={openParent}
                    onClose={handleParentClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={openParent}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: "900px",
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            height: "700px",
                            width:"1080px",
                            overflowY:"scroll"
                        }}>
                            <EducatorViewParentDetails handleParentClose={handleParentClose} requestDetail={requestDetail}/>
                        </Box>
                    </Fade>
                </Modal>
            </Box>

        </>
    )
}

export default EducatorAcceptedParents
