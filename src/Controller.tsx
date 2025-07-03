import { useCallback, useState } from "react";
import './Controller.css';

const Controller = () => {
    const [playedLoop, playLoop] = useState(false);
    const [stoppedLoop, stopLoop] = useState(false);
    const play = useCallback(async (phase) => {
        const response = await fetch(
            'https://boehringer-ingelheim-empa-10years.com/api/media/play',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phase: phase
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Username submitted successfully:', result);
        playLoop(true);
    }, []);

    const stop = useCallback(async (phase) => {
        const response = await fetch(
            'https://boehringer-ingelheim-empa-10years.com/api/media/pause',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phase: phase
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Username submitted successfully:', result);
        stopLoop(true);
    }, []);

    return <div>
        {
            !stoppedLoop ? 
                <button className="button" onClick={() => playedLoop ? stop("loop") : play("loop")}>{playedLoop ? "Stop Loop" : "Play Loop"}</button> :
                <button className="button">Waiting for end</button> 
        }
    </div>
};

export default Controller;