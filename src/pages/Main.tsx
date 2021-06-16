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
      { title: "maikeljason", to: 6 },
      { title: "chiki chiki", to: 7 },
    ],
  },
  {
    title: "la segunda",
    figures: [
      { title: "pikachu", to: 8 },
      { title: "vulvasaur", to: 9 },
      { title: "squirtle", to: 10 },
      { title: "charmander", to: 12 },
    ],
  },
];

const findSectionIdex = (sections: ISection[], second: number = 0) => {
  const index = sections.findIndex(
    (i) => i.figures[i.figures.length - 1].to >= second
  );

  return index === -1 ? sections.length - 1 : index;
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
  return progress > 1 ? 1 : progress;
};

const getLocalProgress = (
  start: number,
  end: number,
  currentTime: number = 0
) => {
  const progress = (currentTime - start) / (end - start);
  return progress > 1 ? 1 : progress;
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
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-0 m-2">{playing ? "" : "⏸"}</div>
      <section className="flex flex-wrap">
        {sections.map((section, index) => {
          return (
            <ButtonProgress
              key={section.title}
              title={section.title}
              progress={getSectionProgress(sections, index, currentTime)}
              onClick={() =>
                onClickButton(index === 0 ? 0 : section.figures[index - 1].to)
              }
            />
          );
        })}
      </section>
      <div className="border-b"></div>
      <section className="flex flex-wrap">
        {videoRef.current &&
          sections[sectionIndex].figures.map((figure, index, figures) => {
            return (
              <ButtonProgress
                key={figure.title}
                title={figure.title}
                progress={getLocalProgress(
                  index === 0
                    ? sectionIndex === 0
                      ? 0
                      : sections[sectionIndex - 1].figures[
                          sections[sectionIndex - 1].figures.length - 1
                        ].to
                    : figures[index - 1].to,
                  figure.to,
                  currentTime
                )}
                onClick={() => {
                  onClickButton(
                    index === 0
                      ? sectionIndex === 0
                        ? 0
                        : sections[sectionIndex - 1].figures[
                            sections[sectionIndex - 1].figures.length - 1
                          ].to
                      : figures[index - 1].to
                  );
                }}
              />
            );
          })}
      </section>
    </div>
  );
};
