const canvas = document.querySelector("canvas"),
toolBtn = document.querySelectorAll('.tool'),
filColor = document.querySelector('#fil-color'),
sizeSlider = document.querySelector('#size-slider'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('#clear-canvas'),
saveImg = document.querySelector('#save-img'),
colorBtn = document.querySelectorAll('.colors .option'),
ctx = canvas.getContext("2d");
ctx.stroke();
// getContext() maethod return a drawing context on the canvas and ctx is a variable to represent the canvas context
 
// global variable 
let preMouseX , preMouseY, snapshot,
isDrawing = false,
selectedTool = 'brush',
selectedColor = '#000',
brushWidth = 5;

const setCanvasBackground = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
})

const drawRect = (e) => {
    if(!filColor.checked){
       return ctx.strokeRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
}
const drawCircle = (e) => {
    ctx.beginPath();
   let radius = Math.sqrt(Math.pow((preMouseX-e.offsetX),2) + Math.pow((preMouseY-e.offsetY),2))
   ctx.arc(preMouseX,preMouseY,radius,0,2*Math.PI);
   filColor.checked ? ctx.fill() : ctx.stroke();
}
const drawTriangle = (e) => {
  ctx.beginPath();  //creating new path to draw circle
  ctx.moveTo(preMouseX,preMouseY);  //moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY);  // creating first line acco to the mouse pointer
  ctx.lineTo(preMouseX * 2 - e.offsetX,e.offsetY);  //creating bootom line
  ctx.closePath();  // closing path of a triangle so that third line draw automatically
  filColor.checked ? ctx.fill() : ctx.stroke();
}

const startdraw = (e)=>{
    isDrawing = true;
    preMouseX = e.offsetX;
    preMouseY = e.offsetY;
    ctx.beginPath();  //creating a new path
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    // coping canvas data and passing as snapshot value and this avoid dragging the image
    snapshot = ctx.getImageData(0,0,canvas.width,canvas.height);
}

const drawing = (e)=>{
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0); //adding copied canvas data on to this canvas

    if(selectedTool === 'brush' || selectedTool === 'Erasor'){
        ctx.strokeStyle = selectedTool === 'Erasor' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke(); 
    }
    else if(selectedTool === 'rectangle'){
        drawRect(e);
    }
    else if(selectedTool === 'circle'){
        drawCircle(e);
    }
    else{
        drawTriangle(e);
    }
    
}

toolBtn.forEach((btn)=>{
  btn.addEventListener('click',()=>{
    document.querySelector(".options  .active").classList.remove("active");
    btn.classList.add('active');
    selectedTool = btn.id;
    // console.log(selectedTool);
  });
});

sizeSlider.addEventListener('change',() => brushWidth = sizeSlider.value);

colorBtn.forEach((btn)=>{
 btn.addEventListener('click',()=>{
    btn.classList.add('selected');
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
 });
});

colorPicker.addEventListener('change',() => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener('click',() => {
    ctx.clearRect(0,0,canvas.width,canvas.height); // claering the canvas
    setCanvasBackground();
})

saveImg.addEventListener('click',() => {
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`; // passing current date as link download button
    link .href = canvas.toDataURL();  // passing  canvas data as link href value
    link.click(); //clicking the to download img 
 })

canvas.addEventListener('mousedown',startdraw);
canvas.addEventListener('mousemove',drawing);
canvas.addEventListener('mouseup',()=>{
    isDrawing = false;
});
