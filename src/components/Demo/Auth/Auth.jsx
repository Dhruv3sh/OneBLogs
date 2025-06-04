import React, { useState } from "react";
import Modal from "../../../utils/Modal";
import { LiaTimesSolid } from "react-icons/lia";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineMail } from "react-icons/ai";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Auth = ({ modal, setModal }) => {
  const [createUser, setCreateUser] = useState(false);
  const [signReq, setSignReq] = useState("");
  const navigate = useNavigate();

  const googleAuth = async () => {
    try {
      const createUser = await signInWithPopup(auth, provider);
      const newUser = createUser.user;
      const ref = doc(db, "users", newUser.uid);
      const userDoc = await getDoc(ref);

      if (!userDoc.exists()) {
        await setDoc(ref, {
          userId: newUser?.uid,
          username: newUser?.displayName,
          email: newUser?.email,
          userImg: newUser?.photoURL,
          bio: "",
        });
      }
      setModal(false);
      navigate("/");
      toast.success("User have been Signed in", {
        autoClose: 1200,
      });
    } catch (error) {
      toast.error(
        error.message.split("auth/")[1].split(")")[0].replace(/-/g, " "),
        {
          autoClose: 1200,
        }
      );
    }
  };

  return (
    <Modal modal={modal} setModal={setModal} visibility={"100"}>
      <section
        className={`z-50 fixed top-0 bottom-0 left-0 md:left-[8rem]
        overflow-auto right-0 md:right-[8rem] bg-white shadow-[0px_0px_8px_rgba(0,0,0,0.2)] transition-all duration-400
        ${modal ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <button
          onClick={() => setModal(false)}
          className="absolute top-8 right-8 text-2xl hover:opacity-50"
        >
          <LiaTimesSolid />
        </button>
        <div className=" mt-6 flex flex-col justify-center items-center gap-[3rem]">
          {signReq === "" ? (
            <>
              <h1 className="text-3xl pt-[6rem] pb-4 font-serif">
                {createUser ? "Join OneBlogs." : "Welcome Back."}
              </h1>
              <div className="flex flex-col gap-2 w-fit mx-auto">
                <button
                  onClick={googleAuth}
                  className="flex items-center justify-center gap-2 sm:w-[20rem] border border-black px-3 py-2 rounded-full"
                >
                  <FcGoogle className="text-xl" />
                  {`${createUser ? "Sign Up" : "Sign In"} With Google`}
                </button>
                <button
                  onClick={() => setSignReq(createUser ? "sign-up" : "sign-in")}
                  className="flex items-center justify-center gap-2 sm:w-[20rem] border border-black px-3 py-2 rounded-full"
                >
                  <AiOutlineMail className="text-xl" />
                  {`${createUser ? "Sign Up" : "Sign In"} With Email`}
                </button>
              </div>
              <p>
                {createUser ? "Already have an account?" : "No Account?"}
                <button
                  onClick={() => setCreateUser(!createUser)}
                  className="text-green-600 hover:text-green-700 font-bold ml-1"
                >
                  {createUser ? "Sign In" : "Create one"}
                </button>
              </p>
            </>
          ) : signReq === "sign-in" ? (
            <SignIn setModal={setModal} setSignReq={setSignReq} />
          ) : signReq === "sign-up" ? (
            <SignUp setModal={setModal} setSignReq={setSignReq} />
          ) : null}
          <p className="md:w-[30rem] mx-auto text-center text-sm mb-[3rem] text-black opacity-60">
            Click “Sign In” to agree to OneBlogs Terms of Service and
            acknowledge that OneBlogs Privacy Policy applies to you.
          </p>
        </div>
      </section>
    </Modal>
  );
};

export default Auth;
