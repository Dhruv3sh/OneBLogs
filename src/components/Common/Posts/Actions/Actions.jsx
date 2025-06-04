import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import DropDown from "../../../../utils/DropDown";
import { useNavigate } from "react-router-dom";
import { Blog } from "../../../../Context/Context";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { toast } from "react-toastify";

const Actions = ({ postId, title, desc }) => {
  const { setUpdateData, currentUser } = Blog();
  const [showDrop, setShowDrop] = useState(false);
  const navigate = useNavigate(null);

  const handleEdit = () => {
    navigate(`/editPost/${postId}`);
    setUpdateData({ title, description: desc });
  };

  const handleRemove = async () => {
    try {
      const ref = doc(db, "posts", postId);
      const likeRef = doc(db, "posts", postId, "likes", currentUser?.uid);
      const commentRef = doc(db, "posts", postId, "comments", currentUser?.uid);
      const savedPostRef = doc(
        db,
        "users",
        currentUser?.uid,
        "savedPost",
        postId
      );
      await deleteDoc(ref);
      await deleteDoc(likeRef);
      await deleteDoc(commentRef);
      await deleteDoc(savedPostRef);

      toast.success("post has been removed");
      setShowDrop(false);
      navigate("/");
    } catch (error) {
      toast.success(error.message);
    }
  };
  return (
    <div className="relative">
      <button onClick={() => setShowDrop(!showDrop)}>
        <BsThreeDots className="text-2xl" />
      </button>
      <DropDown showDrop={showDrop} setShowDrop={setShowDrop} size="w-[7rem]">
        <button
          onClick={handleEdit}
          className="p-2 hover:bg-gray-100 w-full text-sm text-left">
          Edit Story
        </button>
        <button
          onClick={handleRemove}
          className="p-2 hover:bg-gray-100  w-full text-sm text-left text-red-600">
          Delete Story
        </button>
      </DropDown>
    </div>
  );
};

export default Actions;
