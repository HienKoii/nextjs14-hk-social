import { Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useState } from "react";

import { convertReactionTypeContent, isToken } from "@/src/utils";
import { useUser } from "@/src/context/UserContext";
import ReactionsInfo from "./ReactionsInfo";
// Dùng React.memo để tối ưu hóa việc re-render
const ReactionsShow = React.memo(function ReactionsShow({ reactions, totalReactions, showInfo }) {
  const { user } = useUser();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const findUserUseReaction = reactions.find((item) => {
    return item?.user_id === user?.id;
  });
  // console.log("findUserUseReaction", findUserUseReaction);

  const renderTooltip = (reactionType, fullName) => (
    <Tooltip id="tooltip-fade" className="fade-tooltip">
      <div className="w-100 fw-bold text-start">{convertReactionTypeContent(reactionType)} </div>
      <ul>
        <li>{fullName}</li>
      </ul>
    </Tooltip>
  );

  return (
    <>
      {(() => {
        const displayedReactions = new Set();
        return reactions?.map((reaction, index) => {
          if (!displayedReactions.has(reaction?.type)) {
            // Nếu loại reaction chưa hiển thị thì thêm vào Set và hiển thị icon
            displayedReactions.add(reaction?.type);
            return (
              <OverlayTrigger
                key={index} //
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(reaction?.type, reaction?.fullName)}
              >
                <Image
                  src={`/images/${reaction?.type}.svg`} //
                  alt="Thích"
                  width={24}
                  height={"auto"}
                  style={{ cursor: "pointer" }}
                  onClick={handleShow}
                />
              </OverlayTrigger>
            );
          }
          // Nếu đã hiển thị thì bỏ qua
          return null;
        });
      })()}
      {showInfo && (
        <span className="px-2 text-muted">
          {}
          {isToken() && findUserUseReaction && totalReactions > 1 ? <> {`Bạn và ${totalReactions - 1} người khác`} </> : <> {totalReactions}</>}
        </span>
      )}

      <ReactionsInfo show={show} handleClose={handleClose} reactions={reactions} />
    </>
  );
});

export default ReactionsShow;
