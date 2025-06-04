import React, { useState } from "react";
import Loading from "../../Loading/Loading";
import PostsCard from "./PostsCard";
import { Blog } from "../../../Context/Context";
import { discoverActions } from "../../../data";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const Posts = () => {
  const { postData, postLoading } = Blog();
  const [displayPostsCount, setDisplayPostCount] = useState(5);

  const posts = postData && postData?.slice(0, displayPostsCount);

  return (
    <section className="flex flex-col gap-[2.5rem]">
      {postLoading ? (
        <Loading />
      ) : (
        postData && posts?.map((post, i) => <PostsCard post={post} key={i} />)
      )}
      <div>
        {posts.length === postData?.length ? (
          <div className=" mt-3 border-t border-gray-400 relative">
            <IoIosCheckmarkCircleOutline size={33} className=" bg-white text-green-400 absolute top-[-16px] right-1/2 translate-x-1/2" />
            <h3 className="font-semibold text-lg text-center mt-5">You're all caught up</h3>
            <p className="text-base mt-1 mb-2 text-center">You've seen all new posts.</p>
          </div>
        ) : (
          ""
        )}

        {postData?.length > 4 && (
          <button
            onClick={() =>
              setDisplayPostCount((prev) =>
                posts.length < postData?.length ? prev + 3 : prev + 0
              )
            }
            className= {`p-2 bg-[#333333] text-white text-sm rounded-3xl ${posts.length === postData?.length ? 'hidden' : 'block'}`}
          >
            show more
          </button>
        )}
      </div>
      <div className=" border-t border-gray-400 flex items-center flex-wrap gap-3 leading-3 mt-10 pt-8 lg:hidden bottom-0">
        {discoverActions.map((item, i) => (
          <button key={i} className="text-md text-gray-500 hover:text-black">
            {item}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Posts;
