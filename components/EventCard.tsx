import Image from "next/image";
import Link from "next/link";
interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  time: string;
  date: string;
}

const EventCard = ({ title, image, slug, location, time, date }: Props) => {
  return (
    <div>
      <Link href={`/events/${slug}`} id="event-card">
        <Image
          src={image}
          alt={title}
          width={410}
          height={300}
          className="poster"
        />
        <div className="flex items-center gap-2">
          <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
          <p>{location}</p>
        </div>
        <p className="title">{title}</p>

        <div className="datetime">
          <div>
            <Image
              src="/icons/calendar.svg"
              alt="location"
              width={14}
              height={14}
            />
            <p>{date}</p>
          </div>

          <div>
            <Image
              src="/icons/clock.svg"
              alt="location"
              width={14}
              height={14}
            />
            <p>{time}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
