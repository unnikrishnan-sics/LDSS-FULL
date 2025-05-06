import React from 'react';
import { Avatar, Box, Breadcrumbs, Button, Container, Fade, Modal, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import GradeIcon from '@mui/icons-material/Grade';

const Ratings = ({openRating,handleRatingClose}) => {

    const stylerating = {
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
   
  return (
    <>
       <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openRating}
                    onClose={handleRatingClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={openRating}>
                        <Box sx={stylerating}>
                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"space-between"}>
                                <Typography variant='h4' sx={{ fontSize: "18px", fontWeight: "600" }}>Rating</Typography>
                                <CloseIcon onClick={handleRatingClose} sx={{ fontSize: "18px" }} />
                            </Box>
                            <hr />
                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
                                <Typography color='primary' sx={{ fontSize: "12px", fontWeight: '500' }} variant='p'>Rating ? </Typography>
                                <Box display={"flex"} flexDirection={'column'} alignItems={"center"} justifyContent={"center"}>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ gap: "10px" }}>
                                <GradeIcon sx={{color:"#D9D9D9"}}/>
                                <GradeIcon sx={{color:"#D9D9D9"}}/>
                                <GradeIcon sx={{color:"#D9D9D9"}}/>
                                <GradeIcon sx={{color:"#D9D9D9"}}/>
                                <GradeIcon sx={{color:"#D9D9D9"}}/>
                                </Box>
                                

                                    <Button variant='contained' color='secondary' sx={{ borderRadius: "25px", marginTop: "20px", height: "40px", width: '100px', padding: '10px 35px' }} >Submit</Button>
                                    
                                </Box>
                            </Box>

                        </Box>
                    </Fade>
                </Modal>
            </div>
    </>
  )
}

export default Ratings
