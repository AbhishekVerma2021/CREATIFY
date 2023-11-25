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

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import altenateImage from '../../images/alternateImage.webp'
import './CreatePost.css'


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
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const CreatePost = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('')
  const [preview, setPreview] = useState(false);
  const {
    activeUserDetails,
    createPost,
  } = props;

  const {
    username,
    email,
  } = activeUserDetails;
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPostData = {
      caption,
      description,
      image,
    };
    console.log(newPostData);
    try {
      await createPost(newPostData);
    } catch(er) {
      alert('Something went wrong in creating post')
    }
  }
  const todaysDate = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour clock
  };
  
  const date = new Intl.DateTimeFormat('en-US', options).format(todaysDate);
  return (<>
    <div class="masterCreatePostContainer">
      <Paper elevation={3} className='createPostFormContainer'>
        <Box component="form" noValidate onSubmit={(e) => handleSubmit(e)}>
          <TextField
            id="filled-multiline-flexible"
            label="Caption"
            multiline
            maxRows={4}
            fullWidth
            sx={{ mb: 2 }}
            variant="filled"
            onChange={(e) => setCaption(e.target.value)}
          />
          <TextField
            id="filled-multiline-static"
            label="Description"
            multiline
            rows={4}
            sx={{ mb: 2 }}
            fullWidth
            placeholder='Post Description....'
            variant="filled"
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
            {image.length <=0 ? 'Upload Image' : image?.name}
            <VisuallyHiddenInput type="file" onChange={(e) => setImage(e.target.files[0])} />
          </Button>
          <div className='createPostButtonsContainer'>
            <Button
              fullWidth
              variant="contained"
              sx={{ margin: "10px 0" }}
              disabled={ !image || description.length <= 0 || caption.length <= 0 }
              onClick={() => setPreview(!preview)}
            >
              Preview
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ margin: "10px 0", }}
            >
              Create Post
            </Button>
          </div>
        </Box>
      </Paper>
      <div className='createPostCardContainer'>
        { preview ? <Card sx={{ maxWidth: 345 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                <span>{username.slice(0, 1).toUpperCase()}</span>
              </Avatar>
            }
            title={username}
            subheader={date}
            sx={{ height: 70, padding: '5px 10px' }}
          />
          <CardMedia
            component="img"
            height="294"
            image={URL.createObjectURL(image)}
            alt={caption}
          />
          <CardContent sx={{ padding: '5px 16px' }}>
            <Typography variant="body2" color="text.secondary">
              {caption}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              aria-label="add to favorites"
            >
              <FavoriteIcon style={{ color: 'red'}} />
            </IconButton>
            <IconButton aria-label="share" >
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
        </Card> : 
        <Paper elevation={3} className='imagePreviewContainer'>
          <img src={image.length <= 0 ? altenateImage : URL.createObjectURL(image)} alt="Image Preview"/>
        </Paper> }
      </div>
    </div>
  </>);
}

export default CreatePost;