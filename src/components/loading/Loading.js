import "./Loading.css";

export default function Loading() {
  return (
    <div className="loading-wrapper">
      <div className="loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div>Loading . . . </div>
      </div>
    </div>
  );
}
