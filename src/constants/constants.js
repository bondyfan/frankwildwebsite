// Media Section Constants
// Import images
import refresherImg from '../assets/media/refresher.jpg';
import instagramImg from '../assets/media/instagram.jpg';
import newstreamImg from '../assets/media/newstream.jpg';
import extraImg from '../assets/media/extra.jpg';

// Blog Posts
export const blogPosts = [
  {
    title: "Češi si jako gólovou znělku na mistrovství světa zvolili Hafo od Franka Wilda",
    source: "Refresher",
    url: "https://refresher.cz/135341-Cesi-si-jako-golovou-znelku-na-mistrovstvi-sveta-zvolili-Hafo-od-Franka-Wilda-a-Kafuu",
    excerpt: "Čeští fanoušci rozhodli. Gólovou znělkou na mistrovství světa v hokeji 2024 bude hit Hafo.",
    image: refresherImg
  },
  {
    title: "Frank Wild obsadil první 2 místa v trendech Youtube. Upír Dex a Zabil Jsem Svou Holku",
    source: "Óčko - Instagram",
    url: "https://www.instagram.com/p/CzG5AppK-Dm/?igsh=Ym10dDlub3Y0bHlz",
    excerpt: "Oficiální Instagram profil Franka Wilda a Kafuu přináší exkluzivní pohled do zákulisí.",
    image: instagramImg
  },
  {
    title: "Český internet válcuje podivný hit Hafo. Je chytřejší, než se zdá",
    source: "Newstream",
    url: "https://www.newstream.cz/enjoy/stanislav-sulc-cesky-internet-valcuje-podivny-hit-hafo-je-chytrejsi-nez-se-zda",
    excerpt: "Analýza fenoménu Hafo a jeho dopadu na českou internetovou kulturu.",
    image: newstreamImg
  },
  {
    title: "Ukazuje ass, já slintám jak pes. Lascivní píseň Hafo doslova trhá rekordy",
    source: "Extra.cz",
    url: "https://www.extra.cz/ukazuje-ass-ja-slintam-jak-pes-nestydata-kafuu-s-lascivni-pisni-hafo-doslova-trha-rekordy-c4f7e",
    excerpt: "Hit Hafo se stal virálním fenoménem na českém internetu.",
    image: extraImg
  }
];

// Video Section Constants
export const videos = [
  {
    id: "hafo",
    title: "Hafo",
    videoIds: ["IX3j84DJAGo", "i4NOEx2-6xk"],
  },
  {
    id: "vezmu-si-te",
    title: "Vezmu Si Tě Do Pekla",
    videoId: "wup3ChHramo",
  },
  {
    id: "upir-dex",
    title: "Upír Dex",
    videoId: "TO1BHE8gFTE",
  },
  {
    id: "bunny-hop",
    title: "Bunny Hop",
    videoId: "3rLKWDAlOTE",
  },
  {
    id: "hot",
    title: "HOT",
    videoId: "bFbH9hg2yKg",
  },
  {
    id: "zabil-jsem",
    title: "Zabil Jsem Svou Holku",
    videoId: "WVzjgCNCyaY",
  },
];

// Video Gradient Mapping
export const videoGradients = {
  "Hafo": "from-purple-500/20 to-pink-500/20",
  "Vezmu Si Tě Do Pekla": "from-red-700/60 to-violet-600/20",
  "Upír Dex": "from-red-600/60 to-yellow-500/50",
  "Bunny Hop": "from-green-500/60 to-pink-500/20",
  "HOT": "from-sky-500/60 to-yellow-500/20",
  "Zabil Jsem Svou Holku": "from-violet-600/40 to-blue-500/40",
};

// Concert Section Constants
export const concerts = [
  {
    date: "15. srpna 2023",
    city: "Praha",
    venue: "Lucerna Music Bar",
    ticketLink: "#"
  },
  {
    date: "22. srpna 2023",
    city: "Brno",
    venue: "Fléda Club",
    ticketLink: "#"
  },
  {
    date: "29. srpna 2023",
    city: "Ostrava",
    venue: "Fabric",
    ticketLink: "#"
  }
];
