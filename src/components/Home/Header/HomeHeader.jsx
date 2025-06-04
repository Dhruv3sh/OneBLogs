import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { LiaEditSolid } from "react-icons/lia";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Search from "./Search";
import Modal from "../../../utils/Modal";
import UserModal from "./UserModal";
import { Blog } from "../../../Context/Context";
import Loading from "../../Loading/Loading";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { toast } from "react-toastify";

const HomeHeader = () => {
  const { allUsers, userLoading, currentUser, setPublish, title, description } =
    Blog();
  const [modal, setModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();
  const getUserData = allUsers?.find((user) => user.id === currentUser?.uid);

  const editPath = pathname.split("/")[1];
  const postId = pathname.split("/")[2];

  const navigate = useNavigate(null);

  const handleEdit = async () => {
    try {
      setLoading(true);
      const ref = doc(db, "posts", postId);
      await updateDoc(ref, {
        title,
        desc: description,
      });
      navigate(`/post/${postId}`);
      toast.success("Post has been updated");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className=" bg-white border-b border-gray-200 sticky top-0 z-50 ">
      {userLoading && <Loading />}
      <div className="size h-[70px] flex items-center justify-between">
        {/* left side  */}
        <div className="flex items-center gap-3">
          <Link to={"/"}>
            <img src="../icon.png" alt="icon" className="max-w-[2rem]" />
          </Link>
          <Search modal={searchModal} setModal={setSearchModal} />
        </div>
        {/* right side  */}
        <div className="flex items-center gap-3 sm:gap-7">
          <span
            onClick={() => setSearchModal(true)}
            className="flex sm:hidden text-3xl text-gray-300 cursor-pointer"
          >
            <CiSearch />
          </span>
          {pathname === "/write" ? (
            <button
              onClick={() => setPublish(true)}
              className="btn !bg-green-700 !py-1 !text-white !rounded-full"
            >
              Publish
            </button>
          ) : editPath === "editPost" ? (
            <button
              onClick={handleEdit}
              className={`btn !bg-green-700 !py-1 !text-white !rounded-full
              ${loading ? "opacity-40" : ""}
              `}
            >
              {loading ? "Updating..." : "Save and Update"}
            </button>
          ) : (
            <Link
              to="/write"
              className="hidden md:flex items-center gap-1 text-gray-500"
            >
              <span className="text-3xl">
                <LiaEditSolid />
              </span>
              <span className="text-sm mt-2 select-none">Write</span>
            </Link>
          )}

          <div className="flex items-center relative">
            {getUserData ? (
              <img
                onClick={() => setModal(true)}
                className="w-[2.3rem] h-[2.3rem] object-cover rounded-full cursor-pointer select-none"
                src={getUserData.userImg}
                alt="profile-img"
              />
            ) : (
              <img
                onClick={() => setModal(true)}
                className="w-[2.3rem] h-[2.3rem] object-cover rounded-full cursor-pointer select-none"
                src="../profile.jpg"
                alt="profile-img"
              />
            )}
            <span className="text-gray-500 cursor-pointer">
              <MdKeyboardArrowDown />
            </span>
            <Modal modal={modal} setModal={setModal} visibility={'0'}>
              <div
                className={`${
                  modal ? "visible opacity-100%" : "invisible opacity-0"
                } `}
              >
                <UserModal setModal={setModal} />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
