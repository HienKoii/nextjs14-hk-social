import { useEffect, useState } from "react";
import { Button, Nav, Tab } from "react-bootstrap";

import ImagesGallery from "../Gallery/ImagesGallery";
import { useUser } from "@/src/context/UserContext";
import ImagesLoading from "../Images/ImagesLoading";

export default function ProfileShowImgs({ userLogin, userProfile }) {
  const { fetchImgsUerId, dataImgs, loadingImgs } = useUser();
  const [select, setSelect] = useState("avatar");

  const handleSelect = (key) => {
    setSelect(key); // Cập nhật giá trị eventKey khi click
  };

  useEffect(() => {
    fetchImgsUerId(select, userProfile?.id);
  }, [select, userProfile?.id]);

  const renderImages = () => {
    return dataImgs?.url?.length > 0 ? (
      <>
        <ImagesGallery data={dataImgs} classImg={"img-wrapper-item"} isDropdown={userLogin?.id === userProfile?.id} />
      </>
    ) : (
      <p>Chưa có ảnh nào</p>
    );
  };

  if (loadingImgs) {
    return (
      <>
        <ImagesLoading />
      </>
    );
  }

  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey={select} onSelect={handleSelect}>
      <>
        <Nav variant="pills" style={{ flexWrap: "nowrap" }} className="mb-3 gap-2">
          <Nav.Item
            as={Button} //
            className="w-100 text-center p-0"
            variant="outline-primary"
            onClick={() => fetchImgsUerId(select, userProfile?.id)}
          >
            <Nav.Link eventKey="avatar" className="w-100">
              Ảnh đại diện
            </Nav.Link>
          </Nav.Item>
          <Nav.Item
            as={Button}
            className="w-100 text-center p-0" //
            variant="outline-primary"
            onClick={() => fetchImgsUerId(select, userProfile?.id)}
          >
            <Nav.Link eventKey="background" className="w-100">
              Ảnh bìa
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </>
      <div>
        <Tab.Content>
          <Tab.Pane eventKey="avatar">{renderImages()}</Tab.Pane>
          <Tab.Pane eventKey="background">{renderImages()}</Tab.Pane>
        </Tab.Content>
      </div>
    </Tab.Container>
  );
}
