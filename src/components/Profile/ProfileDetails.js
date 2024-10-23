"use client";
import { isToken } from "@/src/utils";
import { Button, Image } from "react-bootstrap";

const ProfileDetails = ({ userLogin, userProfile }) => {
  // console.log("userProfile", userProfile);
  // console.log("userLogin", userLogin);
  return (
    <>
      <ul className="d-flex flex-column gap-3">
        <li className="d-flex justify-content-start align-items-center gap-2">
          <Image
            src={`/images/2HSjONuOSNc.png`} //
            alt="Avatar"
            width={20}
          />
          <span>
            Sống tại <strong> Bắc Ninh</strong>
          </span>
        </li>

        <li className="d-flex justify-content-start align-items-center gap-2">
          <Image
            src={`/images/U6Yv8e-bZma.png`} //
            alt="Avatar"
            width={20}
          />
          <span>
            Đến từ <strong>Yên Phong</strong>
          </span>
        </li>

        <li className="d-flex justify-content-start align-items-center gap-2">
          <Image
            src={`/images/RSpVEGhhd5g.png`} //
            alt="Avatar"
            width={20}
          />
          <span>
            Tham gia vào <strong>Tháng 7 năm 2014</strong>{" "}
          </span>
        </li>

        <li className="d-flex justify-content-start align-items-center gap-2">
          <Image
            src={`/images/KI8WW-PO5ze.png`} //
            alt="Avatar"
            width={20}
          />
          <strong>Độc thân</strong>
        </li>

        <li className="d-flex justify-content-start align-items-center gap-2">
          <Image
            src={`/images/4Q7dbKr7Ud3.png`} //
            alt="Avatar"
            width={20}
          />
          <span>
            Có <strong>9999999</strong> theo dõi
          </span>
        </li>
      </ul>

      {isToken() && userLogin?.id === userProfile?.id && (
        <Button variant="light" className="w-100 my-2 d-flex justify-content-center align-items-center gap-1">
          <Image
            src={`/images/QzihRGaO32y.png`} //
            alt="Avatar"
            width={20}
          />
          Chỉnh sửa chi tiết cá nhân
        </Button>
      )}
    </>
  );
};

export default ProfileDetails;
