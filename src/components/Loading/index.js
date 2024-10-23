import ImagesLoading from "../Images/ImagesLoading";

export default function Loading({ opacity }) {
  return (
    <div className={`loading-container`} style={{ opacity: opacity ? opacity : 1 }}>
      <ImagesLoading />
    </div>
  );
}
