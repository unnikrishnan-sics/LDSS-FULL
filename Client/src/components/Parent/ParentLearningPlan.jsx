import React, { useEffect, useState } from 'react'
import ParentNavbar from '../Navbar/ParentNavbar'
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Avatar, Box, Breadcrumbs, Button, Card, Fade, Grid, Modal, Rating, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import WcIcon from '@mui/icons-material/Wc';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import Ratings from './Common/Ratings';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode to get parentId

const ParentLearningPlan = () => {
    const [parentdetails, setParentdetails] = useState({});
    const navigate = useNavigate();
    // The useLocation hook is not strictly needed for the functionality requested here,
    // but it's good to keep in mind for reading state if needed later.
    // const location = useLocation(); 

    useEffect(() => {
        const fetchParentDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate('/login'); // Redirect to login if token is missing
                return;
            }
            try {
                const decoded = jwtDecode(token);
                const parentId = decoded.id;
                const response = await axios.get(`http://localhost:4000/ldss/parent/getparent/${parentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data?.parent) {
                    setParentdetails(response.data.parent);
                    localStorage.setItem("parentdetails", JSON.stringify(response.data.parent));
                }
            } catch (error) {
                console.error("Error fetching parent details:", error);
                // Handle error (e.g., show message, redirect)
            }
        };

        fetchParentDetails();
    }, [navigate]);

    const navigateToProfile = () => {
        navigate('/parent/profile');
    };

    // State for ratings modal
    const [ratingState, setRatingState] = useState({
        open: false,
        childId: null,
        professionalType: null, // 'educator' or 'therapist'
        currentRating: 0
    });

    const handleRatingOpen = (childId, professionalType) => {
        setRatingState({
            open: true,
            childId,
            professionalType,
            currentRating: 0
        });
    };

    const handleRatingClose = () => {
        setRatingState(prev => ({ ...prev, open: false }));
    };

    const handleRatingSubmit = (rating) => {
        console.log(`Rating submitted for ${ratingState.professionalType} of child ${ratingState.childId}:`, rating);
        handleRatingClose();
    };

    // fetch all child of parent
    const [allchild, setAllChild] = useState([]);
    const [educators, setEducators] = useState({}); // {childId: educatorDetails}
    const [therapists, setTherapists] = useState({}); // {childId: therapistDetails}

    const fetchAllChildOfParent = async () => {
        const token = localStorage.getItem("token");
        const parentId = parentdetails._id; // Use state variable for parentId

        if (!parentId) return; // Don't fetch if parentId is not yet available

        try {
            // Fetch all children
            const allChildRes = await axios.get(`http://localhost:4000/ldss/parent/getallchildofparent/${parentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAllChild(allChildRes.data.child);

            // Fetch educators for parent
            try {
                const educatorRes = await axios.get(`http://localhost:4000/ldss/parent/getacceptededucator/${parentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const educatorsData = {};
                if (educatorRes.data && educatorRes.data.acceptedEducators && educatorRes.data.acceptedEducators.length > 0) {
                    // Assuming a child might be linked to a single educator for chat purposes.
                    // If multiple educators can be linked per child, this logic needs refinement.
                    allChildRes.data.child.forEach(child => {
                        // Find the specific educator if available, or just take the first one
                        const linkedEducator = educatorRes.data.acceptedEducators.find(
                            req => req.recipientRole === 'educator' && req.parentId?._id === parentId
                        )?.recipientId || educatorRes.data.acceptedEducators[0]?.recipientId; // Fallback to first if no specific link
                        if (linkedEducator) {
                            educatorsData[child._id] = linkedEducator;
                        }
                    });
                }
                setEducators(educatorsData);
            } catch (error) {
                console.error(`Error fetching educator:`, error);
            }

            // Fetch therapists for parent
            try {
                const therapistRes = await axios.get(`http://localhost:4000/ldss/parent/getacceptedtherapist/${parentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const therapistsData = {};
                if (therapistRes.data && therapistRes.data.acceptedTherapists && therapistRes.data.acceptedTherapists.length > 0) {
                    // Similar logic for therapists
                    allChildRes.data.child.forEach(child => {
                        const linkedTherapist = therapistRes.data.acceptedTherapists.find(
                            req => req.recipientRole === 'theraphist' && req.parentId?._id === parentId
                        )?.recipientId || therapistRes.data.acceptedTherapists[0]?.recipientId;
                        if (linkedTherapist) {
                            therapistsData[child._id] = linkedTherapist;
                        }
                    });
                }
                setTherapists(therapistsData);
            } catch (error) {
                console.error(`Error fetching therapist:`, error);
            }

        } catch (error) {
            console.error("Error fetching children:", error);
        }
    };

    // Trigger fetchAllChildOfParent when parentdetails._id is available
    useEffect(() => {
        if (parentdetails._id) {
            fetchAllChildOfParent();
        }
    }, [parentdetails._id]);


    // Function to format date as dd-mm-yyyy
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <ParentNavbar parentdetails={parentdetails} navigateToProfile={navigateToProfile} />
            <Box sx={{ background: "white" }}>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ height: "46px", background: "#DBE8FA" }}>
                    <Typography color='primary' textAlign={"center"} sx={{ fontSize: "18px", fontWeight: "600" }}>Learning</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ marginTop: "20px", ml: "50px", mr: "50px" }}>
                    <Breadcrumbs aria-label="breadcrumb" separator="›">
                        <Link style={{ fontSize: "12px", fontWeight: "500", color: "#7F7F7F", textDecoration: "none" }} underline="hover" to="/parent/home">
                            Home
                        </Link>
                        <Typography color='primary' sx={{ fontSize: "12px", fontWeight: "500" }}>Learning</Typography>
                    </Breadcrumbs>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={3}>
                        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                            <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                            <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                        </Box>
                    </Box>
                </Box>

                <Grid sx={{ pt: "10px", pl: "50px", pr: "50px", width: "100%" }} container spacing={2}>
                    {allchild.map((child, index) => {
                        const educator = educators[child._id]; // Get specific educator for this child
                        const therapist = therapists[child._id]; // Get specific therapist for this child

                        return (
                            <Grid key={index} item xs={12} md={6} width={"49%"} sx={{ height: "470px" }}>
                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"} sx={{ p: "20px 30px", height: "90%", background: "#F6F7F9", borderRadius: "25px", gap: "20px", width: "100%" }}>
                                    <Box width={"100%"} display={"flex"} gap={5} justifyContent={"space-between"} alignItems={"center"}>
                                        <Typography sx={{ fontSize: "32px", fontWeight: "600" }} color='primary'>{child.name}</Typography>
                                        <Box display={"flex"} alignItems={"center"} sx={{ gap: "20px" }}>
                                            {/* Educator Chat Button */}
                                            <Button
                                                startIcon={<ChatIcon />}
                                                variant='outlined'
                                                color='secondary'
                                                sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '150px', padding: '10px 35px', fontSize: "14px", fontWeight: "500" }}
                                                onClick={() => educator && navigate(`/parent/chat/${educator._id}`, {
                                                    state: {
                                                        userType: 'educator',
                                                        studentName: child.name, // Pass the child's name
                                                        studentId: child._id // Pass the child's ID
                                                    }
                                                })}
                                                disabled={!educator} // Disable if no educator is linked
                                            >
                                                Educator
                                            </Button>
                                            {/* Therapist Chat Button */}
                                            <Button
                                                startIcon={<ChatIcon />}
                                                variant='outlined'
                                                color='secondary'
                                                sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '150px', padding: '10px 15px', fontSize: "14px", fontWeight: "500", letterSpacing: "0%" }}
                                                onClick={() => therapist && navigate(`/parent/chat/${therapist._id}`, {
                                                    state: {
                                                        userType: 'theraphist',
                                                        studentName: child.name, // Pass the child's name
                                                        studentId: child._id // Pass the child's ID
                                                    }
                                                })}
                                                disabled={!therapist} // Disable if no therapist is linked
                                            >
                                                Therapist
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
                                        <Box sx={{ gap: "20px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                                <Box sx={{ color: "#1967D2" }}><DateRangeIcon /></Box>
                                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                                    <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Date of Birth</Typography>
                                                    <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{formatDate(child.dateOfBirth)}</Typography>
                                                </Box>
                                            </Box>
                                            <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px" }}>
                                                <Box sx={{ color: "#1967D2" }}><ApartmentOutlinedIcon /></Box>
                                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                                    <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>School Name</Typography>
                                                    <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{child.schoolName}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box sx={{ gap: "20px", pr: "250px" }} display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                            <Box display={"flex"} alignItems={"center"} sx={{ gap: "15px", pl: "50px" }}>
                                                <Box sx={{ color: "#1967D2" }}><WcIcon /></Box>
                                                <Box display={"flex"} flexDirection={"column"} alignItems={"start"}>
                                                    <Typography variant='p' color='secondary' sx={{ fontSize: "12px", fontWeight: "500" }}>Gender</Typography>
                                                    <Typography variant='h5' color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>{child.gender}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ border: "1px solid #CCCCCC", borderRadius: "12px" }} height={"176px"} width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                        {/* Educator Section */}
                                        <Box display={'flex'} flexDirection={'column'} width={"100%"} p={3}>
                                            <Box width={"100%"} display={'flex'} alignItems={'center'} justifyContent={'space-around'}>
                                                <Typography variant='p' color='secondary' sx={{ fontSize: "18px", fontWeight: "600", mt: "10px" }}>
                                                    {educator ? `${educator.name}` : 'Educator'}
                                                </Typography>
                                                {/* <Button
                                                    onClick={() => handleRatingOpen(child._id, 'educator')}
                                                    startIcon={<AddIcon />}
                                                    variant='outlined'
                                                    color='secondary'
                                                    sx={{ borderRadius: "25px", marginTop: "20px", height: "25px", width: '118px', padding: '15px 25px', fontSize: "14px", fontWeight: "500" }}
                                                >
                                                    Rating
                                                </Button> */}
                                            </Box>
                                            <Typography variant='p' color='primary' sx={{ fontSize: "14px" }}>Complete Learning plan</Typography>
                                            <Link to={educator ? `/parent/educatorlearningplan/${educator._id}/${child._id}` : '#'}>
                                                <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '227px', padding: '10px 35px', fontSize: "14px", fontWeight: "500" }}>Learning plan</Button>
                                            </Link>
                                        </Box>

                                        <Divider orientation="vertical" variant="middle" flexItem />

                                        {/* Therapist Section */}
                                        <Box display={'flex'} flexDirection={'column'} width={"100%"} p={3}>
                                            <Box width={"100%"} display={'flex'} alignItems={'center'} justifyContent={'space-around'}>
                                                <Typography variant='p' color='secondary' sx={{ fontSize: "18px", fontWeight: "600", mt: "10px" }}>
                                                    {therapist ? `${therapist.name}` : 'Therapist'}
                                                </Typography>
                                                {/* <Button
                                                    onClick={() => handleRatingOpen(child._id, 'therapist')}
                                                    startIcon={<AddIcon />}
                                                    variant='outlined'
                                                    color='secondary'
                                                    sx={{ borderRadius: "25px", marginTop: "20px", height: "25px", width: '118px', padding: '15px 25px', fontSize: "14px", fontWeight: "500" }}
                                                >
                                                    Rating
                                                </Button> */}
                                            </Box>
                                            <Typography variant='p' color='primary' sx={{ fontSize: "14px" }}>Complete Learning plan</Typography>
                                            <Link to={therapist ? `/parent/therapistlearningplan/${therapist._id}/${child._id}` : '#'}>
                                                <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "45px", width: '227px', padding: '10px 35px', fontSize: "14px", fontWeight: "500" }}>Learning plan</Button>
                                            </Link>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid>

                <Ratings
                    openRating={ratingState.open}
                    handleRatingClose={handleRatingClose}
                    handleRatingSubmit={handleRatingSubmit}
                    professionalType={ratingState.professionalType}
                />
            </Box>
        </>
    )
}

export default ParentLearningPlan;