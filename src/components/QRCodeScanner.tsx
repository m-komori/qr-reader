import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import type { Point } from "jsqr/dist/locator";
import { VIDEO_SIZE } from "../constants";

const LINE_COLOR = "#FF3B58";

const CAMERA_SETTINGS: MediaStreamConstraints = {
    audio: false,
    video: {
        ...VIDEO_SIZE,
        facingMode: "environment",
    },
};

type QRCodeScannerProps = {
    width: number;
    height: number;
    callback: (data: string) => void;
};

const QRCodeScanner = ({ width, height, callback }: QRCodeScannerProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        // カメラ起動
        const openCamera = async () => {
            const video = videoRef.current;
            if (video) {
                stream = await navigator.mediaDevices.getUserMedia(
                    CAMERA_SETTINGS
                );

                video.srcObject = stream;
                video.play();
                requestAnimationFrame(tick);
            }
        };
        openCamera();

        return () => {
            // TODO カメラ停止しない
            if (stream) {
                stream.getVideoTracks()[0].stop();
                stream.getTracks().forEach((track) => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const drawLine = (begin: Point, end: Point, color: string = LINE_COLOR) => {
        const context = canvasRef?.current?.getContext("2d");
        if (!context) {
            return;
        }

        context.beginPath();
        context.moveTo(begin.x, begin.y);
        context.lineTo(end.x, end.y);
        context.lineWidth = 4;
        context.strokeStyle = color;
        context.stroke();
    };

    const tick = () => {
        const canvas = canvasRef?.current;
        const video = videoRef?.current;
        if (!canvas || !video) {
            return;
        }
        const context = canvas.getContext("2d")!;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.hidden = false;
            setLoading(false);

            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );
            // QRコード判定
            const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
                {
                    inversionAttempts: "dontInvert",
                }
            );
            if (code) {
                // QRコードを検出したら枠線描画
                drawLine(
                    code.location.topLeftCorner,
                    code.location.topRightCorner
                );
                drawLine(
                    code.location.topRightCorner,
                    code.location.bottomRightCorner
                );
                drawLine(
                    code.location.bottomRightCorner,
                    code.location.bottomLeftCorner
                );
                drawLine(
                    code.location.bottomLeftCorner,
                    code.location.topLeftCorner
                );
                // callback
                callback(code.data);
            }
        }
        requestAnimationFrame(tick);
    };

    return (
        <div className="max-w-full">
            <video
                autoPlay
                playsInline={true}
                ref={videoRef}
                hidden={true}
                className="hidden"
            />
            <canvas ref={canvasRef} hidden={true} style={{ width, height }} />
            {isLoading && <div style={{ width, height }}></div>}
        </div>
    );
};

export default QRCodeScanner;
