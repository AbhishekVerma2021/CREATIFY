const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const Post = require("../models/postModel");
// const authenticate = require("../middleware/auth");
const uploadImageService = require('../Services/uploadImage');
const { uploadImageToCloudinary } = uploadImageService;

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const isExist = await Users.findOne({ email });

    if (isExist) {
      res.status(400).send("User already exists");
    } else {
      const user = new Users({
        username,
        email,
      });

      bcryptjs.hash(password, 10, (err, hashedPassword) => {
        if (err) next(err);
        user.set("password", hashedPassword);

        user.save()
          .then(() => {
            res.status(200).send("Successfully registered");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Server Error");
          });
      });
    }
  } catch (error) {
    res.status(500).send("Server Error");
    console.log(error, "error");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      res.status(401).send("Email is invalid");
    } else {
      const validate = await bcryptjs.compare(password, user.password);

      if (!validate) {
        res.status(401).send("Password is invalid");
      } else {
        const payload = {
          id: user._id,
          username: user.username,
        };

        const JWT_SECRET_KEY =
          process.env.JWT_SECRET_KEY || "THIS_IS_THE_SECRET_KEY_OF_JWT";

        jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 86400 }, (err, token) => {
          if (err) {
            res.json({ message: err });
          } else {
            return res.status(200).json({ user, token });
          }
        });
      }
    }
  } catch (error) {
    res.status(500).send("Server Error");
    console.log(error, "error");
  }
};

const validateToken = async (req, res) => {
  const { username, email, _id, followers, following, favorites, image } = req.user;
  const favouritePostIdArray = favorites.map((obj) => obj.postId);
  const favouritePostArray = await Promise.all(
    favouritePostIdArray.map(async (postId) => {
      const post = await Post.findById(postId).populate(
        "user",
        "_id username email image"
      );
      return post;
    })
  );
  const user = {
    username,
    email,
    _id,
    followers,
    following,
    favorites,
    image,
  };

  res.status(200).send({ user, favoritePosts: favouritePostArray });
};

const followUser = async (req, res) => {
  try {
    // console.log(req.body)
    const { user } = req;
    const { followedAcountId } = req.body;
    const { _id } = user;

    console.log('followed account id : ', followedAcountId)
    if (followedAcountId === undefined)
      res.send('Mention followed account Id');

    const followedAcount = await Users.findById(followedAcountId);
    const userAccount = await Users.findById(_id);
    if (!followedAcount)
      res.send('Followed account does not exist');
    else {
      const followingArrayOfUser = userAccount.following.map((obj) => obj.uId);
      if (followingArrayOfUser.includes(followedAcountId)) {
        userAccount.following = userAccount.following.filter(
          (item) => item.uId.toString() !== followedAcountId.toString()
        );

        await userAccount.save();

        // Similarly, remove the user's ID from the followers array of followedAcount
        followedAcount.followers = followedAcount.followers.filter(
          (item) => item.uId.toString() !== _id.toString()
        );

        await followedAcount.save();

        return res.send({ followers: userAccount.followers, following: userAccount.following })
      }
      else {
        const followingOfUser = {
          uId: followedAcountId,
          username: followedAcount.username,
          email: followedAcount.email,
        }
        userAccount.following.push(followingOfUser);
        await userAccount.save();
        const followedAccountsFollower = {
          uId: _id,
          username: userAccount.username,
          email: userAccount.email,
        }
        followedAcount.followers.push(followedAccountsFollower);
        await followedAcount.save();
        res.send({ followers: userAccount.followers, following: userAccount.following })
      }

    }

  }
  catch (er) {
    console.log('error', er);
    res.send(er);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await Users.find({}, "username email _id");
    res.send({ users: allUsers });
  } catch (er) {
    res.send(er);
  }
};
const getUserProfile = async (req, res) => {
  try {
    const { user } = req;
    const { _id } = req.query;

    let userId = _id != "undefined" ? _id : user._id;

    let otherAccountFlag = user._id.toHexString() !== _id;
    const posts = await Post.find({ user: userId }).populate(
      "user",
      "username"
    );
    const userDetails = await Users.findById({ _id: userId }).select(`-password ${otherAccountFlag ? '-favorites' : ''}`);
    // console.log(userDetails)
    res.status(200).json({ posts, userDetails, otherAccountFlag });
  } catch (error) {
    res.status(200).send(error);
  }
};

const uploadProfilePhoto = async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Please provide an image!',
    });
  }

  // Ideally, check if the image is a valid format and not too large etc.

  try {
    const imageUrl = await uploadImageToCloudinary(image);
    if (!imageUrl) {
      throw new Error('Image upload failed');
    }
    const userAccount = await Users.findOne({ _id: req.user._id });
    if (!userAccount) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found!',
      });
    }

    userAccount.image = imageUrl;
    const userWithProfileImage = await userAccount.save();
    console.log(userWithProfileImage)
    res.status(200).json({
      user: userWithProfileImage,
      message: 'Profile photo uploaded successfully',
    });
  } catch (err) {
    console.error(err); // Log the error for server-side review
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while uploading the profile photo.',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  validateToken,
  followUser,
  getAllUsers,
  uploadProfilePhoto,
  getUserProfile,
};
