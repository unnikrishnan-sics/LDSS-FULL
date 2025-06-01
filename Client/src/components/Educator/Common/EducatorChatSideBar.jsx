import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo for performance
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const EducatorChatSideBar = ({ educatorDetails }) => {
  const { id: selectedParticipantId } = useParams();
  const location = useLocation();
  const [searchTermParents, setSearchTermParents] = useState('');
  const [searchTermTherapists, setSearchTermTherapists] = useState('');
  const [conversations, setConversations] = useState([]); // Store all conversations
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

        if (!educatorDetails || !educatorDetails._id) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/ldss/conversations/user/${educatorDetails._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const validConversations = response.data.filter(conv => {
            const hasEducatorModel = conv.participantModels.includes('educator');
            const hasOtherParticipantModel = conv.participantModels.includes('parent') || conv.participantModels.includes('theraphist');
            
            const otherParticipant = conv.participants.find(p => String(p._id) !== String(educatorDetails._id));
            
            if (!otherParticipant || conv.participants.length !== 2 || !hasEducatorModel || !hasOtherParticipantModel) {
                return false;
            }

            // If the other participant is a parent, a student *must* be associated
            if (otherParticipant.role === 'parent' && !conv.student) {
                return false; 
            }
            // For therapist conversations, a student is optional.

            return true;
        });
        
        setConversations(validConversations);

      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    };

    if (educatorDetails?._id) {
      fetchConversations();
    }
  }, [educatorDetails]);

  // Group parent conversations by parent, listing all their students
  const groupedParentConversations = useMemo(() => {
    const parentMap = new Map(); // Key: parent._id, Value: { parent: {}, students: Set<Student>, firstConversation: Conversation }

    conversations.forEach(conv => {
      const otherParticipant = conv.participants.find(p => String(p._id) !== String(educatorDetails._id));

      if (otherParticipant && (otherParticipant.role === 'parent' || conv.participantModels.includes('parent'))) {
        const parentId = otherParticipant._id;
        const student = conv.student; // Guaranteed to exist for parent chats by filter

        if (!parentMap.has(parentId)) {
          parentMap.set(parentId, {
            parent: otherParticipant,
            students: new Set(), // Store unique student objects
            firstConversation: conv // Store the first conversation found for this parent
          });
        }
        parentMap.get(parentId).students.add(student);
      }
    });

    // Convert map values to an array, and format for display
    return Array.from(parentMap.values()).map(entry => ({
      ...entry.parent, // Spread parent details
      allStudents: Array.from(entry.students), // Convert Set of students to an array
      firstStudentId: entry.firstConversation.student?._id, // ID of the first student for the link
      firstStudentName: entry.firstConversation.student?.name,
      // Keep track of all conversation IDs related to this parent for potential future use
      // For now, `firstConversation` is enough for linking
    }));
  }, [conversations, educatorDetails]); // Re-calculate when conversations or educatorDetails change

  // Filter grouped parent conversations based on search term
  const filteredParents = groupedParentConversations.filter(groupedParent => {
    const parentName = groupedParent.name?.toLowerCase() || '';
    const studentNames = groupedParent.allStudents.map(s => s.name?.toLowerCase() || '').join(' ');
    const searchTerm = searchTermParents.toLowerCase();
    return parentName.includes(searchTerm) || studentNames.includes(searchTerm);
  });

  // Filter therapist conversations based on search term (original logic)
  const filteredTherapistConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => String(p._id) !== String(educatorDetails._id));
    if (!otherParticipant || !(otherParticipant.role === 'theraphist' || conv.participantModels.includes('theraphist'))) return false;

    const participantName = otherParticipant?.name?.toLowerCase() || '';
    const studentName = conv.student?.name?.toLowerCase() || ''; // Therapist chats may or may not have a student
    const searchTerm = searchTermTherapists.toLowerCase();

    return participantName.includes(searchTerm) || studentName.includes(searchTerm);
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
      {/* Parents Section */}
      <Box sx={{
        background: "white",
        mx: "15px",
        mb: "15px",
        flex: 1,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: '45%' // Ensure equal vertical space for both sections
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
          overflowY: "auto",
          scrollbarWidth: "none",
          '&::-webkit-scrollbar': { display: 'none' },
          flex: 1,
          px: "10px",
          pb: "10px"
        }}>
          {filteredParents.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No parent chats found.
            </Typography>
          ) : (
            filteredParents.map((groupedParent) => {
              // Check if any of the students linked to this grouped parent is currently selected
              const isSelected = selectedParticipantId === groupedParent._id &&
                                 groupedParent.allStudents.some(s => s._id === location.state?.studentId);

              return (
                <Link
                  key={groupedParent._id} // Use parent ID as key
                  to={`/educator/chat/${groupedParent._id}`} // ID of the parent
                  state={{
                    userType: 'parent',
                    studentName: groupedParent.firstStudentName, // Pass info of the first student
                    studentId: groupedParent.firstStudentId // Pass ID of the first student for context
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
                    {groupedParent.profilePic ? (
                      <Avatar
                        src={`http://localhost:4000/uploads/${groupedParent.profilePic}`}
                        alt={groupedParent.name || ''}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: isSelected ? 'white' : 'primary.main',
                          color: isSelected ? 'primary.main' : 'white'
                        }}
                      >
                        {(groupedParent.name || '').charAt(0)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography fontWeight="bold">{groupedParent.name}</Typography>
                      {groupedParent.allStudents.length > 0 && (
                        <Typography variant="body2" sx={{
                          color: isSelected ? 'white' : 'text.secondary'
                        }}>
                          {groupedParent.allStudents.map(s => s.name).join(', ')} {/* Display all student names */}
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

      {/* Therapists Section (Unchanged) */}
      <Box sx={{
        background: "white",
        mx: "15px",
        mt: 0,
        flex: 1,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        minHeight: '45%' // Ensure equal vertical space for both sections
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
          {filteredTherapistConversations.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No therapist chats found.
            </Typography>
          ) : (
            filteredTherapistConversations.map((conv) => {
              const therapist = conv.participants.find(p => String(p._id) !== String(educatorDetails._id));
              const student = conv.student;

              const uniqueKey = conv._id || `${therapist._id}-${student?._id || 'no-student'}`;

              return (
                <Link
                  key={uniqueKey}
                  to={`/educator/chat/${therapist._id}`}
                  state={{
                    userType: 'theraphist',
                    studentName: student?.name,
                    studentId: student?._id
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
                      backgroundColor: (selectedParticipantId === therapist._id && (!student || location.state?.studentId === student?._id)) ? 'primary.main' : 'transparent',
                      color: (selectedParticipantId === therapist._id && (!student || location.state?.studentId === student?._id)) ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: (selectedParticipantId === therapist._id && (!student || location.state?.studentId === student?._id)) ? 'primary.main' : 'action.hover',
                        color: (selectedParticipantId === therapist._id && (!student || location.state?.studentId === student?._id)) ? 'white' : 'inherit'
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
                          bgcolor: (selectedParticipantId === therapist._id && (!student || location.state?.studentId === student?._id)) ? 'white' : 'primary.main',
                          color: (selectedParticipantId === therapist._id && (!student || location.state?.studentId === student?._id)) ? 'primary.main' : 'white'
                        }}
                      >
                        {(therapist.name || '').charAt(0)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography fontWeight="bold">{therapist.name}</Typography>
                      {student?.name && (
                        <Typography variant="body2" sx={{
                          color: (selectedParticipantId === therapist._id && (!student || location.state?.studentId === student?._id)) ? 'white' : 'text.secondary'
                        }}>
                          {student.name}
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

export default EducatorChatSideBar;