import { FC, useEffect, useRef, useState } from "react";
import { ButtonProgress } from "../components/ButtonProgress";
import { ISection } from "../types";

const sections: ISection[] = [
  {
    title: "la primera",
    figures: [
      { title: "crusaito", to: 3 },
      { title: "brikindans", to: 4 },
      { title: "robocó", to: 5 },
      { to: 6 },
      { to: 7 },
    ],
  },
  {
    figures: [
      { to: 8 },
      { title: "vulvasaur", to: 9 },
      { to: 10 },
      { title: "charmander", to: 12 },
    ],
  },
];

const findSectionIdex = (sections: ISection[], second: number = 0) => {
  const index = sections.findIndex(
    (i) => i.figures[i.figures.length - 1].to > second
  );

  return index === -1 ? sections.length - 1 : index;
};

const normalizeProgress = (progress: number) => {
  return (progress > 1 ? 1 : progress < 0 ? 0 : progress) * 100;
};

const getSectionProgress = (
  sections: ISection[],
  index: number,
  currentTime = 0
) => {
  const startTime =
    index === 0
      ? 0
      : sections[index - 1].figures[sections[index - 1].figures.length - 1].to;
  const endTime =
    sections[index].figures[sections[index].figures.length - 1].to;
  const progress = (currentTime - startTime) / (endTime - startTime);
  return normalizeProgress(progress);
};

const getLocalProgress = (
  start: number,
  end: number,
  currentTime: number = 0
) => {
  const progress = (currentTime - start) / (end - start);
  return normalizeProgress(progress);
};

export const Main: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [clock, setClock] = useState<NodeJS.Timeout>();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>();

  useEffect(() => {
    if (playing) {
      setClock(
        setInterval(() => {
          setCurrentTime(videoRef.current?.currentTime);
        }, 100)
      );
    } else {
      clock && clearInterval(clock);
    }
    return () => clock && clearInterval(clock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("play", () => setPlaying(true));
      videoRef.current.addEventListener("pause", () => setPlaying(false));
    }
  }, [videoRef]);

  const onClickButton = (time: number) => {
    videoRef.current!.currentTime = time;
    setCurrentTime(time);
    // videoRef.current!.play();
  };

  const sectionIndex = findSectionIdex(sections, currentTime);
  return (
    <div className="relative">
      <video
        controls={false}
        ref={videoRef}
        playsInline
        onClick={() => {
          playing ? videoRef.current?.pause() : videoRef.current?.play();
        }}
      >
        <source
          src="https://bailapp.s3.eu-central-1.amazonaws.com/BigBuckBunny.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="p-2">
        <div className="absolute top-0 m-2">{playing ? "" : "⏸"}</div>
        <section className="flex flex-wrap">
          {sections.map((section, sectionIndex) => {
            return (
              <ButtonProgress
                key={section.title ?? sectionIndex}
                title={section.title ?? sectionIndex + 1}
                progress={getSectionProgress(
                  sections,
                  sectionIndex,
                  currentTime
                )}
                onClick={() =>
                  onClickButton(
                    sectionIndex === 0
                      ? 0
                      : sections[sectionIndex - 1].figures[
                          sections[sectionIndex - 1].figures.length - 1
                        ].to
                  )
                }
              />
            );
          })}
        </section>
        <div className="border-b"></div>
        <section className="flex flex-wrap">
          {videoRef.current &&
            sections[sectionIndex].figures.map(
              (figure, figureIndex, figures) => {
                return (
                  <ButtonProgress
                    key={figure.title ?? figureIndex}
                    title={figure.title ?? figureIndex + 1}
                    progress={getLocalProgress(
                      figureIndex === 0
                        ? sectionIndex === 0
                          ? 0
                          : sections[sectionIndex - 1].figures[
                              sections[sectionIndex - 1].figures.length - 1
                            ].to
                        : figures[figureIndex - 1].to,
                      figure.to,
                      currentTime
                    )}
                    onClick={() => {
                      onClickButton(
                        figureIndex === 0
                          ? sectionIndex === 0
                            ? 0
                            : sections[sectionIndex - 1].figures[
                                sections[sectionIndex - 1].figures.length - 1
                              ].to
                          : figures[figureIndex - 1].to
                      );
                    }}
                  />
                );
              }
            )}
        </section>
      </div>
    </div>
  );
};
