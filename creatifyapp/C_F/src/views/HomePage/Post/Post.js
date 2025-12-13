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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Box, Chip, Divider, Stack, Tooltip } from '@mui/material';
import CommentDialog from '../../../components/CommentDialog';
import "./Post.css";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [follow, setFollow] = useState(false);
  const [favoriteFlag, setFavoriteFlag] = useState(false);
  const {
    post,
    fetchPostsComments,
    activeUserDetails,
    handleLikesAndDislikes,
    postsLikes,
    followAccount,
    fetchProfileIdDetails,
    setFavouritePost,
    favoritePostIds,
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
    const favoriteIdsArray = favoritePostIds.map(post => post.postId);
    setFavoriteFlag(favoriteIdsArray.includes(postId));
  }, [favoritePostIds])

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
  };

  const handleProfileViewClick = async () => {
    try {
      await fetchProfileIdDetails(postUserId);
      navigate('/commanProfile')
    }
    catch (er) {
      alert('Something Went wrong!!!')
    }
  };

  const handleFavouritePostClick = async () => {
    try {
      await setFavouritePost(postId, postUserId);
      setFavoriteFlag(!favoriteFlag);
    }
    catch(er) {
      alert('Something Went wrong!!!')
    }
  };

  return (
    <Card 
      elevation={2}
      sx={{ 
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      {/* Post Header */}
      <CardHeader
        avatar={
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => handleProfileViewClick()}
          >
            {username.slice(0, 1).toUpperCase()}
          </Avatar>
        }
        action={
          postUserId !== userId && (
            <Tooltip title={follow ? 'Unfollow' : 'Follow'}>
              <IconButton 
                onClick={() => handleFollowClick()}
                sx={{
                  bgcolor: follow ? 'error.light' : 'primary.light',
                  color: 'white',
                  '&:hover': {
                    bgcolor: follow ? 'error.main' : 'primary.main',
                  },
                }}
              >
                {follow ? <PersonRemoveIcon fontSize="small" /> : <PersonAddIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )
        }
        title={
          <Typography 
            variant="subtitle1" 
            fontWeight={700}
            sx={{ cursor: 'pointer' }}
            onClick={() => handleProfileViewClick()}
          >
            {username}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        }
        sx={{ pb: 1 }}
      />

      {/* Post Image */}
      <Box
        sx={{
          width: '100%',
          height: 500,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img 
          src={image} 
          alt={caption}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Post Actions */}
      <CardActions sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
          <Tooltip title={like ? 'Unlike' : 'Like'}>
            <IconButton
              onClick={() => handleLikes()}
              sx={{
                color: like ? 'error.main' : 'inherit',
                '&:hover': {
                  bgcolor: like ? 'error.light' : 'action.hover',
                },
              }}
            >
              {like ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Comment">
            <IconButton onClick={() => handleCommentDialog()}>
              <CommentIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Share">
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={favoriteFlag ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton 
              onClick={() => handleFavouritePostClick()}
              sx={{
                color: favoriteFlag ? '#FFD700' : 'inherit',
              }}
            >
              {favoriteFlag ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Tooltip>
          
          {description && (
            <Tooltip title={expanded ? 'Show less' : 'Show more'}>
              <IconButton
                onClick={handleExpandClick}
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </CardActions>

      <Divider />

      {/* Post Caption & Stats */}
      <CardContent sx={{ py: 2 }}>
        <Stack spacing={1.5}>
          {/* Like Count */}
          {likes && likes.length > 0 && (
            <Typography variant="subtitle2" fontWeight={600}>
              {likes.length} {likes.length === 1 ? 'like' : 'likes'}
            </Typography>
          )}

          {/* Caption */}
          <Box>
            <Typography 
              component="span" 
              variant="body1" 
              fontWeight={600}
              sx={{ mr: 1, cursor: 'pointer' }}
              onClick={() => handleProfileViewClick()}
            >
              {username}
            </Typography>
            <Typography 
              component="span" 
              variant="body1"
              color="text.primary"
            >
              {caption}
            </Typography>
          </Box>

          {/* Comments Count */}
          {comments && comments.length > 0 && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                cursor: 'pointer',
                '&:hover': { color: 'text.primary' },
              }}
              onClick={() => handleCommentDialog()}
            >
              View all {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </Typography>
          )}
        </Stack>
      </CardContent>

      {/* Description Collapse */}
      {description && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              {description}
            </Typography>
          </CardContent>
        </Collapse>
      )}

      {openCommentDialog && (
        <CommentDialog 
          postId={postId} 
          comments={comments} 
          handleCommentDialog={handleCommentDialog} 
        />
      )}
    </Card>
  );
}


export default Post;