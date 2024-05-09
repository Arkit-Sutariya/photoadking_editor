import { ImageCropper, FabricCropListener } from "https://esm.sh/icropper";
import { fabric } from "https://esm.sh/fabric";

const cropButton = document.querySelector("#crop-btn");
const confirmButton = document.querySelector("#confirm-btn");
const cancelButton = document.querySelector("#cancel-btn");

const canvas = document.querySelector("#canvas");
canvas.width = 600;
canvas.height = 600;
canvas.style.setProperty("border", `${2}px solid`);
const fabricCanvas = new fabric.Canvas(canvas);

function fabricImageFromURL(url, imgOptions) {
  return new Promise((resolve, reject) => {
    try {
      fabric.Image.fromURL(url, resolve, {
        ...imgOptions,
        crossOrigin: "anonymous",
      });
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  const image = await fabricImageFromURL(
    "https://zxf9397.github.io/assets/images/pic.png",
    {
      left: 300,
      top: 50,
      scaleX: -0.5,
      scaleY: -0.5,
      angle: 45,
      flipX: true,
      flipY: true,
    }
  );

  const image2 = await fabricImageFromURL(
    "https://zxf9397.github.io/assets/images/pic.png",
    {
      left: 300,
      top: 50,
      scaleX: -0.5,
      scaleY: -0.5,
      angle: 45,
      flipX: true,
      flipY: true,
      opacity: 0,
      hasControls: false,
      selectable: false,
    }
  );

  fabricCanvas.add(image2, image);
  fabricCanvas.setActiveObject(image);

  const listener = new FabricCropListener(fabricCanvas, {
    containerOffsetX: 604,
    containerOffsetY: 2,
  });

  listener.on("cropping", (crop, source) => {
    image2.set(ImageCropper.getSource(crop, source));
    fabricCanvas.renderAll();
  });

  listener.on("start", () => {
    image2.set({
      ...ImageCropper.getSource(image, image._cropSource || image),
      opacity: 0.5,
    });
    fabricCanvas.renderAll();
  });

  listener.on("end", () => {
    image2.set({
      ...ImageCropper.getSource(image, image._cropSource || image),
      opacity: 0,
    });
    fabricCanvas.renderAll();
  });

  cropButton.addEventListener("click", listener.crop.bind(listener));
  confirmButton.addEventListener("click", listener.confirm.bind(listener));
  cancelButton.addEventListener("click", listener.cancel.bind(listener));
})();
