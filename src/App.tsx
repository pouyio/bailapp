import { useEffect, useRef, useState } from "react";

const info: IData[] = [
  {
    title: "la primera",
    start: 2,
    end: 4,
    steps: [
      { title: "crusaito", start: 2, end: 3 },
      { title: "brikindans", start: 3, end: 4 },
    ],
  },
  {
    title: "la segunda",
    start: 4,
    end: 6,
    steps: [
      { title: "robocó", start: 4, end: 5 },
      { title: "maikeljason", start: 5, end: 6 },
    ],
  },
];

const getSteps = (info: IData[], second: number = 0) => {
  return info.find((i) => i.start < second && i.end >= second)?.steps || [];
};
interface IData {
  title: string;
  start: number;
  end: number;
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
  }, [playing]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("play", () => setPlaying(true));
      videoRef.current.addEventListener("pause", () => setPlaying(false));
    }
  }, [videoRef]);

  return (
    <div className="App">
      <video controls={false} ref={videoRef}>
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <section>
        <h1>las secciones principales</h1>
        {info.map((i) => {
          return (
            <div style={{ display: "flex" }}>
              <button
                key={i.title}
                onClick={() => {
                  videoRef.current!.currentTime = i.start;
                  videoRef.current!.play();
                }}
              >
                {i.title}
              </button>
              <progress
                value={((currentTime ?? 0) - i.start) / (i.end - i.start)}
              />
            </div>
          );
        })}
      </section>
      <section>
        <h2>las secciones secundarias</h2>
        {videoRef.current &&
          getSteps(info, currentTime).map((step) => {
            return (
              <div>
                <button
                  key={step.title}
                  onClick={() => {
                    videoRef.current!.currentTime = step.start;
                    videoRef.current!.play();
                  }}
                >
                  {step.title}
                </button>
                <progress
                  value={
                    ((currentTime ?? 0) - step.start) / (step.end - step.start)
                  }
                />
              </div>
            );
          })}
      </section>
      <button onClick={() => videoRef.current?.play()}>Play</button>
      <button onClick={() => videoRef.current?.pause()}>Pause</button>
    </div>
  );
}

export default App;
