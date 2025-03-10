import { useState } from "react";
import { formatDistance } from "date-fns";

export const SingleMessage = ({ singleMessage, fetchPosts }) => {
  const [numLikes, setNumLikes] = useState(singleMessage.hearts); // Initial hearts state
  const [liked, setLiked] = useState(false); // Initial liked state

  const timeSincePosted = formatDistance(
    new Date(singleMessage.createdAt),
    new Date(),
    { addSuffix: true }
  );

  const onLikeIncrease = () => {
    const options = {
      method: "POST",
    };

    fetch(`${import.meta.env.VITE_API_URL}/thoughts/${singleMessage._id}/like`, options)
      .then((response) => response.json())
      .then(() => {
        setNumLikes(numLikes + 1);
        setLiked(true);
        fetchPosts();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="message">
      <p key={singleMessage._id}>{singleMessage.text}</p> {/* Use "text" instead of "message" */}
      <div className="info-wrapper">
        <div className="info-like">
          <button
            type="button"
            id="likeBtn"
            onClick={onLikeIncrease}
            className={liked ? "like-button liked" : "like-button"}
          >
            <span className="emoji" aria-label="like button">
              &#x2665;
            </span>
          </button>
          <span className="num-likes">x{numLikes}</span>
        </div>
        <div className="info-time">{timeSincePosted}</div>
      </div>
    </div>
  );
};
