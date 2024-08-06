import { useRef, useState } from "react";
import "./App.css";
import QRCodeScanner from "./components/QRCodeScanner";
import { VIDEO_SIZE } from "./constants";
import CodeList from "./components/CodeList";

function App() {
    const lastCode = useRef<string>("");
    const [detectCode, setDetectCode] = useState<string>("");
    const [savingMode, setSavingMode] = useState<boolean>(true);
    const divRef = useRef<HTMLDivElement>(null);
    const [codeHistory, setCodeHistory] = useState<string[]>([
        "aa",
        "bb",
        "cc",
        "aa",
        "bb",
        "cc",
        "aa",
        "bb",
        "cc",
        "aa",
        "bb",
        "cc",
    ]);

    // 画面のアスペクト比を保持したプレビューのサイズを計算
    const previewWidth = Math.round(window.innerWidth * 0.6);
    const previewHeight = Math.round(
        (VIDEO_SIZE.width / VIDEO_SIZE.height) * previewWidth
    );

    // バーコード検出時のコールバック関数
    const detectionCode = (data: string) => {
        if (!data || data === lastCode.current) {
            return;
        }
        lastCode.current = data;
        setDetectCode(data);
        setCodeHistory((prev) => [data, ...prev]);
        divRef.current?.scrollTo(0, 0);
    };

    return (
        <>
            <div className="flex flex-col items-center p-2 pt-4 h-svh">
                <div>
                    {savingMode ? (
                        <div
                            className="bg-neutral-300"
                            style={{
                                width: previewWidth,
                                height: previewHeight,
                            }}
                        ></div>
                    ) : (
                        <QRCodeScanner
                            width={previewWidth}
                            height={previewHeight}
                            callback={detectionCode}
                        />
                    )}
                </div>
                <div className="flex flex-row mt-5 justify-end w-full mr-5">
                    <label className="text-neutral-500">
                        カメラオフ
                        <input
                            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                            type="checkbox"
                            role="switch"
                            checked={savingMode}
                            onChange={() => setSavingMode(!savingMode)}
                        />
                    </label>
                </div>
                <div className="border-2 border-slate-200 w-4/5 h-20 mt-4 p-3 break-all rounded bg-slate-50">
                    {detectCode}
                </div>
                <div className="mt-3">履歴</div>
                <div
                    className="w-4/5 flex-1 border-2 border-slate-200 p-2 overflow-auto"
                    ref={divRef}
                >
                    <CodeList codes={codeHistory} />
                </div>
            </div>
        </>
    );
}

export default App;
