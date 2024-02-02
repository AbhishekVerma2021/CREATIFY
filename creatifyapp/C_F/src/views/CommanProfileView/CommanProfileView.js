import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import AvatarIcon from '../../images/avatar.svg';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import IconButton from '@mui/material/IconButton';
import {
  Button,
  Paper,
  Collapse,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  CircularProgress,
} from "@mui/material";
import CircularLoader from "../../LoadersAndShimmers/CircularLoader";
import ProfilePageShimmers from "../../LoadersAndShimmers/ProfilePageShimmers";

import CommanPostCard from './CommanPostCard';
import './CommanProfileView.css';
import LineLoader from "../../LoadersAndShimmers/LineLoader";



const CommanProfileView = (props) => {

  const [follow, setFollow] = useState(false);

  const {
    activeUserDetails,
    selectedUserId,
    followAccount,
    selectedUserProfileDetails,
    isLoading,
  } = props;


  const {
    fetchedProfileUsername,
    fetchedProfileEmail,
    fetchedProfileId,
    fetchedProfilePosts,
    fetchedProfileFollowers,
    fetchedProfileFollowing,
  } = selectedUserProfileDetails;

  const { username, _id } = activeUserDetails;
  const activeUserId = _id;
  useEffect(() => {
    const { following } = activeUserDetails;
    let followFlag = false;
    following && following.length > 0 && following.map((account) => {
      // console.log(accountId, fetchedProfileId)
      if (account.uId === fetchedProfileId) {
        followFlag = true;
      }
    });
    setFollow(followFlag);
  }, [activeUserDetails, selectedUserProfileDetails])




  const handleFollowClick = async () => {
    try {
      await followAccount(selectedUserId);
    } catch (e) {
      alert('Something went wrong')
    }
  }

  return (
    <div className="masterCommanProfilePageContainer">
      <div className="commanProfilePageCOntiner">
        <div className="profilePhoto">
          <Avatar
            alt={fetchedProfileUsername}
            src={AvatarIcon}
            sx={{ width: 150, height: 150 }}
          />
        </div>
        <div className="masterProfileDetailsContiner">
          <div className="profileHeaderContainer">
            <div className="profileUsernameContainer">
              {isLoading ? <LineLoader fontSize='1.1rem' width='100px'/> : fetchedProfileUsername}
            </div>
            <IconButton aria-label="settings" onClick={() => handleFollowClick()}>
              {follow ? <PersonRemoveIcon /> : <PersonAddIcon />}
            </IconButton>
            <Button onClick={() => alert('Comming Soon')}>Message</Button>
          </div>
          <div className="profilePostsFollowersContainer">
            <Paper elevation={3} className="paperBlocks">
              <span>Posts</span>
              <span>{isLoading ? <CircularLoader size='20px' /> : fetchedProfilePosts && fetchedProfilePosts.length}</span>
            </Paper>
            <Paper elevation={3} className="paperBlocks">
              <span>Followers</span>
              <span>{isLoading ? <CircularLoader size='20px' /> : fetchedProfileFollowers && fetchedProfileFollowers.length}</span>
            </Paper>
            <Paper elevation={3} className="paperBlocks">
              <span>Following</span>
              <span>{isLoading ? <CircularLoader size='20px' /> : fetchedProfileFollowing && fetchedProfileFollowing.length}</span>
            </Paper>
          </div>
          <div className="profileFurtherDetailsContainer">
            <span>{isLoading ? <LineLoader width={'60%'}/> : fetchedProfileEmail}</span>
          </div>
        </div>
      </div>
      <div className="hrCOntainer">
        <hr className="profileHr" />
      </div>
      <div className="commanProfilePostsContainer">
        {isLoading ? <ProfilePageShimmers count={3} /> : fetchedProfilePosts && fetchedProfilePosts.length > 0 && fetchedProfilePosts.map((post) => {
          return <CommanPostCard post={post} />
        })}
      </div>
      {isLoading && <CircularLoader />}
    </div>
  );
};

export default CommanProfileView;
// <Card sx={{ minWidth: "35vw", margin: "40px 0" }}>
//   <CardHeader
//     onClick={() => handleProfileViewClick()}
//     avatar={
//       <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
//         {username.slice(0, 1).toUpperCase()}
//       </Avatar>
//     }
//     action={
//       postUserId !== userId && <IconButton aria-label="settings" onClick={() => handleFollowClick()}>
//         {follow ? <PersonRemoveIcon /> : <PersonAddIcon />}
//       </IconButton>
//     }
//     className='postHeader'
//     sx={{ fontWeight: "700", cursor: "pointer" }}
//     title={username}
//     subheader={formattedDate}
//   />
//   <div className='postImageConatiner'>
//     <img src={image} alt="" />
//   </div>
//   <CardContent>
//     <Typography variant="body2" sx={{ fontSize: "20px", color: "black" }} color="text.secondary">
//       {caption}
//     </Typography>
//   </CardContent>
//   <CardActions disableSpacing>
//     <IconButton
//       aria-label="add to favorites"
//       onClick={() => handleLikes()}
//     >
//       <FavoriteIcon style={{ color: like ? 'red' : 'inherit' }} />
//     </IconButton>
//     <IconButton onClick={() => handleCommentDialog()}>
//       <CommentIcon />
//     </IconButton>
//     <IconButton aria-label="share">
//       <ShareIcon />
//     </IconButton>
//     <ExpandMore
//       expand={expanded}
//       onClick={handleExpandClick}
//       aria-expanded={expanded}
//       aria-label="show more"
//     >
//       <ExpandMoreIcon />
//     </ExpandMore>
//   </CardActions>
//   <Collapse in={expanded} timeout="auto" unmountOnExit>
//     <CardContent sx={{ width: '35vw' }}>
//       {description}
//     </CardContent>
//   </Collapse>
// </Card>
// {openCommentDialog && <CommentDialog postId={postId} comments={comments} handleCommentDialog={handleCommentDialog} />}