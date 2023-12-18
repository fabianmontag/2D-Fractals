import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { SierpinskiCarpet, SierpinskiTriangle, KochRectangle, KochSnowFlake, Tree } from "./fractals";
import "./App.css";
import "./index.css";

const dpr = devicePixelRatio;

const renderSelectedFractal = (
    ctx: CanvasRenderingContext2D | null,
    fractalType: string,
    zoom: number,
    steps: number,
    treeAngle: number,
    randomizeTreeAngle: boolean
) => {
    if (ctx == null) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();

    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);

    if (fractalType == "Sierpinski-Carpet") {
        let w = (Math.min(window.innerWidth, window.innerHeight) * 2) / 3;
        ctx.translate(window.innerWidth / 2 - w / 2, window.innerHeight / 2 - w / 2);
        SierpinskiCarpet(ctx, { x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: w }, { x: 0, y: w }, Math.min(steps, 8));
    } else if (fractalType == "Sierpinski-Triangle") {
        let w = (Math.min(window.innerWidth, window.innerHeight) * 2) / 3;
        ctx.translate(window.innerWidth / 2 - w / 2, window.innerHeight / 2 + w / 2);
        ctx.scale(1, -1);
        SierpinskiTriangle(ctx, { x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: w }, { x: 0, y: w }, steps);
    } else if (fractalType == "Koch-Rectangle") {
        let w = (Math.min(window.innerWidth, window.innerHeight * 2) * 2) / 3;
        ctx.translate(window.innerWidth / 2 - w / 2, window.innerHeight / 2 + w / 4.5);
        KochRectangle(ctx, { x: 0, y: 0 }, { x: w, y: 0 }, steps);
    } else if (fractalType == "Koch-Snowflake") {
        let w = (Math.min(window.innerWidth, window.innerHeight) * 2) / 3;
        ctx.translate(window.innerWidth / 2 - w / 2, window.innerHeight / 2 + -Math.sqrt(w ** 2 - (w / 2) ** 2) / 3);
        let p1 = { x: w / 2, y: Math.sqrt(w ** 2 - (w / 2) ** 2) };
        let p2 = { x: 0, y: 0 };
        let p3 = { x: w, y: 0 };
        KochSnowFlake(ctx, steps, p2, p3);
        KochSnowFlake(ctx, steps, p3, p1);
        KochSnowFlake(ctx, steps, p1, p2);
    } else if (fractalType == "Koch-Snowflake-Single") {
        let w = (Math.min(window.innerWidth, window.innerHeight * 2) * 2) / 3;
        ctx.translate(window.innerWidth / 2 - w / 2, window.innerHeight / 2 + w / 7);
        KochSnowFlake(ctx, steps, { x: 0, y: 0 }, { x: w, y: 0 });
    } else if (fractalType == "Tree") {
        let w = Math.min(window.innerWidth, window.innerHeight) / 6;
        ctx.translate(window.innerWidth / 2, window.innerHeight / 2 + w);
        ctx.scale(1, -1);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.strokeStyle = "black";
        ctx.lineTo(0, -w);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();

        Tree(ctx, steps, w, 1.5, (treeAngle * Math.PI) / 180, randomizeTreeAngle);
    }
    ctx.restore();
};

function App() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);

    const [fractalType, setFractalType] = useState("Tree");

    const [zoom, setZoom] = useState(1.05);

    const [randomizeTreeAngle, setRandomizeTreeAngle] = useState(true);
    const [treeAngle, setTreeAngle] = useState(45);

    const [treeSteps, setTreeSteps] = useState(10);
    const [snowflakeSteps, setSnowflakeSteps] = useState(5);
    const [snowflakeSignleSteps, setSnowflakeSignleSteps] = useState(5);
    const [rectangleSteps, setRectangleSteps] = useState(5);
    const [carpetSteps, setCarpetSteps] = useState(5);
    const [pyramidSteps, setPyramidSteps] = useState(5);

    useEffect(() => {
        if (canvas.current == null) return;

        const canv = canvas.current!;

        canv.style.width = window.innerWidth + "px";
        canv.style.height = window.innerHeight + "px";
        canv.width = window.innerWidth * dpr;
        canv.height = window.innerHeight * dpr;

        ctx.current = canv.getContext("2d")!;

        ctx.current.scale(dpr, dpr);
        ctx.current.lineJoin = ctx.current.lineCap = "round";

        render();

        window.addEventListener("resize", () => {
            canv.style.width = window.innerWidth + "px";
            canv.style.height = window.innerHeight + "px";
            canv.width = window.innerWidth * dpr;
            canv.height = window.innerHeight * dpr;

            ctx.current = canv.getContext("2d")!;

            ctx.current.scale(dpr, dpr);
            ctx.current.lineJoin = ctx.current.lineCap = "round";

            render();
        });
    }, []);

    useEffect(() => {
        render();
    }, [
        fractalType,
        zoom,
        randomizeTreeAngle,
        treeAngle,
        carpetSteps,
        pyramidSteps,
        rectangleSteps,
        snowflakeSteps,
        snowflakeSignleSteps,
        treeSteps,
    ]);

    const toggleRandomizeTreeAngle = (e: SyntheticEvent) => {
        setRandomizeTreeAngle((e.target as HTMLInputElement).checked);
    };

    const changeTreeAngle = (e: SyntheticEvent) => {
        setTreeAngle(Number((e.target as HTMLInputElement).value));
    };

    const changeZoom = (e: SyntheticEvent) => {
        let val = Number((e.target as HTMLInputElement).value) / 10;
        let min = 0.1;
        let max = 2;
        let v = val * (max - min) + min;
        setZoom(v);
    };

    const render = () => {
        let steps = 1;
        if (fractalType == "Sierpinski-Carpet") {
            steps = carpetSteps;
        } else if (fractalType == "Sierpinski-Triangle") {
            steps = pyramidSteps;
        } else if (fractalType == "Koch-Rectangle") {
            steps = rectangleSteps;
        } else if (fractalType == "Koch-Snowflake") {
            steps = snowflakeSteps;
        } else if (fractalType == "Koch-Snowflake-Single") {
            steps = snowflakeSignleSteps;
        } else if (fractalType == "Tree") {
            steps = treeSteps;
        }

        renderSelectedFractal(ctx.current, fractalType, zoom, steps, treeAngle, randomizeTreeAngle);
    };

    const selectFractalType = (e: SyntheticEvent) => {
        setFractalType((e.target as HTMLSelectElement).value);
    };

    const changeSteps = (e: SyntheticEvent) => {
        if (fractalType == "Sierpinski-Carpet") {
            setCarpetSteps(Number((e.target as HTMLSelectElement).value));
        } else if (fractalType == "Sierpinski-Triangle") {
            setPyramidSteps(Number((e.target as HTMLSelectElement).value));
        } else if (fractalType == "Koch-Rectangle") {
            setRectangleSteps(Number((e.target as HTMLSelectElement).value));
        } else if (fractalType == "Koch-Snowflake") {
            setSnowflakeSteps(Number((e.target as HTMLSelectElement).value));
        } else if (fractalType == "Koch-Snowflake-Single") {
            setSnowflakeSignleSteps(Number((e.target as HTMLSelectElement).value));
        } else if (fractalType == "Tree") {
            setTreeSteps(Number((e.target as HTMLSelectElement).value));
        }
    };

    const getMaxSteps = (fractalType: string) => {
        if (fractalType == "Sierpinski-Carpet") {
            return 6;
        } else if (fractalType == "Sierpinski-Triangle") {
            return 9;
        } else if (fractalType == "Koch-Rectangle") {
            return 7;
        } else if (fractalType == "Koch-Snowflake") {
            return 7;
        } else if (fractalType == "Koch-Snowflake-Single") {
            return 10;
        } else if (fractalType == "Tree") {
            return 13;
        }
    };

    const getSteps = (fractalType: string) => {
        if (fractalType == "Sierpinski-Carpet") {
            return carpetSteps;
        } else if (fractalType == "Sierpinski-Triangle") {
            return pyramidSteps;
        } else if (fractalType == "Koch-Rectangle") {
            return rectangleSteps;
        } else if (fractalType == "Koch-Snowflake") {
            return snowflakeSteps;
        } else if (fractalType == "Koch-Snowflake-Single") {
            return snowflakeSignleSteps;
        } else if (fractalType == "Tree") {
            return treeSteps;
        }
    };

    return (
        <div className="App">
            <div className="fixed top-0 w-full flex items-center justify-center flex-wrap z-20">
                <select
                    name="fractal-type"
                    id="select"
                    onChange={selectFractalType}
                    defaultValue={"Tree"}
                    className="m-3"
                >
                    <option value="Sierpinski-Carpet">Sierpinski-Carpet</option>
                    <option value="Sierpinski-Triangle">Sierpinski-Triangle</option>
                    <option value="Koch-Rectangle">Koch-Snowflake-Rectangle</option>
                    <option value="Koch-Snowflake-Single">Koch-Curve</option>
                    <option value="Koch-Snowflake">Koch-Snowflake</option>
                    <option value="Tree">Tree</option>
                </select>

                <div className="flex flex-row items-center justify-center">
                    <div className="flex flex-col items-center jusitfy-center text-sm text-gray-500 m-3">
                        <label htmlFor="renderSteps" className="mb-1">
                            render Steps
                        </label>
                        <input
                            name="renderSteps"
                            type="range"
                            min={1}
                            max={getMaxSteps(fractalType)}
                            value={getSteps(fractalType)}
                            onInput={changeSteps}
                        />
                    </div>

                    <div className="flex flex-col items-center jusitfy-center text-sm text-gray-500 m-3">
                        <label htmlFor="zoomSteps" className="mb-1">
                            zoom Steps
                        </label>
                        <input name="zoomSteps" type="range" min={0} max={10} defaultValue={5} onInput={changeZoom} />
                    </div>
                </div>
            </div>

            <canvas id="canvas" ref={canvas}></canvas>

            {fractalType == "Tree" ? (
                <div className="fixed bottom-0 w-full flex items-center justify-center flex-wrap z-20">
                    <label htmlFor="randomizeTreeAngle" className="m-3 mr-1">
                        Randomized Tree-Angle
                    </label>
                    <input
                        type={"checkbox"}
                        onInput={toggleRandomizeTreeAngle}
                        defaultChecked={randomizeTreeAngle}
                        name="randomizeTreeAngle"
                        className="m-3 ml-1"
                    ></input>
                    <input
                        type={"number"}
                        onInput={changeTreeAngle}
                        defaultValue={treeAngle}
                        min={1}
                        max={360}
                        name="randomizeTreeAngle"
                        className="m-3 border p-1 px-2 rounded-md"
                    ></input>
                    <button onClick={render} className="m-3 border bg-gray-100 p-1 px-2 rounded-md">
                        render
                    </button>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default App;
