import { useState } from "react";
import { Modal, Tab, Tabs, CloseButton, Image } from "react-bootstrap";
import ReactionsListUser from "./ReactionsListUser";

function ReactionsInfo({ show, handleClose, reactions }) {
  const [key, setKey] = useState("all");

  // console.log("reactions", reactions);
  const uniqueReactionTypes = reactions.reduce((acc, item) => {
    // Kiểm tra xem type đã tồn tại trong accumulator chưa
    const existingType = acc.find((reaction) => reaction.type === item.type);

    if (existingType) {
      // Nếu type đã tồn tại, tăng total lên 1
      existingType.total += 1;
    } else {
      // Nếu type chưa tồn tại, thêm type mới vào accumulator
      acc.push({ type: item.type, total: 1 });
    }

    return acc;
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Modal.Body style={{ position: "relative" }}>
            <div
              data-bs-theme="light" //
              className="bg-light p-1"
              onClick={handleClose}
              style={{ position: "absolute", right: "12px", borderRadius: "999px", cursor: "pointer" }}
            >
              <CloseButton />
            </div>
            <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3 hk">
              <Tab eventKey="all" title="Tất cả">
                <div>
                  {reactions.map((reaction, index) => (
                    <ReactionsListUser data={reaction} key={index} />
                  ))}
                </div>
              </Tab>
              {uniqueReactionTypes.map((reaction, index) => (
                <Tab
                  key={reaction.type} // Sử dụng reaction.type làm key
                  eventKey={reaction.type} // Sử dụng reaction.type
                  title={
                    <div className="d-flex justify-content-center align-items-center gap-1">
                      <Image
                        src={`/images/${reaction.type}.svg`} // Sử dụng reaction.type
                        alt="Thích"
                        width={24}
                        height={"auto"}
                        style={{ cursor: "pointer" }}
                      />
                      <span>{reaction.total}</span> {/* Hiển thị tổng số lượng reactions */}
                    </div>
                  }
                >
                  {/* Lọc các reactions theo type và hiển thị danh sách người dùng */}
                  {reactions
                    .filter((item) => item.type === reaction.type)
                    .map((item, ix) => (
                      <ReactionsListUser data={item} key={item.id || ix} /> // Sử dụng item.id làm key
                    ))}
                </Tab>
              ))}
            </Tabs>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
}

export default ReactionsInfo;
