import { FC, useRef, useState } from "react";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";

export const Editor: FC = () => {
  const [steps, setSteps] = useState<Array<number>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addStep = () => {
    setSteps((s) => [0, ...s]);
  };

  const info = steps;

  return (
    <>
      <video controls={true} ref={videoRef} playsInline>
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <button
        className="p-1 border border-blue-200 m-2 rounded-full"
        onClick={addStep}
      >
        add
      </button>
      <Range
        allowCross={false}
        value={steps}
        onChange={setSteps}
        min={0}
        max={videoRef.current?.duration}
      />
      <pre className="text-xs">{JSON.stringify(info, null, 2)}</pre>
    </>
  );
};
