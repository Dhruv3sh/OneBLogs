import React, { useEffect, useRef, useState } from "react";
import Modal from "../../../utils/Modal";
import { LiaTimesSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { db } from "../../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const EditProfile = ({ editModal, setEditModal, getUserData }) => {
  const imgRef = useRef(null);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    userImg: "",
    bio: "",
  });

  const btn = "border border-green-600 py-2 px-5 rounded-full text-green-600";

  const openFile = () => {
    imgRef.current.click();
  };

  // Load user data into the form
  useEffect(() => {
    if (getUserData) {
      setForm(getUserData);
    } else {
      setForm({ username: "", bio: "", userImg: "" });
    }
  }, [getUserData]);

  // Handle Cloudinary image upload
  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary credentials are missing!",{
        autoClose: 1200
      });
      return null;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      return data.secure_url; // Cloudinary uploaded image URL
    } catch (error) {
      toast.error("Image upload failed",{
        autoClose: 1200
      });
      return null;
    }
  };
  

  // Save form data
  const saveForm = async () => {
    if (form.username.trim() === "" || form.bio.trim() === "") {
      toast.error("All inputs are required!!!",{
        autoClose: 1200
      });
      return;
    }

    setLoading(true);

    let uploadedImageUrl = form.userImg; // Keep existing image if no new upload

    if (imgUrl) {
      const imageUrl = await uploadToCloudinary(form.userImg);
      if (!imageUrl) {
        setLoading(false);
        return;
      }
      uploadedImageUrl = imageUrl;
    }

    try {
      const docRef = doc(db, "users", getUserData?.userId);
      await updateDoc(docRef, {
        bio: form.bio,
        username: form.username,
        userImg: uploadedImageUrl,
        userId: getUserData?.userId,
      });

      setLoading(false);
      setEditModal(false);
      toast.success("Profile has been updated",{
        autoClose: 1200
      });
    } catch (error) {
      toast.error(error.message,{
        autoClose: 1200
      });
      setLoading(false);
    }
  };

  return (
    <Modal modal={editModal} setModal={setEditModal}>
      <div className="center w-[95%] md:w-[45rem] bg-white mx-auto shadows my-[1rem] z-20 mb-[3rem] p-[2rem]">
        {/* Head */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Profile Information</h2>
          <button onClick={() => setEditModal(false)} className="text-xl">
            <LiaTimesSolid />
          </button>
        </div>

        {/* Body */}
        <section className="mt-6">
          <p className="pb-3 text-sm text-gray-500">Photo</p>
          <div className="flex gap-[2rem]">
            <div className="w-[5rem]">
              <img
                className="min-h-[5rem] min-w-[5rem] object-cover border border-gray-400 rounded-full"
                src={imgUrl || form.userImg || "/profile.jpg"}
                alt="profile-img"
              />
              <input
                onChange={(e) => {
                  setImgUrl(URL.createObjectURL(e.target.files[0]));
                  setForm({ ...form, userImg: e.target.files[0] });
                }}
                accept="image/jpg, image/png, image/jpeg"
                ref={imgRef}
                type="file"
                hidden
              />
            </div>
            <div>
              <div className="flex gap-4 text-sm">
                <button onClick={openFile} className="text-green-600">
                  Update
                </button>
                <button
                  onClick={() => {
                    setImgUrl("");
                    setForm({ ...form, userImg: "" });
                  }}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
              <p className="w-full sm:w-[20rem] text-gray-500 text-sm pt-2">
                Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per
                side.
              </p>
            </div>
          </div>
        </section>

        {/* Profile Edit Form */}
        <section className="pt-[1rem] text-sm">
          <label className="pb-3 block">Name*</label>
          <input
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            value={form.username}
            type="text"
            placeholder="Username..."
            className="p-1 border-b border-black w-full outline-none"
            maxLength={50}
          />
          <p className="text-sm text-gray-600 pt-2">
            Appears on your Profile page, as your byline, and in your responses. {form.username.length}/50
          </p>
        </section>

        <section className="pt-[1rem] text-sm">
          <label className="pb-3 block">Bio*</label>
          <input
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            value={form.bio}
            type="text"
            placeholder="Bio..."
            className="p-1 border-b border-black w-full outline-none"
            maxLength={160}
          />
          <p className="text-sm text-gray-600 pt-2">
            Appears on your Profile and next to your stories. {form.bio.length}/160
          </p>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 pt-[2rem]">
          <button onClick={() => setEditModal(false)} className={btn}>
            Cancel
          </button>
          <button
            onClick={saveForm}
            className={`${btn} bg-green-800 text-white ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfile;
