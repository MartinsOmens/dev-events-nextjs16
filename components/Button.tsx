"use client";

import Image from "next/image";
import posthog from "posthog-js";

const Button = () => {
   const handleClick = () => {
    posthog.capture('explore_more_events_clicked', { button_id: 'explore-btn' })
    console.log('Clicked')
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
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
