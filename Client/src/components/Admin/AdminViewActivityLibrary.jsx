import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, ButtonGroup, Container, Grid, InputAdornment, Menu, MenuItem, TextField, Typography, alpha, styled, Avatar, Tooltip } from '@mui/material'
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AdminViewSingleEducator from './Common/AdminViewSingleEducator';
import AdminSideBar from './Common/AdminSideBar';
import AdminLogout from './Common/AdminLogout';
import LirbraryCardImage from '../../assets/librarycard.png'
import { useNavigate } from 'react-router-dom';

const AdminViewActivityLibrary = () => {
    const [openLogout, setOpenLogout] = useState(false);
    const handleOpenLogout = () => setOpenLogout(true);
    const handleCloseLogout = () => setOpenLogout(false);
    const navigate = useNavigate();

    const activityCards = [
        {
            id: 1,
            title: "Critical Thinking Debate",
            description: "Students are given a real-world issue 'Social media does more harm than good' and are asked to prepare arguments for or against.",
            category: "Communication & Cognitive Skills"
        },
        {
            id: 2,
            title: "Creative Story Writing",
            description: "Students create original stories based on given prompts, focusing on narrative structure and creative expression.",
            category: "Language & Creativity"
        },
        {
            id: 3,
            title: "Science Experiment Lab",
            description: "Hands-on experiments demonstrating basic physics principles like gravity and motion using everyday materials.",
            category: "STEM Learning"
        },
        {
            id: 4,
            title: "Math Puzzle Challenge",
            description: "Interactive math puzzles that develop problem-solving skills and numerical fluency through engaging problems.",
            category: "Mathematical Thinking"
        },
        {
            id: 5,
            title: "Cultural Exchange Day",
            description: "Students research and present about different cultures, promoting global awareness and diversity appreciation.",
            category: "Social Studies"
        },
        {
            id: 6,
            title: "Art Interpretation",
            description: "Students analyze famous artworks and create their own interpretations using various media and techniques.",
            category: "Visual Arts"
        },
        {
            id: 7,
            title: "Environmental Awareness",
            description: "Activities focused on sustainability, recycling, and understanding ecological systems and conservation.",
            category: "Science & Nature"
        },
        {
            id: 8,
            title: "Public Speaking Workshop",
            description: "Structured exercises to build confidence in speaking, presenting ideas, and effective communication.",
            category: "Communication Skills"
        },
        {
            id: 9,
            title: "Team Building Games",
            description: "Collaborative challenges designed to develop teamwork, leadership, and cooperative problem-solving.",
            category: "Social Skills"
        },
        {
            id: 10,
            title: "Music Composition",
            description: "Introduction to basic music theory and creating simple compositions using digital tools or instruments.",
            category: "Performing Arts"
        },
        {
            id: 11,
            title: "Coding Basics",
            description: "Introductory programming concepts through block-based coding platforms suitable for beginners.",
            category: "Digital Literacy"
        },
        {
            id: 12,
            title: "Mindfulness Exercises",
            description: "Guided activities to develop focus, emotional regulation, and stress management techniques.",
            category: "Social-Emotional Learning"
        }
    ];

    const StyledTextField = styled(TextField)({
        '& .MuiOutlinedInput-root': {
            borderRadius: '30px',
            border: "1px solid black"
        },
    });

    // dropdown
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // fetching all educators
    const [educator, setEducator] = useState([])
    const [educatorDetails, setEducatorDetails] = useState([]);
    const fetchAllEducators = async () => {
        const token = localStorage.getItem("token");
        const alleducators = await axios.get("http://localhost:4000/ldss/educator/getalleducators", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(alleducators.data.educators);
        const educators = alleducators.data.educators;
        setEducator(educators)
        const unapproved = educators.filter(e => e.isAdminApproved === false);
        setEducatorDetails(unapproved);
    };
    
    useEffect(() => {
        fetchAllEducators();
    }, []);

    const approvedEducators = () => {
        const approved = educator.filter(e => e.isAdminApproved === true);
        setEducatorDetails(approved)
    };
    
    const [educatordetail, setEducatordetail] = useState({});
    const [openeducator, setOpenEducator] = useState(false);
    const handleEducatorOpen = () => setOpenEducator(true);
    const handleEducatorClose = () => setOpenEducator(false);

    const fetchEducatorDetail = async (educatorId) => {
        const token = localStorage.getItem("token");
        const educatordetail = await axios.get(`http://localhost:4000/ldss/educator/geteducator/${educatorId}`, {
            headers: {
                Authorization: `bearer ${token}`
            }
        });
        const educator = educatordetail.data.educator;
        setEducatordetail(educator);
        handleEducatorOpen();
        console.log(educatordetail.data.educator);
    };
    
    const approve = async (educatorId) => {
        const token = localStorage.getItem("token");
        const approve = await axios.post(`http://localhost:4000/ldss/admin/educator/accept/${educatorId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(approve);
        fetchAllEducators();
        setOpenEducator(false);
    }
    
    const rejectEducator = async (educatorId) => {
        const token = localStorage.getItem("token");
        const deleteEducator = await axios.delete(`http://localhost:4000/ldss/admin/educator/reject/${educatorId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        fetchAllEducators();
        setOpenEducator(false);
    };
    
    return (
        <Box sx={{ display: 'flex', backgroundColor: '#F6F7F9', minHeight: '100vh' }}>
            {/* Sidebar */}
            <Box sx={{ width: '250px', backgroundColor: 'white', margin: '15px', borderRadius: '8px' }}>
                <AdminSideBar/>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, pt: 2 }}>
                {/* Header */}
                <Box sx={{ height: "70px", background: "white", borderRadius: "8px", mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500" }} color='primary'>Activity Library</Typography>
                    <Button onClick={handleOpenLogout} variant="text" color='primary' sx={{ borderRadius: "25px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
                </Box>

                {/* Content Area */}
                <Box sx={{ background: "white", borderRadius: "8px", p: 3 }}>
                    {/* Search and Add Button */}
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={3}>
                        <Typography variant='h4' color='primary' sx={{ fontSize: '18px', fontWeight: "500" }}>All Activities</Typography>
                        <Box display={'flex'} alignItems={'center'} gap={2}>
                            <StyledTextField 
                                placeholder='search here...' 
                                id="outlined-basic" color='#CCCCCC'
                                variant="outlined" 
                                sx={{ 
                                    width: '250px',
                                    '& .MuiOutlinedInput-root': {
                                        height: '40px'
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }} 
                            />
                            <Button 
                                variant='contained' 
                                color='secondary' 
                                onClick={() => navigate('/admin/addactivity')}
                                startIcon={<AddIcon/>}
                                sx={{ borderRadius: "25px", height: "45px", width: '160px', padding: '20px 3px',textTransform:"none",fontWeight:"500" ,fontSize:"13px"}}
                            >
                                Add Activity
                            </Button>
                        </Box>
                    </Box>

                    {/* Cards Grid - Removed overflowY: "auto" to eliminate scrollbar */}
                    <Box>
                        <Grid container spacing={3}>
                            {activityCards.map((card) => (
                                <Grid item xs={12} sm={6} md={4} key={card.id}>
                                    <Card sx={{ 
                                        maxWidth: 345,
                                        bgcolor: 'transparent',
                                        boxShadow: 'none',
                                        p: 2,
                                        '&:hover': {
                                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                                        }
                                    }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={LirbraryCardImage}
                                            alt="Activity Card Image"
                                            sx={{
                                                borderRadius: '12px',
                                                objectFit: 'cover',
                                                backgroundColor: 'transparent',
                                                mb: 2
                                            }}
                                        />
                                        
                                        <CardContent sx={{ 
                                            p: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1
                                        }}>
                                            <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 500, color: "#384371" }}>
                                                {card.title}
                                            </Typography>
                                            
                                            <Typography variant="h6" sx={{ fontSize: "14px", color: "#384371" }}>
                                                {card.description}
                                            </Typography>
                                            
                                            <Typography variant="caption" sx={{ 
                                                color: 'secondary.main',
                                                fontWeight: 500,
                                                display: 'block'
                                            }}>
                                                Activity Category
                                            </Typography>
                                            
                                            <Typography variant="h6" sx={{ color: "#384371", mb: 1, fontSize: "13px" }}>
                                                {card.category}
                                            </Typography>
                                        </CardContent>
                                        
                                        <CardActions sx={{ 
                                            p: 0,
                                            display: 'flex',
                                            gap: 2,
                                            mt: 2
                                        }}>
                                            <Button 
                                                variant="outlined" 
                                                color="secondary"
                                                sx={{ 
                                                    borderRadius: '25px',
                                                    textTransform: 'none',
                                                    flex: 1,
                                                    py: 1
                                                }}
                                            >
                                                Delete
                                            </Button>
                                            
                                            <Button 
                                                variant="contained" 
                                                color="secondary"
                                                onClick={() => navigate('/admin/editactivity')}
                                                sx={{ 
                                                    borderRadius: '25px',
                                                    textTransform: 'none',
                                                    flex: 1,
                                                    py: 1
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>

            {/* Modals */}
            <Modal
                open={openeducator}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openeducator}>
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
                        height: "600px"
                    }}>
                        <AdminViewSingleEducator educatordetail={educatordetail} handleEducatorClose={handleEducatorClose} approve={approve} rejectEducator={rejectEducator} />
                    </Box>
                </Fade>
            </Modal>
            
            <AdminLogout handleCloseLogout={handleCloseLogout} openLogout={openLogout}/>
        </Box>
    )
}

export default AdminViewActivityLibrary