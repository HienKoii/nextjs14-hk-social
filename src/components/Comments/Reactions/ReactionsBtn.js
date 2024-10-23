import React, { useState } from "react";

import { convertReactionTypeContent, getColorReactionType, isToken } from "@/src/utils";
import { useUser } from "@/src/context/UserContext";
import ReactionsAvailable from "./ReactionsAvailable";

export default function ReactionsBtn({ reactions, commentId }) {
  const { user } = useUser();
  const [isHolding, setIsHolding] = useState(false);

  const findUserReactions = reactions?.find((item) => item.user_id === user?.id);

  const color = getColorReactionType(findUserReactions?.type);
  return (
    <>
      <button
        disabled={!isToken() ? true : false}
        className="btn btn-hk-reaction" //
        onMouseEnter={() => setIsHolding(true)}
        onMouseLeave={() => setIsHolding(false)}
      >
        {findUserReactions ? <span style={{ color: `${color}` }}>{convertReactionTypeContent(findUserReactions?.type)}</span> : "Thích"}
        <div className={`available ${isHolding ? "show" : ""}`}>
          <div className={`available-wrapper ${isHolding ? "show" : ""}`}>
            <ReactionsAvailable commentId={commentId} userId={user?.id} />
          </div>
        </div>
      </button>
    </>
  );
}
