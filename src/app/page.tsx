import dynamic from "next/dynamic";

const PlayerCard = dynamic(() => import("@/components/PlayerCard"), {
  ssr: false,
});

export default function Home() {
  return <PlayerCard />;
}
