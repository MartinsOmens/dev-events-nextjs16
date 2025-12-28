import Button from "@/components/Button";
import EventCard from "@/components/EventCard";
import events from "@/lib/constants";


const Home = () => {
  return (
    <section>
      <h1 className="text-center mt-10">
        The Hub for every Dev <br /> Event you can't miss!
      </h1>
      <p className="text-center mt-5 capitalize">
        Hackathons, Meetups and conferences, All in one place
      </p>

      <Button />

      {/* ---------Events --------- */}

      <div className="mt-10 space-y-7">
        <h2 className="text-center text-2xl font-medium">Featured Events</h2>
       <ul className="events">
        {events.map((event) => (
          <li key={event.title}>
            <EventCard {...event}/>
          </li>
        ))}
       </ul>
      </div>
    </section>
  );
};

export default Home;
