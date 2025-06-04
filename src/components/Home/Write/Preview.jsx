import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import ReactQuill from "react-quill";
import TagsInput from "react-tagsinput";
import { toast } from "react-toastify";
import { db } from "../../../firebase/firebase";
import { Blog } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";

const Preview = ({ setPublish, description, title }) => {
  const imageRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [desc, setDesc] = useState("");
  const { currentUser } = Blog();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState({
    title: "",
    photo: "",
  });

  useEffect(() => {
    if (title || description) {
      setPreview((prev) => ({ ...prev, title }));
      setDesc(description);
    } else {
      setPreview({ title: "", photo: "" });
      setDesc("");
    }
  }, [title, description]);

  const handleClick = () => {
    imageRef.current.click();
  };

  // Upload Image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };
  

  const handleSubmit = async () => {
    setLoading(true);
    const previewTitle = preview.title.trim();
    const description = desc.trim();
    try {
      if (!previewTitle || !description || tags.length === 0 || !preview.photo) {
        toast.error("All fields are required!!!",{
          autoClose: 1200
        });
        return;
      }

      if(previewTitle.length < 5){
        toast.error("Title must be at least 5 letters",{
          autoClose: 1200
        });
        return;
      }

      if(description.length < 100){
        toast.error("description must be at least 100 letters",{
          autoClose: 1200
        });
        return;
      }

      let imageUrlToSave = "";
      if (preview.photo) {
        imageUrlToSave = await uploadImageToCloudinary(preview.photo);
      }

      await addDoc(collection(db, "posts"), {
        userId: currentUser?.uid,
        title: preview.title,
        desc,
        tags,
        postImg: imageUrlToSave || "",
        created: Date.now(),
        pageViews: 0,
      });
      toast.success("Post has been added",{
        autoClose: 1200,
      });
      navigate("/");
      setPublish(false);
      setPreview({ title: "", photo: "" });
    } catch (error) {
      toast.error(error.message,{
        autoClose: 1200,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="absolute inset-0 bg-white z-30">
      <div className="size my-[2rem]">
        <span
          onClick={() => setPublish(false)}
          className="absolute right-[1rem] md:right-[5rem] top-[3rem] text-2xl cursor-pointer">
          <LiaTimesSolid />
        </span>
        <div className="mt-[8rem] flex flex-col md:flex-row gap-10">
          <div className="flex-[1]">
            <h3>Story Preview</h3>
            <div
              style={{ backgroundImage: `url(${imageUrl})` }}
              onClick={handleClick}
              className="w-full h-[200px] object-cover bg-gray-100 my-3 grid 
                place-items-center cursor-pointer bg-cover bg-no-repeat">
              {!imageUrl && "Add Image"}
            </div>
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageUrl(URL.createObjectURL(file));
                  setPreview((prev) => ({ ...prev, photo: file }));
                }
              }}
              ref={imageRef}
              type="file"
              hidden
            />
            <input
              type="text"
              placeholder="Title"
              className="outline-none w-full border-b border-gray-300 py-2"
              value={preview.title}
              onChange={(e) =>
                setPreview((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <ReactQuill
              theme="bubble"
              value={desc}
              onChange={setDesc}
              placeholder="Tell Your Story..."
              className="py-3 border-b border-gray-300"
            />
            <p className="text-gray-500 pt-4 text-sm">
              <span className="font-bold">Note:</span> Changes here will affect
              how your story appears in public places like OneBlogs homepage and
              in subscribers’ inboxes — not the contents of the story itself.
            </p>
          </div>
          <div className="flex-[1] flex flex-col gap-4 mb-5 md:mb-0">
            <h3 className="text-2xl">
              Publishing to: <span className="font-bold capitalize">OneBlogs</span>
            </h3>
            <p>
              Add or change tags up to 2 so readers know what your story is
              about
            </p>
            <TagsInput value={tags} onChange={(newTags) => setTags(newTags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)))} />
            <button
              onClick={handleSubmit}
              className="btn !bg-green-800 !w-fit !text-white !rounded-full">
              {loading ? "Submitting..." : "Publish Now"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
