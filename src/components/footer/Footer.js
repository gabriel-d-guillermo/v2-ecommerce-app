// import { withRouter } from "react-router-dom";
export default function Footer() {
  const date = new Date();
  const currentYear = date.getFullYear();

  return (
    <footer className="py-4 w-100 mt-5 ">
      <div className=" d-flex flex-wrap justify-content-center">
        <p className="mx-2 my-1">
          <i className="fa-brands fa-square-facebook text-light"></i>&nbsp;
          <a
            className="text-light"
            href="https://www.facebook.com/gabriel.guillermo2/"
            target="_blank"
            rel="noreferrer"
          >
            <small className="">facebook</small>
          </a>
        </p>
        <p className="text-light mx-2 my-1 ">
          <i className="fa-brands fa-linkedin"></i>&nbsp;
          <a
            className="text-light"
            href="https://www.linkedin.com/in/gabriel-guillermo-7730b9247/"
            target="_blank"
            rel="noreferrer"
          >
            <small className="">linkedin</small>
          </a>
        </p>
        <p className="text-light mx-2 my-1 ">
          <i className="fa-solid fa-square-phone"></i> <small> 09758844512 (globe)</small>
        </p>
        <p className=" text-light mx-2 my-1">
          <i className="fa-brands fa-google"></i>
          <small> gabrieldguillermo@gmail.com</small>
        </p>
      </div>
      <p className="text-center my-auto text-light">
        <small>All Rights Reserve {currentYear}</small>
      </p>
    </footer>
  );
}
