import { LandingPage } from "@/components/LandingPage";
import axios from "axios";

export default function Home() {
  axios.defaults.withCredentials = true;
  return (
    <div>
      <LandingPage />
    </div>
  );
}
