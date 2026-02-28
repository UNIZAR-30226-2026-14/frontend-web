import { useEffect } from 'react'
import './Loading.css'

function Loading({onFinished}) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onFinished();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [onFinished]);

    return (
        <div className="loading-screen">
            <h2>Buscando oponentes ...</h2>
            <div className="spinner"></div>
        </div>
    )
}

export default Loading;