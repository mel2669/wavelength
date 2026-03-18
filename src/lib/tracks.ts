export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  artwork: string;
  accentColor: string;
}

export const tracks: Track[] = [
  {
    id: "1",
    title: "Dissolve",
    artist: "Bonobo",
    album: "Migration",
    duration: 284,
    artwork: "https://picsum.photos/seed/bonobo10/400/400",
    accentColor: "#2dd4bf",
  },
  {
    id: "2",
    title: "Circling",
    artist: "Four Tet",
    album: "There Is Love In You",
    duration: 317,
    artwork: "https://picsum.photos/seed/fourtet20/400/400",
    accentColor: "#fb923c",
  },
  {
    id: "3",
    title: "Noctuary",
    artist: "Jon Hopkins",
    album: "Music for Psychedelic Therapy",
    duration: 263,
    artwork: "https://picsum.photos/seed/jonhop30/400/400",
    accentColor: "#a78bfa",
  },
  {
    id: "4",
    title: "Holocene",
    artist: "Bon Iver",
    album: "Bon Iver, Bon Iver",
    duration: 337,
    artwork: "https://picsum.photos/seed/boniver40/400/400",
    accentColor: "#60a5fa",
  },
  {
    id: "5",
    title: "La Femme D'Argent",
    artist: "Air",
    album: "Moon Safari",
    duration: 428,
    artwork: "https://picsum.photos/seed/airsound50/400/400",
    accentColor: "#34d399",
  },
  {
    id: "6",
    title: "Tripoli",
    artist: "Com Truise",
    album: "Iteration",
    duration: 251,
    artwork: "https://picsum.photos/seed/comtruise60/400/400",
    accentColor: "#f472b6",
  },
];
