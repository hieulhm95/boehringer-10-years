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
                const xDirection = minuses[Math.floor(Math.random() * 2)];
                const yDirection = minuses[Math.floor(Math.random() * 2)];

                const baseX = window.innerWidth / 2;
                const baseY = window.innerHeight / 2;

                
                setItemTexts(prev => [
                    ...prev,
                    {
                        x: baseX,
                        y: baseY,
                        opacity: 0.025,
                        xVelocity: (Math.floor(Math.random() * 4) + 2) * xDirection,
                        yVelocity: (Math.floor(Math.random() * 4) + 2) * yDirection,
                        stopX: (Math.floor(Math.random() * 80) + 50),
                        stopY: (Math.floor(Math.random() * 80) + 50),
                        currentX: 0,
                        currentY: 0,
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
                    if(p.currentX == p.stopX || p.currentY == p.stopY) return p;
                    let x = p.x + p.xVelocity;
                    let y = p.y + p.yVelocity;
                    
                    let stopX = false;
                    let stopY = false;

                    const currentX = p.currentX + 1;
                    const currentY = p.currentY + 1;

                    if(currentX == p.stopX) stopX = true;
                    if(currentY == p.stopY) stopY = true;

                    if(stopX) y = p.y;
                    if(stopY) x = p.x;
                    
                    let name = p.text;
                    if(stopX || stopY) return {
                        url: "/cross-med.png",
                        x: x,
                        y: y,
                    }

                    return {
                        ...p,
                        x: x,
                        y: y,
                        currentX: currentX,
                        currentY: currentY,
                        opacity: opacity,
                        text: name,
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
                if(t.url) {
                    return <URLImage key={`text-${index}`} src={t.url} width={30} height={30} x={t.x} y={t.y}/>
                }
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