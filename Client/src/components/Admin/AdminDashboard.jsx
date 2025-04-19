import { Box, Button, Container, Grid, Typography } from '@mui/material'
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import React, { useEffect } from 'react';
import adminlogo from "../../assets/adminlogo.png";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SchoolIcon from '@mui/icons-material/School';
import SpaIcon from '@mui/icons-material/Spa';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
};



const AdminDashboard = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate=useNavigate();
const handleLogOut = () => {
    localStorage.removeItem('token');
    // localStorage.removeItem('parentdetails');
    // window.location.reload();
    navigate('/admin/login');
    toast.success("You logged out");

    // logging out and not returning back
   

}
useEffect(() => {
    if (localStorage.getItem("token") == null) {
      navigate("/");
    }
  });
    return (
        <>
            <Container maxWidth="x-lg" sx={{ background: "#F6F7F9" }}>
                <Grid container spacing={2} sx={{ height: "100vh", width: "100%" }}>
                    <Grid size={{ xs: 6, md: 2 }} sx={{ height: "100%", background: "white", margin: "15px 0px", borderRadius: "8px" }} display={'flex'} justifyContent={'start'} alignItems={'center'} flexDirection={'column'}>
                        <Box sx={{ width: "122px", height: "30px", marginTop: "30px" }} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'}>
                            <Box component="img" src={adminlogo} sx></Box>
                            <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>LearnHub</Typography>
                        </Box>

                        <Box sx={{ height: "340px", marginTop: "20px" }}>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <DashboardIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Dashboard</Typography>
                            </Box>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <SupervisedUserCircleIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Parent</Typography>
                            </Box>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <SchoolIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Educator</Typography>
                            </Box>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <SpaIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Therapist</Typography>
                            </Box>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <ListAltIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Activity Library</Typography>
                            </Box>
                            <Box sx={{ height: "40px", marginBottom: "10px" }} display={'flex'} justifyContent={'start'} alignItems={'center'}>
                                <NotificationsIcon color='primary' sx={{ width: "24px" }} />
                                <Typography color='primary' sx={{ fontSize: "14px", fontWeight: "500" }}>Noitification</Typography>
                            </Box>

                        </Box>

                    </Grid>
                    {/* Content (right part) */}
                    <Grid item xs={6} md={10} sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "start", padding: "15px 0px", borderRadius: "8px", flexGrow: 1 }}>
                        <Box sx={{ height: "70px", background: "white", borderRadius: "8px", width: "100%" }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography variant='h3' sx={{ fontSize: "24px", fontWeight: "500" }} color='primary'>Dashboard</Typography>
                            <Button onClick={handleOpen} variant="text" color='primary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '200px', padding: '10px 35px' }} startIcon={<LogoutIcon />}>logout</Button>
                        </Box>
                    </Grid>

                </Grid>
            </Container>
            {/* logout modal */}
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Logout</Typography>
                                <CloseIcon onClick={handleClose} sx={{ fontSize: "18px" }} />
                            </Box>
                            <hr />
                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
                                <Typography color='primary' sx={{ fontSize: "12px", fontWeight: '500' }} variant='p'>Are you sure you want to log out ? </Typography>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{gap:"10px"}}>
                                    <Button variant='outlined' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleLogOut}>yes</Button>
                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} onClick={handleClose}>no</Button>
                                </Box>
                            </Box>

                        </Box>
                    </Fade>
                </Modal>
            </div>
        </>
    )
}

export default AdminDashboard
