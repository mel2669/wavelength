export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // approximate — real duration comes from audio metadata
  src: string;      // CC-licensed MP3 from Internet Archive (archive.org)
  artwork: string;
  accentColor: string;
}

export const tracks: Track[] = [
  {
    id: "1",
    title: "Introspection",
    artist: "Aeon",
    album: "Introspection",
    duration: 240,
    src: "https://ia800402.us.archive.org/20/items/aeon-track-202-introspection/track_202_introspection.mp3",
    artwork: "https://picsum.photos/seed/aeon1/400/400",
    accentColor: "#2dd4bf",
  },
  {
    id: "2",
    title: "Extract #01",
    artist: "Restive",
    album: "Generative v3.0",
    duration: 210,
    src: "https://ia601903.us.archive.org/17/items/restive_i01/01extract_01.mp3",
    artwork: "https://picsum.photos/seed/restive2/400/400",
    accentColor: "#fb923c",
  },
  {
    id: "3",
    title: "Extract #02",
    artist: "Restive",
    album: "Generative v3.0",
    duration: 195,
    src: "https://ia601903.us.archive.org/17/items/restive_i01/02extract_02.mp3",
    artwork: "https://picsum.photos/seed/restive3/400/400",
    accentColor: "#a78bfa",
  },
  {
    id: "4",
    title: "Sequence GateZer0",
    artist: "A:Urban",
    album: "Episode One",
    duration: 330,
    src: "https://ia600507.us.archive.org/35/items/a-urban-episode-one/01a_urban-sequence_gateZer0.mp3",
    artwork: "https://picsum.photos/seed/aurban4/400/400",
    accentColor: "#60a5fa",
  },
  {
    id: "5",
    title: "It's Chill",
    artist: "A:Urban",
    album: "Episode One",
    duration: 280,
    src: "https://ia600507.us.archive.org/35/items/a-urban-episode-one/03a_urban-itschilldrumnambience.mp3",
    artwork: "https://picsum.photos/seed/aurban5/400/400",
    accentColor: "#34d399",
  },
  {
    id: "6",
    title: "Apparition",
    artist: "Medkit",
    album: "Kuori",
    duration: 260,
    src: "https://ia903109.us.archive.org/11/items/echomania.echm-007/01.Apparition.mp3",
    artwork: "https://picsum.photos/seed/medkit6/400/400",
    accentColor: "#f472b6",
  },
];
