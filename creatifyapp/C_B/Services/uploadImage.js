const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dbqsuayy3',
  api_key: '125826582571632',
  api_secret: 'kZUp0OegPy94_xq9ru_kWZ77XIc',
});
// CLOUDINARY_URL=cloudinary://125826582571632:kZUp0OegPy94_xq9ru_kWZ77XIc@dbqsuayy3
const options = {
  overwrite: true,
  invalidate: true,
  resourceType: 'auto',
};

const uploadImageToCloudinary = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, options, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      };
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

module.exports = {
  uploadImageToCloudinary,
}