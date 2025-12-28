export type Event = {
  id: string;
  title: string;
  date: string; // ISO date string
  time: string;
  location: string;
  description: string;
  image: string; // path under /images
  url?: string;
};

export const events: Event[] = [
  {
    id: "react-summit-2026",
    title: "React Summit 2026",
    date: "2026-03-18",
    time: "10:00AM",
    location: "Amsterdam, Netherlands",
    description:
      "A community-driven conference focused on React and the modern web — talks, workshops and networking with React core team members and ecosystem authors.",
    image: "/images/event1.png",
    url: "https://reactsummit.com/",
  },
  {
    id: "jsconf-eu-2026",
    title: "JSConf EU 2026",
    date: "2026-05-12",
    time: "9:00AM",
    location: "Berlin, Germany",
    description:
      "Independent JavaScript conference featuring technical talks on frameworks, tooling, runtime, and language evolution.",
    image: "/images/event2.png",
    url: "https://jsconf.eu/",
  },
  {
    id: "nextjs-conf-2026",
    title: "Next.js Conf 2026",
    date: "2026-06-02",
    time: "7:00AM",
    location: "Online & San Francisco, USA",
    description:
      "Official Next.js conference — deep dives, demos from the Vercel and Next.js teams and community showcases.",
    image: "/images/event3.png",
    url: "https://nextjs.org/conf",
  },
  {
    id: "hackzurich-2026",
    title: "HackZurich 2026",
    date: "2026-09-18",
    time: "2:00PM",
    location: "Zurich, Switzerland",
    description:
      "One of Europe's largest hackathons — teams build projects across hardware, web3, AI and more in a 48-hour sprint.",
    image: "/images/event4.png",
    url: "https://hackzurich.com/",
  },
  {
    id: "ethglobal-hack-2026",
    title: "ETHGlobal Hackathon 2026",
    date: "2026-07-22",
    time: "10:00AM",
    location: "Various (Global)",
    description:
      "Global series of hackathons focused on blockchain, web3 tooling and decentralized applications — great for builders and teams.",
    image: "/images/event5.png",
    url: "https://ethglobal.co/",
  },
  {
    id: "nodeconf-2026",
    title: "NodeConf EU 2026",
    date: "2026-10-05",
    time: "10:00AM",
    location: "Dublin, Ireland",
    description:
      "Conference centered on Node.js, server-side JS tooling, performance and observability — workshops and talks for backend engineers.",
    image: "/images/event6.png",
    url: "https://nodeconf.eu/",
  },
];

export default events;
