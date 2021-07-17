import { FC, useRef, useState } from "react";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import { useFile } from "../hooks/useFile";

export const Editor: FC = () => {
  const [steps, setSteps] = useState<Array<{ to: number; title?: string }>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { file, onChangeFile } = useFile();

  const addStep = () => {
    if (!videoRef.current) {
      return;
    }
    const lastTime = steps[steps.length - 1]?.to ?? 0;
    const nextHandleTime =
      (videoRef.current!.duration - lastTime) / 2 + lastTime;
    setSteps((s) => [...s, { to: nextHandleTime }]);
  };

  const onMoveSteps = (newTos: number[]) => {
    if (!videoRef.current) {
      return;
    }
    const newStepIndex = steps.findIndex(
      (step, index) => step.to !== newTos[index]
    );
    setSteps((oldSteps) => {
      return oldSteps.map((oldStep, index) => {
        return index === newStepIndex
          ? { ...oldStep, to: newTos[newStepIndex] }
          : oldStep;
      });
    });
    videoRef.current.currentTime = newTos[newStepIndex] ?? 0;
  };

  const onClickUpload = () => {
    if (inputRef.current) {
      // for safari
      inputRef.current.dispatchEvent(new Event("click"));
      // for chrome
      inputRef.current.click();
    }
  };

  const calculateWidth = (index: number) => {
    if (index === 0) {
      return (steps[0].to / videoRef.current!.duration) * 100;
    }
    return (
      ((steps[index].to - steps[index - 1].to) / videoRef.current!.duration) *
      100
    );
  };

  return (
    <>
      <div>
        <label>
          <input
            type="file"
            onChange={onChangeFile}
            ref={inputRef}
            accept="video/*"
            className="hidden"
          />
        </label>
        {file ? (
          <video
            key={file.name + file.size}
            controls={true}
            ref={videoRef}
            playsInline
          >
            <source src={URL.createObjectURL(file)} type={file.type} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <button className="w-full">
            <img
              className="w-full"
              onClick={onClickUpload}
              src="https://via.placeholder.com/375x210?text=Click+to+upload+video"
              alt="video placeholder"
            />
          </button>
        )}
      </div>
      <div className="p-2">
        {file ? (
          <>
            <button
              className="m-2 p-1 border border-blue-200 m-2 rounded-full"
              onClick={onClickUpload}
            >
              <span className="m-2">Upload new video</span>
            </button>
            <br />
            <button
              className="m-2 p-1 border border-blue-200 m-2 rounded-full"
              onClick={addStep}
            >
              <span className="mx-2">add</span>
            </button>
            <Range
              allowCross={false}
              value={steps.map((s) => s.to)}
              onChange={onMoveSteps}
              min={0}
              max={videoRef.current?.duration}
            />
          </>
        ) : null}
        <div className="d-flex no-wrap">
          {steps.map((step, index) => {
            return (
              <input
                key={step.to}
                type="text"
                className="border"
                defaultValue={step.title}
                onChange={(e) => {
                  setSteps((oldSteps) => {
                    return oldSteps.map((oldStep, oldIndex) => {
                      return oldIndex === index
                        ? { ...oldStep, title: e.target.value }
                        : oldStep;
                    });
                  });
                }}
                style={{
                  width: calculateWidth(index) + "%",
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
