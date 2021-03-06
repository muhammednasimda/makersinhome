import axios from "axios";
import axios_seller from "./axios-seller";
import { apiRoot } from "../config";
import firebase from "../firebase";

//sign in user
export const signinUserAPI = async (loginUsername, loginPassword) => {
  const response = await axios({
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      phone: loginUsername,
      password: loginPassword,
    },
    url: `${apiRoot}/seller/login`,
  });
  return response;
};

//get all info of loginned user
export const getUserInfo = async () => {
  try {
    return await axios_seller.get(`/seller/store`);
  } catch (error) {
    console.log(error);
  }
};

//get info about user store

export const getStoreInfoAPI = async () => {
  let response = await axios_seller.get(`/seller/store`);
  console.log(response);
  return response;
};

//upload user profile image to server

export const uploadProfileImageAPI = async (imagesLocal, oldprofileimage) => {
  console.log(imagesLocal);

  //upload image to firebase
  try {
    const imageRefProfile = firebase
      .storage()
      .ref()
      .child(`profile_images/${imagesLocal[0].name}`);
    await imageRefProfile.put(imagesLocal[0]);

    //update database
    const apiResponse = await axios_seller.post(`/seller/store/addprofile/`, {
      profile_image: imagesLocal[0].name,
    });

    //delete old profile image
    const imageRefDelete = firebase
      .storage()
      .ref()
      .child(`profile_images/${oldprofileimage}`);
    await imageRefDelete.delete();
  } catch (error) {
    console.log(error);
    return error;
  }
};
