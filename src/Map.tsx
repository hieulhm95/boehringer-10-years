import { useRef, useEffect, useState } from "react";
import { Stage, Layer, Image, Text } from "react-konva";

import "./Map.css";
import useImage from "use-image"
import { data } from "react-router";


const URLImage = ({ src, ...rest }) => {
    const [image] = useImage(src, 'anonymous');
    return <Image image={image} {...rest}/>;
};

function AnimationMap() {
    const [isRunning, setRunning] = useState(false)
    const intervalRef = useRef<any>(null);
    const layerRef = useRef<any>(null);
    const [itemTexts, setItemTexts] = useState<any[]>([]);

    useEffect(() => {
        let count = 0;
        const minuses = [-1, 1];
        const names = ["Trịnh Trần Phương Tuấn", "Jack 19970", "Nguyễn Hữu Phúc Nghĩa", "Nghĩa Hữu Hưng", "Phan Ba Bạc", "Mr Xí Quách"];
        const nameLength = names.length;
        intervalRef.current = function(){
            setTimeout(() => {
                setItemTexts(prev => [
                    ...prev,
                    {
                        x: window.innerWidth / 2 + 10,
                        y: window.innerHeight / 2 + 5,
                        opacity: 0.025,
                        xVelocity: (Math.floor(Math.random() * 4) + 2) * minuses[Math.floor(Math.random() * 2)],
                        yVelocity: (Math.floor(Math.random() * 4) + 2) * minuses[Math.floor(Math.random() * 2)],
                        stopX: 0,
                        stopY: 0,
                        text: names[Math.floor(Math.random() * nameLength)]
                    }
                ]);
                count+= 1;
                if(count < 101){
                    intervalRef.current()
                }
            }, 499);
        }
        intervalRef.current();

        const animation = new (window as any).Konva.Animation(() => {
            setItemTexts(prev => {
                return prev.map(p => {
                    const opacity = Math.min(1, p.opacity + 0.015);
                    let x = p.x + p.xVelocity;
                    let y = p.y + p.yVelocity;
                    
                    let stopX = false;
                    let stopY = false;

                    if(x >= window.innerWidth - 100) {
                        x = window.innerWidth - 100;
                        stopX = true;
                    }
                    else if(x <= 20) {
                        x = 20;
                        stopX = true;
                    }

                    if(y >= window.innerHeight - 60) {
                        y = window.innerHeight - 60;
                        stopY = true;
                    }
                    else if(y <= 20) {
                        y = 20;
                        stopY = true;
                    }

                    if(stopX) y = p.y;
                    if(stopY) x = p.x;

                    return {
                        ...p,
                        x: x,
                        y: y,
                        opacity: opacity
                    }
                })
            })
        }, layerRef.current);

        animation.start();

        return () => {
            intervalRef.current = () => {}
            animation.stop();
        }
    }, [])

    return <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer ref={layerRef}>
            <URLImage src="/map-with-cross.png" width={window.innerWidth} height={window.innerHeight}/>
            {itemTexts.map((t, index) => {
                return <Text key={`text-${index}`} text={t.text} opacity={t.opacity} fill="white" fontSize={24} x={t.x} y={t.y}/>
            })}
        </Layer>
    </Stage>
}

function Map() {
    const [showedAnimationMap, toggleShowAnimationMap] = useState(true);
    return <div className="background">
        {showedAnimationMap ? <AnimationMap /> : <>
            <div className="text-box">
                <img src="/tu-nhung-nguoi-da-tien-phong.png" height={40} className="text" />
                <img src="/nhung-nguoi-dang-hanh-dong.png" height={40} className="text" />
                <img src="/nhung-nguoi-sap-bat-dau.png" height={210} className="text" />
            </div>
            <div className="map">
                <img src="/map-with-cross.png" height="99%"/>
            </div>
        </>}
    </div>
}

export default Map