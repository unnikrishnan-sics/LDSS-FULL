import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ParentChatSideBar = ({ parentDetails }) => {
  const { id: selectedParticipantId } = useParams();
  const location = useLocation();
  const [searchTermEducators, setSearchTermEducators] = useState('');
  const [searchTermTherapists, setSearchTermTherapists] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        // Prefer parentDetails._id if available, otherwise fall back to token decode
        const currentParentId = parentDetails?._id || jwtDecode(token).id;

        if (!currentParentId) {
          setError("Parent ID not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/ldss/conversations/user/${currentParentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const validConversations = response.data.filter(conv => {
            const hasParentModel = conv.participantModels.includes('parent');
            // Ensure consistency with backend model names (e.g., 'theraphist' with 'ph')
            const hasOtherParticipantModel = conv.participantModels.includes('educator') || conv.participantModels.includes('theraphist');
            const hasStudent = !!conv.student; // Student should always be linked for parent conversations (with educator/therapist)

            // Ensure exactly two participants and proper models/student link
            return conv.participants.length === 2 && hasParentModel && hasOtherParticipantModel && hasStudent;
        });
        
        setConversations(validConversations);

      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if parentDetails are available (or if no prop, we'll try to decode from token)
    if (parentDetails?._id || localStorage.getItem('token')) {
      fetchConversations();
    }
  }, [parentDetails]); // Re-run when parentDetails become available or change

  // Group educator conversations by educator, listing all their students
  const groupedEducatorConversations = useMemo(() => {
    const educatorMap = new Map(); // Key: educator._id, Value: { educator: {}, students: Set<Student>, firstConversation: Conversation }

    conversations.forEach(conv => {
      const otherParticipant = conv.participants.find(p => String(p._id) !== String(parentDetails._id));

      if (otherParticipant && (otherParticipant.role === 'educator' || conv.participantModels.includes('educator'))) {
        const educatorId = otherParticipant._id;
        const student = conv.student; // Guaranteed to exist for these chats

        if (!educatorMap.has(educatorId)) {
          educatorMap.set(educatorId, {
            educator: otherParticipant,
            students: new Set(),
            firstConversation: conv // Store the first conversation for linking purposes
          });
        }
        educatorMap.get(educatorId).students.add(student);
      }
    });

    return Array.from(educatorMap.values()).map(entry => ({
      ...entry.educator,
      allStudents: Array.from(entry.students),
      firstStudentId: entry.firstConversation.student?._id,
      firstStudentName: entry.firstConversation.student?.name,
    }));
  }, [conversations, parentDetails]);

  // Group therapist conversations by therapist, listing all their students
  const groupedTherapistConversations = useMemo(() => {
    const therapistMap = new Map(); // Key: therapist._id, Value: { therapist: {}, students: Set<Student>, firstConversation: Conversation }

    conversations.forEach(conv => {
      const otherParticipant = conv.participants.find(p => String(p._id) !== String(parentDetails._id));

      // Use 'theraphist' here to match backend model and ParentChat's expectations
      if (otherParticipant && (otherParticipant.role === 'theraphist' || conv.participantModels.includes('theraphist'))) {
        const therapistId = otherParticipant._id;
        const student = conv.student; // Guaranteed to exist for these chats

        if (!therapistMap.has(therapistId)) {
          therapistMap.set(therapistId, {
            therapist: otherParticipant,
            students: new Set(),
            firstConversation: conv // Store the first conversation for linking purposes
          });
        }
        therapistMap.get(therapistId).students.add(student);
      }
    });

    return Array.from(therapistMap.values()).map(entry => ({
      ...entry.therapist,
      allStudents: Array.from(entry.students),
      firstStudentId: entry.firstConversation.student?._id,
      firstStudentName: entry.firstConversation.student?.name,
    }));
  }, [conversations, parentDetails]);

  // Filter grouped educator conversations based on search term
  const filteredEducators = groupedEducatorConversations.filter(groupedEducator => {
    const educatorName = groupedEducator.name?.toLowerCase() || '';
    const studentNames = groupedEducator.allStudents.map(s => s.name?.toLowerCase() || '').join(' ');
    const searchTerm = searchTermEducators.toLowerCase();
    return educatorName.includes(searchTerm) || studentNames.includes(searchTerm);
  });

  // Filter grouped therapist conversations based on search term
  const filteredTherapists = groupedTherapistConversations.filter(groupedTherapist => {
    const therapistName = groupedTherapist.name?.toLowerCase() || '';
    const studentNames = groupedTherapist.allStudents.map(s => s.name?.toLowerCase() || '').join(' ');
    const searchTerm = searchTermTherapists.toLowerCase();
    return therapistName.includes(searchTerm) || studentNames.includes(searchTerm);
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

  if (error) {
    return (
      <Box sx={{
        width: "100%",
        height: "100%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: "12px",
        margin: "15px",
        p: 2,
        textAlign: 'center',
        color: 'error.main'
      }}>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      py: "15px"
    }}>
      {/* Educators Section */}
      <Box sx={{
        background: "white",
        mx: "15px",
        mb: "15px",
        flex: 1,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: '45%'
      }}>
        <Box sx={{ p: "10px" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: "500" }} color='primary'>Educators</Typography>
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
              placeholder="Search educators"
              style={{
                border: 0,
                outline: 0,
                height: "100%",
                width: "100%",
                backgroundColor: "transparent",
                fontSize: '1rem'
              }}
              value={searchTermEducators}
              onChange={(e) => setSearchTermEducators(e.target.value)}
            />
          </Box>
        </Box>

        <Box sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          '&::-webkit-scrollbar': { display: 'none' },
          flex: 1,
          px: "10px",
          pb: "10px"
        }}>
          {filteredEducators.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No educator chats found.
            </Typography>
          ) : (
            filteredEducators.map((groupedEducator) => {
              // Check if any of the students linked to this grouped educator is currently selected
              const isSelected = selectedParticipantId === groupedEducator._id &&
                                 groupedEducator.allStudents.some(s => s._id === location.state?.studentId);
              
              return (
                <Link
                  key={groupedEducator._id} // Use educator ID as key
                  to={`/parent/chat/${groupedEducator._id}`} // ID of the educator
                  state={{
                    userType: 'educator',
                    studentName: groupedEducator.firstStudentName, // Pass info of the first student
                    studentId: groupedEducator.firstStudentId // Pass ID of the first student for context
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
                      backgroundColor: isSelected ? 'primary.main' : 'transparent',
                      color: isSelected ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: isSelected ? 'primary.main' : 'action.hover',
                        color: isSelected ? 'white' : 'inherit'
                      }
                    }}
                  >
                    {groupedEducator.profilePic ? (
                      <Avatar
                        src={`http://localhost:4000/uploads/${groupedEducator.profilePic}`}
                        alt={groupedEducator.name || ''}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: isSelected ? 'white' : 'primary.main',
                          color: isSelected ? 'primary.main' : 'white'
                        }}
                      >
                        {(groupedEducator.name || '').charAt(0)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography fontWeight="bold">{groupedEducator.name}</Typography>
                      {groupedEducator.allStudents.length > 0 && (
                        <Typography variant="body2" sx={{
                          color: isSelected ? 'white' : 'text.secondary'
                        }}>
                          {groupedEducator.allStudents.map(s => s.name).join(', ')} {/* Display all student names */}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Link>
              );
            })
          )}
        </Box>
      </Box>

      {/* Therapists Section */}
      <Box sx={{
        background: "white",
        mx: "15px",
        mt: 0,
        flex: 1,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: '45%'
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
          overflowY: "auto",
          scrollbarWidth: "none",
          '&::-webkit-scrollbar': { display: 'none' },
          flex: 1,
          px: "10px",
          pb: "10px"
        }}>
          {filteredTherapists.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No therapist chats found.
            </Typography>
          ) : (
            filteredTherapists.map((groupedTherapist) => {
              // Check if any of the students linked to this grouped therapist is currently selected
              const isSelected = selectedParticipantId === groupedTherapist._id &&
                                 groupedTherapist.allStudents.some(s => s._id === location.state?.studentId);

              return (
                <Link
                  key={groupedTherapist._id} // Use therapist ID as key
                  to={`/parent/chat/${groupedTherapist._id}`} // ID of the therapist
                  state={{
                    userType: 'theraphist', // CORRECTED: Changed from 'therapist' to 'theraphist' to match ParentChat's check and backend model
                    studentName: groupedTherapist.firstStudentName, // Pass info of the first student
                    studentId: groupedTherapist.firstStudentId // Pass ID of the first student for context
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
                      backgroundColor: isSelected ? 'primary.main' : 'transparent',
                      color: isSelected ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: isSelected ? 'primary.main' : 'action.hover',
                        color: isSelected ? 'white' : 'inherit'
                      }
                    }}
                  >
                    {groupedTherapist.profilePic ? (
                      <Avatar
                        src={`http://localhost:4000/uploads/${groupedTherapist.profilePic}`}
                        alt={groupedTherapist.name || ''}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: isSelected ? 'white' : 'primary.main',
                          color: isSelected ? 'primary.main' : 'white'
                        }}
                      >
                        {(groupedTherapist.name || '').charAt(0)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography fontWeight="bold">{groupedTherapist.name}</Typography>
                      {groupedTherapist.allStudents.length > 0 && (
                        <Typography variant="body2" sx={{
                          color: isSelected ? 'white' : 'text.secondary'
                        }}>
                          {groupedTherapist.allStudents.map(s => s.name).join(', ')} {/* Display all student names */}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Link>
              );
            })
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ParentChatSideBar;