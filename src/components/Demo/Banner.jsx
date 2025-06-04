import React from "react";
import { TypeAnimation } from "react-type-animation";
import { Blog } from "../../Context/Context";
import Auth from "./Auth/Auth";

const Banner = () => {

    const { authModel, setAuthModel } = Blog();

  return (
    <div className="bg-[#F7F4ED] border-b border-black relative ">
      <div className="size py-[5rem] flex flex-col items-start gap-[1rem]">
        <TypeAnimation
              sequence={[
                "Stay Curious.",
                2000,
                "Read Wider.",
                1000,
              ]}
              speed={50}
              repeat={Infinity}
              className="font-title text-[3rem] sm:text-[4rem] md:text-[6rem] font-normal"
            />
        <p className="w-full md:w-[31rem] text-[1.3rem] md:text-[1.5rem] font-medium leading-7">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
        <Auth modal={authModel} setModal={setAuthModel} />
        <button className="btn bg-black1 rounded-full text-white !text-[1.2rem] !px-6 !mt-[2.5rem]" onClick={() => setAuthModel(true)}>
          Start reading
        </button>
      </div>
      <div className="absolute top-0 right-[4.5rem] hidden lg:block" >
        <img src="../demoBannerImg.webp" alt="img" width='360' />
      </div>
    </div>
  );
};

export default Banner;
