import React, { useEffect, useId, useState } from 'react';
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
// import followIcon from '../../../images/follow.svg';
// import followedIcon from '../../../images/following.svg';
// import avatar from '../../../images/avatar.svg'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
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
  const [expanded, setExpanded] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [like, setLike] = useState(false);
  const [follow, setFollow] = useState(false);
  const {
    post,
    fetchPostsComments,
    activeUserDetails,
    handleLikesAndDislikes,
    postsLikes,
    followAccount,
  } = props;

  const {
    _id,
    comments,
    description,
    image,
    caption,
    likes,
    user,
    date
  } = post;
  const inputDate = new Date(date);

  

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour clock
  };
  
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(inputDate);
  const postId = _id;
  const userId = activeUserDetails?._id;
  let email = '';
  let username = '';
  let postUserId = '';
  if (user)
  {
    email = user.email;
    username = user.username;
    postUserId = user._id;
  }

  useEffect(() => {
    const { following } = activeUserDetails;
    let followFlag = false;
    following && following.length > 0 && following.forEach( followedUser => {
      if(followedUser.uId === postUserId)
      {
        followFlag=true;
      }
    })
    setFollow(followFlag);
  }, [activeUserDetails]);

  useEffect(() => {
    let likesArray = [];
    postsLikes && postsLikes[postId] && postsLikes[postId].forEach((like) => likesArray.push(like.uId));
    const { following } = activeUserDetails;
    setLike(likesArray.includes(userId));
  },[])
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCommentDialog = async () => {
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

  const handleFollowClick = async () => {
    try {
      await followAccount(postUserId);
    } catch (e) {
      alert('Something went wrong')
    }
  }

  return (
    <Card sx={{ minWidth: "35vw", margin: "40px 0" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {username.slice(0, 1).toUpperCase()}
          </Avatar>
        }
        action={
           postUserId !== userId && <IconButton aria-label="settings" onClick={() => handleFollowClick()}>
            {follow ? <PersonRemoveIcon/> : <PersonAddIcon/>}
          </IconButton>
        }
        className='postHeader'
        sx={{ fontWeight: "700" }}
        title={username}
        subheader={formattedDate}
      />
      <div className='postImageConatiner'>
        <img src={image} alt="" />
      </div>
      <CardContent>
        <Typography variant="body2" sx={{ fontSize: "20px", color: "black" }} color="text.secondary">
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
      {openCommentDialog && <CommentDialog postId={postId} comments={comments} handleCommentDialog={handleCommentDialog} />}
    </Card>
  );
}


export default Post;