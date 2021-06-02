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
    <div>
      <video
        controls={false}
        ref={videoRef}
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
      <section className="flex">
        {info.map((i) => {
          return (
            <button
              className="flex flex-col border-2 m-2 rounded-full p-2"
              key={i.title}
              onClick={() => {
                videoRef.current!.currentTime = i.steps[0].start;
                setCurrentTime(i.steps[0].start);
                // videoRef.current!.play();
              }}
            >
              {i.title}
              <progress
                value={
                  ((currentTime ?? 0) - i.steps[0].start) /
                  (i.steps[i.steps.length - 1].end - i.steps[0].start)
                }
              />
            </button>
          );
        })}
      </section>
      <section className="flex">
        {videoRef.current &&
          getSteps(info, currentTime).map((step) => {
            return (
              <button
                className="flex flex-col border-2 m-2 rounded-full p-2"
                key={step.title}
                onClick={() => {
                  videoRef.current!.currentTime = step.start;
                  setCurrentTime(step.start);
                  // videoRef.current!.play();
                }}
              >
                {step.title}
                <progress
                  value={
                    ((currentTime ?? 0) - step.start) / (step.end - step.start)
                  }
                />
              </button>
            );
          })}
      </section>
    </div>
  );
}

export default App;
