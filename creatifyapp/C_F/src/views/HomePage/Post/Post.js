import React, { useState } from 'react';
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
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentDialog from '../../../components/CommentDialog';
import "./Post.css";


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

const Post = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [openCommentDialog, setOpenCommentDialog] = React.useState(false);
  const {
    post,
    fetchPostsComments,
  } = props;
  const {
    _id,
    comments,
    description,
    image,
    caption,
    likes,
    user, } = post;

    const { email, username } = user;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  const handleCommentDialog = async () => {
    setOpenCommentDialog(!openCommentDialog)
  }


  return (
    <Card sx={{ minWidth: "35vw", margin: "40px 0" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {username.slice(0,1).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        className='postHeader'
        sx={{ fontWeight: "700"}}
        title={username}
        subheader="September 14, 2016"
      />
      <div className='postImageConatiner'>
        <img src={image} alt=""/>
      </div>
      <CardContent>
        <Typography variant="body2" sx={{ fontSize: "20px", color: "black" }} color="text.secondary">
          {caption}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton onClick={() => handleCommentDialog()}>
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
        <CardContent sx={{ width: '35vw' }}>
          {description}
        </CardContent>
      </Collapse>
      {openCommentDialog && <CommentDialog postId={_id} comments={comments} handleCommentDialog={handleCommentDialog} />}
    </Card>
  );
}


export default Post;