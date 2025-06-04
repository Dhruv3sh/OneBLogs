import React from "react";
import Posts from "../Common/Posts/Posts";
import Follow from "./UserToFollow/Follow";
import Discover from "../Demo/Discover";

const Home = () => {
  return (
    <section className="size flex gap-[5rem] relative">
      <div className="flex-[2] py-10 mb-[4rem]">
        <Posts />
      </div>
      <div className="hidden lg:inline-block md:w-[21rem] p-7 border-l border-gray-300">
        <h3>Who to follow?</h3>
        <Follow />
        <div className=" sticky top-[5rem] mt-8">
        <Discover/>
        </div>
      </div>
    </section>
  );
};

export default Home;
