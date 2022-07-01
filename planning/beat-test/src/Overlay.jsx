import { useRef, useEffect } from "react"

const Overlay = function(props) {

    const overlayRef = useRef(null)
    const wave = props.tone.Transport.position

    const draw = cntxt => {
        cntxt.fillStyle = '#000000'
        cntxt.fillRect(0, 0, cntxt.canvas.width, cntxt.canvas.height)
      }

    useEffect(() => {
        const canvas = overlayRef.current
        const context = canvas.getContext('2d')
        draw(context)
    },[wave]) 

    return (
            <canvas className='canvas' ref={overlayRef} {...props} />
    )
}

export default Overlay