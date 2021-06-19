import { FC, useRef, useState } from "react";
import { Range } from "rc-slider";
import { useFilePicker } from "use-file-picker";
import "rc-slider/assets/index.css";

export const Editor: FC = () => {
  const [steps, setSteps] = useState<Array<number>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [openFileSelector, { plainFiles, clear }] = useFilePicker({
    accept: "video/*",
    readFilesContent: true,
  });

  const addStep = () => {
    if (!videoRef.current) {
      return;
    }
    const lastTime = steps[steps.length - 1] ?? 0;
    const nextHandleTime =
      (videoRef.current!.duration - lastTime) / 2 + lastTime;
    setSteps((s) => [...s, nextHandleTime]);
  };

  const onMoveSteps = (newSteps: number[]) => {
    if (!videoRef.current) {
      return;
    }
    const stepMoved = steps.find((step, index) => step !== newSteps[index]);
    setSteps(newSteps);
    videoRef.current.currentTime = stepMoved ?? 0;
  };

  const info = steps.map((to) => ({
    to,
  }));

  return (
    <>
      {plainFiles.length ? (
        <video controls={true} ref={videoRef} playsInline>
          <source
            src={URL.createObjectURL(plainFiles[0])}
            type={plainFiles[0].type}
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <button className="w-full">
          <img
            className="w-full"
            onClick={openFileSelector}
            src="https://via.placeholder.com/375x210?text=Click+to+upload+video"
            alt="video placeholder"
          />
        </button>
      )}
      <div className="p-2">
        {plainFiles.length ? (
          <>
            <button
              className="m-2 p-1 border border-blue-200 m-2 rounded-full"
              onClick={() => {
                clear();
                openFileSelector();
              }}
            >
              <span className="m-2">Upload new video</span>
            </button>
            <br />
          </>
        ) : null}
        {plainFiles.length ? (
          <>
            <button
              className="m-2 p-1 border border-blue-200 m-2 rounded-full"
              onClick={addStep}
            >
              <span className="mx-2">add</span>
            </button>
            <Range
              allowCross={false}
              value={steps}
              onChange={onMoveSteps}
              min={0}
              max={videoRef.current?.duration}
            />
            <pre className="text-xs">{JSON.stringify(info, null, 2)}</pre>
          </>
        ) : null}
      </div>
    </>
  );
};
