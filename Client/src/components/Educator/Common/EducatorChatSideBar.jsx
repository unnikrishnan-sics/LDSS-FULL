import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
// jwtDecode is not used in this component, so it can be removed if not needed elsewhere.
// import { jwtDecode } from 'jwt-decode'; 

const EducatorChatSideBar = ({ educatorDetails }) => { 
  const { id } = useParams(); // 'id' here refers to the ID of the currently selected chat recipient
  const [searchTermParents, setSearchTermParents] = useState('');
  const [searchTermTherapists, setSearchTermTherapists] = useState('');
  const [parents, setParents] = useState([]);
  const [therapists, setTherapists] = useState([]); // State to store educator details
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Authentication token not found.");
          setLoading(false);
          // Consider redirecting to login or showing a specific error to the user
          return;
        }

        // Ensure therapistDetails are available before making API calls
        if (!educatorDetails || !educatorDetails._id) {
          console.log("Educator details not available yet.");
          setLoading(false);
          // Wait for parent component to pass therapistDetails
          return; 
        }

        // --- PARENTS FETCHING (Existing Logic) ---
        // Fetch approved parents connected to this therapist
        const parentsRes = await axios.get(
          `http://localhost:4000/ldss/educator/getapprovedparents/${educatorDetails._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // `parentsRes.data.parents` contains request objects, each with a `parentId` field (which is the parent object itself)
        const approvedParents = parentsRes.data.parents.map(req => req.parentId); 

        // Fetch children associated with all approved parents of this therapist
        const childrenRes = await axios.get(
          `http://localhost:4000/ldss/educator/getchildrenofallapprovedparents/${educatorDetails._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Process parents data to include their child's name (for display in sidebar)
        const processedParents = approvedParents.map(parent => {
          // Find children specifically linked to this parent
          const parentChildren = childrenRes.data.children.filter(
            child => child.parentId?._id === parent._id
          );
          return {
            ...parent,
            // If a parent has multiple children, this will take the first one.
            studentName: parentChildren[0]?.name,
            studentId: parentChildren[0]?._id
          };
        });
        setParents(processedParents); // Update parents state

        // --- EDUCATORS FETCHING (NEW LOGIC) ---
        // Fetch all requests to identify educators for chat
        const requestListRes = await axios.get(
          `http://localhost:4000/ldss/request/fetchall`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const requests = requestListRes.data.requests;
        // console.log("All requests received:", requests); // For debugging purposes

        const uniqueTherapistIds = new Set();
        requests.forEach(request => {
          // Check if the request's recipient is an 'educator' and the request status is 'accepted'
          // This assumes the therapist wants to chat with any educator involved in an accepted request.
          // If the therapist should only chat with educators they have a direct request with,
          // the condition `request.parentId === therapistDetails._id || request.recipientId === therapistDetails._id`
          // would need to be added/adjusted.
          if (request.recipientRole === 'theraphist' && request.status === 'accepted') {
            uniqueTherapistIds.add(request.recipientId);
          }
        });

        const therapistIdsArray = Array.from(uniqueTherapistIds);
        // console.log("Unique educator IDs extracted for fetching details:", educatorIdsArray); // For debugging

        if (therapistIdsArray.length > 0) {
          // Create an array of promises, each fetching details for one educator
          const therapistPromises = therapistIdsArray.map(async (therapistId) => {
            try {
              // Assume an endpoint exists to fetch individual educator details by their ID
              const therapistRes = await axios.get(
                `http://localhost:4000/ldss/theraphist/gettheraphist/${therapistId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              // Assuming the API returns the educator object directly or wrapped in an 'educator' field
              return therapistRes.data.theraphist || therapistRes.data; 
            } catch (theraphistError) {
              console.error(`Error fetching therapist ${therapistId}:`, theraphistError);
              return null; // Return null for failed fetches so they can be filtered out
            }
          });

          // Wait for all educator fetches to complete and filter out any null results (failed fetches)
          const fetchedTherapists = (await Promise.all(therapistPromises)).filter(Boolean);
          setTherapists(fetchedTherapists); // Update educators state
        } else {
          setTherapists([]); // No educators found or to fetch
        }

      } catch (error) {
        console.error('Error fetching chat participants:', error);
        // Implement more specific error handling if needed (e.g., toast notifications)
      } finally {
        setLoading(false); // Ensure loading is set to false regardless of success or failure
      }
    };

    fetchData();
  }, [educatorDetails]); // Dependency: Re-run this effect if `therapistDetails` object changes

  // Filter parents list based on the search term
  const filteredParents = parents.filter(parent => {
    const parentName = parent?.name?.toLowerCase() || '';
    const studentName = parent?.studentName?.toLowerCase() || ''; // Can be undefined
    const searchTerm = searchTermParents.toLowerCase();
    
    return parentName.includes(searchTerm) || studentName.includes(searchTerm);
  });

  // Filter educators list based on the search term
  const filteredTherapists = therapists.filter(therapist => {
    const therapistName = therapist?.name?.toLowerCase() || '';
    const searchTerm = searchTermTherapists.toLowerCase();
    
    return therapistName.includes(searchTerm);
  });

  if (loading) {
    return (
      <Box sx={{ 
        width: "100%", 
        height: "100%", 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: "12px",
        margin: "15px"
      }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      py: "15px" // Added vertical padding for overall layout
    }}>
      {/* Parents Section */}
      <Box sx={{
        background: "white",
        mx: "15px", // Horizontal margin
        mb: "15px", // Bottom margin between sections
        flex: 1, // Allows this section to take available space
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: '45%' // Ensures it takes at least 45% of available height, prevents collapse
      }}>
        <Box sx={{ p: "10px" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: "500" }} color='primary'>Parents</Typography>
          <Box display="flex" alignItems="center" gap={1} mt={2}
            sx={{ 
              padding: "8px 15px", 
              borderRadius: "25px", 
              border: "1px solid #CCCCCC", 
              height: "40px" 
            }}
          >
            <SearchOutlinedIcon sx={{ color: 'action.active' }} />
            <input 
              placeholder="Search parents" 
              style={{ 
                border: 0, 
                outline: 0, 
                height: "100%", 
                width: "100%",
                backgroundColor: "transparent",
                fontSize: '1rem'
              }}
              value={searchTermParents}
              onChange={(e) => setSearchTermParents(e.target.value)}
            />
          </Box>
        </Box>

        <Box sx={{
          overflowY: "auto", // Enables scrolling for parent list
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for Webkit browsers (Chrome, Safari, Edge)
          flex: 1, // Allows content to take remaining space and enable scrolling
          px: "10px",
          pb: "10px" // Padding at bottom of scrollable area
        }}>
          {filteredParents.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No parents found.
            </Typography>
          ) : (
            filteredParents.map((parent) => (
              <Link 
                key={parent._id} 
                to={`/educator/chat/${parent._id}`} 
                state={{ 
                  userType: 'parent', 
                  studentName: parent.studentName, // Pass student info to chat component
                  studentId: parent.studentId 
                }}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Box 
                  display="flex" 
                  alignItems="center" 
                  gap={1} 
                  p={1}
                  sx={{ 
                    cursor: "pointer",
                    borderRadius: "8px",
                    // Highlight selected parent based on URL param 'id'
                    backgroundColor: id === parent._id ? 'primary.main' : 'transparent',
                    color: id === parent._id ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor: id === parent._id ? 'primary.main' : 'action.hover',
                      color: id === parent._id ? 'white' : 'inherit'
                    }
                  }}
                >
                  {parent.profilePic ? (
                    <Avatar 
                      src={`http://localhost:4000/uploads/${parent.profilePic}`} 
                      alt={parent.name || ''}
                    />
                  ) : (
                    <Avatar 
                      sx={{ 
                        bgcolor: id === parent._id ? 'white' : 'primary.main', // Avatar background color changes on selection
                        color: id === parent._id ? 'primary.main' : 'white' // Avatar text color changes on selection
                      }}
                    >
                      {(parent.name || '').charAt(0)}
                    </Avatar>
                  )}
                  <Box>
                    <Typography fontWeight="bold">{parent.name}</Typography>
                    {/* Display student name if available */}
                    {parent.studentName && (
                        <Typography variant="body2" sx={{ 
                            color: id === parent._id ? 'white' : 'text.secondary' 
                        }}>
                            {parent.studentName}
                        </Typography>
                    )}
                  </Box>
                </Box>
              </Link>
            ))
          )}
        </Box>
      </Box>

      {/* Educators Section */}
      <Box sx={{
        background: "white",
        mx: "15px", // Horizontal margin
        mt: 0, // No top margin as previous box has bottom margin
        flex: 1, // Allows this section to take available space
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: '45%' // Ensures it takes at least 45% of available height
      }}>
        <Box sx={{ p: "10px" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: "500" }} color='primary'>Therapists</Typography>
          <Box display="flex" alignItems="center" gap={1} mt={2}
            sx={{ 
              padding: "8px 15px", 
              borderRadius: "25px", 
              border: "1px solid #CCCCCC", 
              height: "40px" 
            }}
          >
            <SearchOutlinedIcon sx={{ color: 'action.active' }} />
            <input 
              placeholder="Search Therapists" 
              style={{ 
                border: 0, 
                outline: 0, 
                height: "100%", 
                width: "100%",
                backgroundColor: "transparent",
                fontSize: '1rem'
              }}
              value={searchTermTherapists}
              onChange={(e) => setSearchTermTherapists(e.target.value)}
            />
          </Box>
        </Box>

        <Box sx={{
          overflowY: "auto", // Enables scrolling for educator list
          scrollbarWidth: "none",
          '&::-webkit-scrollbar': { display: 'none' },
          flex: 1,
          px: "10px",
          pb: "10px"
        }}>
          {filteredTherapists.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No therapists found.
            </Typography>
          ) : (
            filteredTherapists.map((therapist) => (
              <Link 
                key={therapist._id} 
                to={`/educator/chat/${therapist._id}`} 
                state={{ userType: 'theraphist' }} // Pass user type to chat component
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Box 
                  display="flex" 
                  alignItems="center" 
                  gap={1} 
                  p={1}
                  sx={{ 
                    cursor: "pointer",
                    borderRadius: "8px",
                    // Highlight selected educator based on URL param 'id'
                    backgroundColor: id === therapist._id ? 'primary.main' : 'transparent',
                    color: id === therapist._id ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor: id === therapist._id ? 'primary.main' : 'action.hover',
                      color: id === therapist._id ? 'white' : 'inherit'
                    }
                  }}
                >
                  {therapist.profilePic ? (
                    <Avatar 
                      src={`http://localhost:4000/uploads/${therapist.profilePic}`} 
                      alt={therapist.name || ''}
                    />
                  ) : (
                    <Avatar 
                      sx={{ 
                        bgcolor: id === therapist._id ? 'white' : 'primary.main', 
                        color: id === therapist._id ? 'primary.main' : 'white' 
                      }}
                    >
                      {(therapist.name || '').charAt(0)}
                    </Avatar>
                  )}
                  <Box>
                    <Typography fontWeight="bold">{therapist.name}</Typography>
                  </Box>
                </Box>
              </Link>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EducatorChatSideBar;