import { Avatar, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import axios from 'axios';

const EducatorChatSideBar = () => {
    const [approvedParents, setApprovedParents] = useState([]);
    const FetchApprovedParents = async () => {
        const token = localStorage.getItem("token");
        const educatorId = JSON.parse(localStorage.getItem("educatorDetails"))._id;
        const approvedParents = await axios.get(`http://localhost:4000/ldss/educator/parentsrequest/${educatorId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(approvedParents.data.request);
        const approved = approvedParents.data.request;
        const parents = approved.filter((parent) => parent.status === "accepted");
        setApprovedParents(parents);

    };
    // fetching parent 
    // const [parent, setParent] = React.useState({});
    // const fetchParent = async () => {
    //     const parentId = approvedParents.parentId;
    //     const token = localStorage.getItem("token");
    //     const parent = await axios.get(`http://localhost:4000/ldss/parent/getparent/${parentId}`, {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     });
    //     console.log(parent.data.parent);
    //     setParent(parent.data.parent);
    // }

    useEffect(() => {
        FetchApprovedParents();
        // fetchParent();
    }, []);
    return (
        <>
            <Box sx={{ width: "300px", height: "100%" }}>
                <Box sx={{
                    background: "white", p: "10px", m: "15px", height: "50%", borderRadius: "12px", overflowY: "scroll", scrollbarWidth: "none",  
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: "500" }} color='primary' variant='p'>Parents</Typography>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} mt={2} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                        <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                        <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                    </Box>
                    {approvedParents.map((approved, index) => {
                        return (
                            <Box key={index} display={'flex'} alignItems={'center'} gap={1} mt={2} ml={2}>
                                {approved.parentId.profilePic.filename ?
                                    (<Avatar src={`http://localhost:4000/uploads/${approved.parentId?.profilePic.filename}`}></Avatar>)
                                    :
                                    (<Avatar src={approved.parentId.name.charAt(0)}></Avatar>)
                                }

                                <Typography>{approved.parentId?.name}</Typography>
                            </Box>
                        )
                    })}
                </Box>
                {/* bottom */}
                <Box sx={{
                    background: "white", p: "10px", m: "15px", height: "50%", borderRadius: "12px", overflowY: "scroll", scrollbarWidth: "none",  
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: "500" }} color='primary' variant='p'>Parents</Typography>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1} mt={2} style={{ padding: "8px 15px", borderRadius: "25px", border: "1px solid #CCCCCC", height: "40px" }}>
                        <Box sx={{ height: "100%" }}><SearchOutlinedIcon /></Box>
                        <input placeholder='search here' style={{ padding: "8px 15px", border: 0, outline: 0, height: "100%" }}></input>
                    </Box>
                    {approvedParents.map((approved, index) => {
                        return (
                            <Box key={index} display={'flex'} alignItems={'center'} gap={1} mt={2} ml={2}>
                                {approved.parentId.profilePic.filename ?
                                    (<Avatar src={`http://localhost:4000/uploads/${approved.parentId?.profilePic.filename}`}></Avatar>)
                                    :
                                    (<Avatar src={approved.parentId.name.charAt(0)}></Avatar>)
                                }

                                <Typography>{approved.parentId?.name}</Typography>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
        </>
    )
}

export default EducatorChatSideBar
