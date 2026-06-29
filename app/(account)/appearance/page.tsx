import Headline from "@/components/headline";
import { SetMode } from "@/components/set-mode";

import { SetTheme } from "@/components/set-theme";

const Appearance = async () => {
  return (
    <>
      <Headline>Appearance</Headline>

      <section className="flex flex-row gap-4">
        <SetTheme />
        <SetMode />
      </section>
    </>
  );
};

export default Appearance;
