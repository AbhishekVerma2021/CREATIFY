import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentIcon from '@mui/icons-material/Comment';

import CommentDialog from '../../../components/CommentDialog';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ProfilePost = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false)
  const [like, setLike] = useState(false);
  const {
    post,
    activeUserDetails,
    handleLikesAndDislikes,
    postsLikes,
   } = props;

  const {
    comments,
    caption,
    description,
    image,
    likes,
    user,
    _id,
  } = post;

  const {
    username,
  } = activeUserDetails;

  const postId = _id;
  const userId = activeUserDetails?._id;
  useEffect(() => {
    let likesArray = [];
    console.log(postsLikes)
    postsLikes && postsLikes[postId] && postsLikes[postId].forEach((like) => likesArray.push(like.uId));
    setLike(likesArray.includes(userId));
  },[])

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  const handleCommentDialog = () => {
    setOpenCommentDialog(!openCommentDialog)
  }

  const handleLikes = async () => {
    try {
      await handleLikesAndDislikes(postId, like);
    } catch (e) {
      alert('LIKE ERROR: ' + e.message)
    }
    setLike(!like);
  }

  return (
    <Card sx={{ maxWidth: 245 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <span>{username.slice(0, 1).toUpperCase()}</span>
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={username}
        subheader="September 14, 2016"
        sx={{ height: 70, padding: '5px 10px' }}
      />
      <CardMedia
        component="img"
        height="194"
        image={image}
        alt={caption}
      />
      <CardContent sx={{ padding: '5px 16px' }}>
        <Typography variant="body2"  color="text.secondary">
          {caption}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={() => handleLikes()}
        >
          <FavoriteIcon style={{ color: like ? 'red' : 'inherit' }}/>
        </IconButton>
        <IconButton aria-label="share" onClick={() => handleCommentDialog()}>
          <CommentIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {description}
        </CardContent>
      </Collapse>
      {openCommentDialog && <CommentDialog postId={_id} comments={comments} handleCommentDialog={handleCommentDialog} />}
    </Card>
  );
}

export default ProfilePost;