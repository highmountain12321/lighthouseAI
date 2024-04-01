import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FlagIcon from '@mui/icons-material/Flag';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import {
  updateFeedbackById,
} from 'app/redux/thunks/conversationThunk'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'


// Define an interface for the component's props
interface FeedbackProps {
  messageId: string;
}

const Feedback: React.FC<FeedbackProps> = ({ messageId }) => {
  const dispatch = useAppDispatch()

  const [comment, setComment] = useState('');
  const [feedbackType, setFeedbackType] = useState({
    flagged: false,
    positive: false,
    negative: false,
  });
  const submitFeedback = async () => {
    const data = {
      message_id: messageId, // Ensure you have this value from props or context
      feedback: feedbackType.positive ? 'positive' : feedbackType.negative ? 'negative' : '',
      flagged: feedbackType.flagged,
      comment: comment,
    };

    const feedbackData = {
      message_id: data.message_id,
      feedbackData: data
    }

    await dispatch(updateFeedbackById(feedbackData))
    // Logic to send feedbackData to the server
    console.log(feedbackData);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap', // Allow items to wrap
      alignItems: 'center',
      gap: 1,
      border: 1,
      borderColor: 'divider',
      borderRadius: '4px',
      p: 1,
      maxWidth: '100%', // Ensure it does not overflow the screen width
      mx: 'auto' // Centers the box if it's less than the maximum width
    }}>
    <IconButton onClick={() => setFeedbackType(prev => ({ ...prev, positive: true, negative: false, flagged: false }))} color={feedbackType.positive ? 'primary' : 'default'}>
      <ThumbUpIcon />
    </IconButton>
    <IconButton onClick={() => setFeedbackType(prev => ({ ...prev, positive: false, negative: true, flagged: false }))} color={feedbackType.negative ? 'primary' : 'default'}>
      <ThumbDownIcon />
    </IconButton>
    <IconButton onClick={() => setFeedbackType(prev => ({ ...prev, flagged: !prev.flagged, positive: false, negative: false }))} color={feedbackType.flagged ? 'primary' : 'default'}>
      <FlagIcon />
    </IconButton>

      <TextField
        size="small"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        variant="outlined"
      />
      <IconButton onClick={submitFeedback} color="primary">
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default Feedback;