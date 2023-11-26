import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const GoBack = (props) => {
  const navigate = useNavigate();

  return (
    <div className="">

      <Button
      variant="gradient"
        onClick={() => {
          navigate(`${props.goto}`);
        //   console.log(props.goto);
        }}
    className="flex justify-between items-center"
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          className=" mx-2 text-white"
        />
        <p className="">Go Back</p>
      </Button>
      <hr className="h-px my-4 border-0 bg-gray-700"></hr>
    </div>
  );
};

export default GoBack;
