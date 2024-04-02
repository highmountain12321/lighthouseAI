import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FlagIcon from '@mui/icons-material/Flag';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import { updateFeedbackById } from 'app/redux/thunks/conversationThunk';
import { useAppDispatch } from 'app/redux/hooks';

interface FeedbackProps {
  messageId: string;
}

type FeedbackData = {
  feedback?: string;
  flagged?: boolean;
  comment?: string;
};

const Feedback: React.FC<FeedbackProps> = ({ messageId }) => {
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  // Initialize the `isFlagged` state to track the flagged status
  const [isFlagged, setIsFlagged] = useState(false);

  const submitFeedback = async (feedbackData: FeedbackData) => {
    await dispatch(updateFeedbackById({ message_id: messageId, feedbackData }));
    console.log({ message_id: messageId, feedbackData }); // for debugging
  };

  const handleFeedback = (type: string, value: any) => {
    let feedbackData = {};
    if (type === 'flagged') {
      // Toggle the `isFlagged` state
      setIsFlagged(!isFlagged);
      feedbackData = { flagged: !isFlagged };
    } else if (type === 'feedback') {
      setFeedbackType(value);
      feedbackData = { feedback: value };
    } else if (type === 'comment') {
      console.log(value, "value");
      feedbackData = { comment: value };
    }

    submitFeedback(feedbackData);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 1,
      borderRadius: '4px',
      p: 1,
      maxWidth: '100%',
      mx: 'auto'
    }}
    style={{marginTop: "-1.5rem", marginLeft: "1.5rem"}}>
      <IconButton onClick={() => handleFeedback('feedback', 'good')} color={feedbackType === 'good' ? 'primary' : 'default'}>
        <ThumbUpIcon />
      </IconButton>
      <IconButton onClick={() => handleFeedback('feedback', 'bad')} color={feedbackType === 'bad' ? 'primary' : 'default'}>
        <ThumbDownIcon />
      </IconButton>
      {/* Use `isFlagged` state to determine the color of the flag icon */}
      <IconButton onClick={() => handleFeedback('flagged', null)} color={isFlagged ? 'primary' : 'default'}>
        <FlagIcon />
      </IconButton>
      <TextField
        size="small"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        variant="outlined"
      />
      <IconButton onClick={() => handleFeedback('comment', comment)} color="primary">
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default Feedback;
