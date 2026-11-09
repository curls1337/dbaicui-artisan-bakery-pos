import React from "react";
import { Composition } from "remotion";
import { GerhanaExplainer3D } from "./GerhanaExplainer3D";

export const Root: React.FC = () => {
  return (
    <Composition
      id="GerhanaExplainer3D"
      component={GerhanaExplainer3D}
      durationInFrames={1778}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
