import React from 'react';

function StampImage(props) {
  const stampRef = React.useRef(null);
  // let stampScale = React.useRef(1);
  // let timeoutFunc = React.useRef(null);

  // const zoom = useCallback(event => {  
  //   stampScale.current += event.deltaY * -0.01;
  
  //   // Restrict stampScale
  //   stampScale.current = Math.min(Math.max(.125, stampScale.current), 4);
  
  //   // Apply stampScale transform
  //   stampRef.current.style.transform = `scale(${stampScale.current})`;
    
  //   if (timeoutFunc) clearTimeout(timeoutFunc);

  //   timeoutFunc.current = setTimeout(() => {
  //     props.resizeStamp({
  //       height: stampRef.current.height * stampScale.current,
  //       width: stampRef.current.width * stampScale.current,
  //     })
  //   }, 1000);
  // }, [props]);

  // useEffect(() => {
  //   stampRef.current.addEventListener("wheel", event => {
  //     zoom(event);
  //   }, {passive: true});
  // }, [zoom]);

  return (
    <img
      ref={stampRef}
      src={props.src}
      height={props.height}
      width={props.width}
      alt="stamp"
    >
    </img>
  );
}
export default StampImage;