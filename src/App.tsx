import { useEffect, useRef, useState } from "react";

const info: IData[] = [
  {
    title: "la primera",
    steps: [
      { title: "crusaito", start: 2, end: 3 },
      { title: "brikindans", start: 3, end: 4 },
      { title: "robocó", start: 4, end: 5 },
      { title: "maikeljason", start: 5, end: 6 },
      { title: "chiki chiki", start: 6, end: 7 },
    ],
  },
  {
    title: "la segunda",
    steps: [
      { title: "pikachu", start: 7, end: 8 },
      { title: "vulvasaur", start: 8, end: 9 },
      { title: "squirtle", start: 9, end: 10 },
      { title: "charmander", start: 10, end: 12 },
    ],
  },
];

const getSteps = (info: IData[], second: number = 0) => {
  return (
    info.find(
      (i) =>
        i.steps[0].start <= second && i.steps[i.steps.length - 1].end > second
    )?.steps || []
  );
};
interface IData {
  title: string;
  steps: Array<{ title: string; start: number; end: number }>;
}

const getGlobalProgress = (steps: IData["steps"], currentTime = 0) => {
  return (
    ((currentTime ?? 0) - steps[0].start) /
    (steps[steps.length - 1].end - steps[0].start)
  );
};

const getLocalProgress = (
  start: number,
  end: number,
  currentTime: number = 0
) => {
  return ((currentTime ?? 0) - start) / (end - start);
};

function App() {
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
        {info.map((i) => {
          return (
            <button
              className={`flex flex-col border-2 m-2 rounded-full p-2 ${
                getGlobalProgress(i.steps, currentTime) > 0 ? "" : "opacity-50"
              }`}
              key={i.title}
              onClick={() => {
                videoRef.current!.currentTime = i.steps[0].start;
                setCurrentTime(i.steps[0].start);
                // videoRef.current!.play();
              }}
            >
              {i.title}
              <progress
                className="w-full"
                value={getGlobalProgress(i.steps, currentTime)}
              />
            </button>
          );
        })}
      </section>
      <div className="border-b"></div>
      <section className="flex flex-wrap">
        {videoRef.current &&
          getSteps(info, currentTime).map((step) => {
            return (
              <button
                className="flex flex-col border-2 m-2 rounded-full p-2 whitespace-nowrap"
                key={step.title}
                onClick={() => {
                  videoRef.current!.currentTime = step.start;
                  setCurrentTime(step.start);
                  // videoRef.current!.play();
                }}
              >
                {step.title}
                <progress
                  className="w-full"
                  value={getLocalProgress(step.start, step.end, currentTime)}
                />
              </button>
            );
          })}
      </section>
    </div>
  );
}

export default App;
