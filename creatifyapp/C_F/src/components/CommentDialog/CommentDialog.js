import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CommentTextShimmer from '../../LoadersAndShimmers/CommentTextShimmer'
import './CommentDialog.css'
import { toast } from 'react-toastify';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CommentDialog = (props) => {

  const [commentString, setCommentString] = useState('');

  const {
    handleCommentDialog,
    activeUserDetails,
    handleCommentOnPost,
    postId,
    postsComments,
    fetchPostsComments,
    isCommentDialogLoading,
  } = props;

  const { username } = activeUserDetails;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        await fetchPostsComments(postId);
      }
      catch(er) {
        alert("Error")
      }
    }
    fetchComments();
  }, [postId, postsComments]);

  const handleComment = async () => {
    try {
      await handleCommentOnPost(commentString,postId);
    }
    catch (er) {
      alert("Error")
    }
  };
  console.log(isCommentDialogLoading);
  return (

    <Dialog
      open={true}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => handleCommentDialog()}
      aria-describedby="alert-dialog-slide-description"
      fullWidth={'50vw'}
    >
      <DialogTitle>{"Comments"}{JSON.stringify(isCommentDialogLoading)}</DialogTitle>
      <DialogContent>
        {isCommentDialogLoading ? <div className="commentLoader"><CommentTextShimmer/></div> : <div className='commentsListContainer'>
          {
            postsComments && Object.keys(postsComments).length > 0 && postsComments[postId] && [...postsComments[postId]].reverse().map((commentObj) => {
              const { comment, username } = commentObj;
              return (<>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'orange' }} aria-label="recipe">
                      <span>{username.slice(0, 1).toUpperCase()}</span>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={username}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {comment}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" />
              </>
              );
            })
          }
        </div>}
        <Box sx={{ width: '100%', padding: '18px', display: 'flex', alignItems: 'flex-end' }}>
          <Avatar sx={{ bgcolor: 'orange', height: '40px', width: '40px' }} aria-label="recipe">
            <span>{username.slice(0, 1).toUpperCase()}</span>
          </Avatar>
          <TextField
            sx={{ width: '100%', marginLeft: '10px' }}
            multiline
            maxRows={4}
            id="input-with-sx"
            label="Comment Here"
            variant="standard"
            onChange={(e) => setCommentString(e.target.value)}
            />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleComment()}>Comment</Button>
        <Button onClick={() => handleCommentDialog()}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CommentDialog;

{/* */ }