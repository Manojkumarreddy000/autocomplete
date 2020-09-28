import React,{useEffect,useState} from "react";
function getWindowD() {
    const {innerWidth:width,innerHeight:height}=window;
    return {width,height};
}
export default function useWindowD() {
    const [windowD,setWindowD]=useState(getWindowD());
    useEffect(()=>{
        function handleResize() {
            setWindowD(getWindowD());
        }
        window.addEventListener('resize',handleResize);
        return()=>window.removeEventListener('resize',handleResize);
    },[]);
    return windowD
}
