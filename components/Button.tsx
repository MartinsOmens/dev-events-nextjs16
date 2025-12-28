"use client";

import Image from "next/image";

const Button = () => {
  return (
    <div>
      <button
        type="button"
        onClick={() => console.log("Clicked")}
        id="explore-btn"
        className="mx-auto mt-10"
      >
        <a href="#events">Explore More Events</a>
        <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24}/>
      </button>
    </div>
  );
};

export default Button;
