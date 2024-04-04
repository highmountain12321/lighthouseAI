import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FlagIcon from '@mui/icons-material/Flag';
import SendIcon from '@mui/icons-material/Send';
import { useSnackbar } from 'notistack'
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
  const { enqueueSnackbar, } = useSnackbar()
  const dispatch = useAppDispatch()

  const [comment, setComment] = useState('');
  const [feedbackType, setFeedbackType] = useState({
    flagged: false,
    positive: false,
    negative: false,
  });
  const submitFeedback = async () => {
    if (comment === "") {
      enqueueSnackbar('Please enter a message to send', {
        variant: 'warning',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      })
      return
    }

    const FeebackData = {
      flagged: feedbackType.flagged,
      comment: comment,
      feedback: feedbackType.positive ? 'good' : feedbackType.negative ? 'bad' : '',
    };

    // const data = {
    //   message_id: messageId, // Ensure you have this value from props or context
    //   feedback: feedbackType.positive ? 'positive' : feedbackType.negative ? 'negative' : '',
    //   flagged: feedbackType.flagged,
    //   comment: comment,
    // };

    const feedbackData = {
      message_id: messageId,
      feedbackData: FeebackData
    }

    await dispatch(updateFeedbackById(feedbackData))
    // Logic to send feedbackData to the server
    // console.log(feedbackData);
  };

  useEffect(() => {
    const FeebackData = {
      flagged: feedbackType.flagged,
      comment: comment,
      feedback: feedbackType.positive ? 'good' : feedbackType.negative ? 'bad' : '',
    };

    const feedbackData = {
      message_id: messageId,
      feedbackData: FeebackData
    }

    dispatch(updateFeedbackById(feedbackData))
  }, [feedbackType])


  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap', // Allow items to wrap
      alignItems: 'center',
      gap: 0,
      border: 0,
      borderColor: 'divider',
      borderRadius: '4px',
      margin: '-12px 0 0 0',
      p: 0,
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
