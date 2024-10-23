import { getIconStatusPost } from "@/src/utils";
import dynamic from "next/dynamic";
import { Form } from "react-bootstrap";
const Select = dynamic(() => import("react-select"), { ssr: false });
export default function PostSelectStatus({ onChange, defaultValue, style, sizeIcon }) {
  const options = [
    {
      value: 0,
      label: <div className="d-flex justify-content-start align-items-center gap-1">{getIconStatusPost(0, sizeIcon)}Công khai</div>,
    },
    {
      value: 1,
      label: <div className="d-flex justify-content-start align-items-center gap-1">{getIconStatusPost(1, sizeIcon)}Bạn bè</div>,
    },
    {
      value: 2,
      label: <div className="d-flex justify-content-start align-items-center gap-1">{getIconStatusPost(2, sizeIcon)}Chỉ mình tôi</div>,
    },
  ];

  return (
    <Form.Group style={style}>
      <Select
        options={options} //
        defaultValue={options[defaultValue ? defaultValue : 0]}
        onChange={onChange}
        classNamePrefix="select"
      />
    </Form.Group>
  );
}
