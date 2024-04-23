import React from "react";

function Card({ color, width, height }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 170 255"
    >
      <path
        fill={color}
        d="M150 0H20C8.954 0 0 8.954 0 20v215c0 11.046 8.954 20 20 20h130c11.046 0 20-8.954 20-20V20c0-11.046-8.954-20-20-20z"
      ></path>
      <path
        fill={color}
        d="M150 .5H20C9.23.5.5 9.23.5 20v215c0 10.77 8.73 19.5 19.5 19.5h130c10.77 0 19.5-8.73 19.5-19.5V20C169.5 9.23 160.77.5 150 .5z"
      ></path>
    </svg>
  );
}

export default Card;
