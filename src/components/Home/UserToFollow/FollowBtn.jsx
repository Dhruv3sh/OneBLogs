import React, { useEffect, useState } from "react";
import { Blog } from "../../../Context/Context";
import { db } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import useSingleFetch from "../../hooks/useSingleFetch";
import { useLocation } from "react-router-dom";

const FollowBtn = ({ userId }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const { currentUser } = Blog();

  const { data } = useSingleFetch(
    "users",
    currentUser?.uid,
    "follows"
  );

  useEffect(() => {
    setIsFollowed(data && data?.findIndex((item) => item.id === userId) !== -1);
  }, [data]);

  const handleFollow = async () => {
    try {
      if (currentUser) {
        const followRef = doc(db, "users", currentUser?.uid, "follows", userId);
        const followerRef = doc(
          db,
          "users",
          userId,
          "followers",
          currentUser?.uid
        );
        if (isFollowed) {
          await deleteDoc(followRef);
          await deleteDoc(followerRef);
          toast.dismiss();
          toast.success("User is unFollowed",{
            autoClose: 1200,
          });
        } else {
          await setDoc(followRef, {
            userId: userId,
          });
          await setDoc(followerRef, {
            userId: userId,
          });
          toast.dismiss();
          toast.success("User is Followed",{
            autoClose: 1200,
          });
        }
      }
    } catch (error) {
      console.log(error.message)
      toast.dismiss();
      toast.error(error.message,{
        autoClose: 1200,
      });
    }
  };

  const { pathname } = useLocation();

  return (
    <>
      <button
        onClick={handleFollow}
        className={`${
          pathname === "/" ? "border border-black" : ""
        } px-3 py-[0.2rem] rounded-full
        ${isFollowed ? "text-gray-500 border-none" : ""}`}>
        {isFollowed ? "Following" : "Follow"}
      </button>
    </>
  );
};

export default FollowBtn;
