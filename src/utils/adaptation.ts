
// 适配
export const Adaptation = () => {
    const width = window.innerWidth;
    if(width<700){
        document.documentElement.style.fontSize = width / 20 + 'px'
    }else{
        document.documentElement.style.fontSize = width / 74 + 'px'
    }
}