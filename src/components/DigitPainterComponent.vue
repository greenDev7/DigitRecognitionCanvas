<template>
  <div id="container">
    <table id="mainTable">
      <tr>
        <td>
          <table id="canvasTable">
            <tr>
              <td id="caption" class="font">Нарисуйте цифру (от 0 до 9)</td>
            </tr>
            <tr>
              <table style="margin-bottom: 10px">
                <tr>
                  <td class="font">Толщина линии:</td>
                  <td>
                    <span style="margin-right: 10px">
                      <input
                        type="radio"
                        name="thickness"
                        id="rb1"
                        value="1"
                        v-model="lineToDrawThickness"
                      />
                      <label for="rb1">1</label>
                    </span>
                    <span
                      ><input
                        type="radio"
                        name="thickness"
                        id="rb2"
                        value="2"
                        v-model="lineToDrawThickness"
                      />
                      <label for="rb2">2</label></span
                    >
                  </td>
                </tr>
              </table>
            </tr>
            <tr>
              <td><canvas ref="canvas"></canvas></td>
            </tr>
            <tr>
              <td>
                <button
                  class="font"
                  id="recogniseButton"
                  @click="recogniseImage"
                >
                  Распознать
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  class="font"
                  id="clearCanvasButton"
                  @click="clearCanvas"
                >
                  Очистить холст
                </button>
              </td>
            </tr>
          </table>
        </td>
        <td>
          <table id="predictedNumberTable">
            <tr>
              <td class="font">Ваша цифра</td>
            </tr>
            <tr>
              <td id="digitCell">{{ predictedDigit }}</td>
            </tr>
          </table>
        </td>
        <td>
          <table id="listOfDigitsTable">
            <tr v-for="(item, index) in matchList" :key="index">
              <td>{{ index }}</td>
              <td>{{ item }}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import digitCanvas from "../assets/digitCanvas.png";
import Network from "../model/Network";
import hiddenWeights from "../model/hiddenWeights.json";
import outputWeights from "../model/outputWeights.json";
export default {
  name: "DigitPainter",

  props: {
    gripLineThickness: Number,
    imageSizeLength: Number,
    squareSizeLength: Number,
  },

  data() {
    let commonWidthAndHeight = this.imageSizeLength * this.squareSizeLength;
    let canDraw = false;
    let network = new Network(hiddenWeights, outputWeights);
    return {
      commonWidthAndHeight,
      canDraw,
      lineToDrawThickness: 2,
      predictedDigit: "",
      matchList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      network,
    };
  },

  methods: {
    drawTemplate() {
      let canvas = this.$refs.canvas;
      if (canvas.getContext) {
        let ctx = canvas.getContext("2d");

        ctx.canvas.width = this.commonWidthAndHeight;
        ctx.canvas.height = this.commonWidthAndHeight;

        // Set canDraw to true when mouse is pressed
        ctx.canvas.addEventListener("mousedown", (e) => (this.canDraw = true));
        // Set canDraw to false when mouse is released
        ctx.canvas.addEventListener("mouseup", (e) => (this.canDraw = false));

        ctx.canvas.addEventListener("click", (e) =>
          this.colorPixel(ctx, e, this.squareSizeLength, this.gripLineThickness)
        );

        ctx.canvas.addEventListener("mousemove", (e) => {
          if (!this.canDraw) return;
          this.colorPixel(
            ctx,
            e,
            this.squareSizeLength,
            this.gripLineThickness
          );
        });

        this.disableSmoothing(ctx);
        this.bindImageToCanvas(ctx);
      }
    },

    drawImage(ctx, img) {
      ctx.drawImage(
        img,
        0,
        0,
        this.commonWidthAndHeight,
        this.commonWidthAndHeight
      );

      this.makeGrip(ctx, this.gripLineThickness);
    },

    makeGrip(ctx, thickness) {
      ctx.beginPath();

      ctx.lineWidth = thickness;
      ctx.setLineDash([]);

      const width = ctx.canvas.width;
      const height = ctx.canvas.height;

      for (let x = 0; x <= width; x += this.squareSizeLength) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      for (let y = 0; y <= height; y += this.squareSizeLength) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();
    },

    disableSmoothing(ctx) {
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
    },

    colorPixel(ctx, eventArgs) {
      let pX = Math.floor(eventArgs.offsetX / this.squareSizeLength);
      let pY = Math.floor(eventArgs.offsetY / this.squareSizeLength);

      let squareLength = this.squareSizeLength;

      let blackSquare = this.getBlackSquare(
        ctx,
        squareLength * this.lineToDrawThickness
      );
      ctx.putImageData(blackSquare, pX * squareLength, pY * squareLength);
    },

    getBlackSquare(ctx, squareLength) {
      let blackSquare = ctx.createImageData(squareLength, squareLength);

      // Iterate through every pixel
      for (let i = 0; i < blackSquare.data.length; i += 4) {
        // Modify pixel data
        // blackSquare.data[i + 0] = 0;  // R value
        // blackSquare.data[i + 1] = 0;  // G value
        // blackSquare.data[i + 2] = 0;  // B value
        blackSquare.data[i + 3] = 255; // A value
      }

      return blackSquare;
    },

    clearCanvas() {
      let canvas = this.$refs.canvas;
      if (canvas.getContext) {
        let ctx = canvas.getContext("2d");
        this.bindImageToCanvas(ctx);
        this.predictedDigit = "";
        this.matchList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    },

    bindImageToCanvas(ctx) {
      let img = new Image();
      img.src = digitCanvas;
      img.onload = () => {
        this.drawImage(ctx, img);
      };
    },

    getFunctionSignalFromImage() {
      let canvas = this.$refs.canvas;
      if (canvas.getContext) {
        let ctx = canvas.getContext("2d");

        let w = this.imageSizeLength;
        let h = this.imageSizeLength;
        let s = this.squareSizeLength;
        let swh = s / 2;
        let shh = s / 2;

        let pixels = [];
        for (let i = 0; i < w; i++) {
          let pX = i * s + swh;

          for (let j = 0; j < h; j++) {
            let pY = j * s + shh;
            let pixel = ctx.getImageData(pY, pX, 1, 1);
            pixels.push(pixel.data[0] === 255 ? 0 : 1);
          }
        }

        //console.log(pixels);
        return pixels;
      }
    },

    recogniseImage() {
      let functionSignal = this.getFunctionSignalFromImage();

      if (functionSignal.every((x) => x === 0)) {
        window.alert("Нарисуйте какую-нибудь цифру!");
        return;
      }

      // Получаем ответ от нейросети
      let outputSignal = this.network.makePropagateForward(functionSignal);
      // Находим распознанную цифру (индекс максимального элемента в outputSignal)
      this.predictedDigit = outputSignal
        .indexOf(Math.max(...outputSignal))
        .toString();

      // Получаем новый массив с округленными (до 1000-ых) значениями
      // чтобы показать с какой вероятностью нейросети предсказала
      // ту или иную цифру
      this.matchList = outputSignal.map(
        (x) => (x = Math.round((x + Number.EPSILON) * 1000) / 1000)
      );
    },
  },

  mounted() {
    this.drawTemplate();
  },
};
</script>

<style>
#canvasTable {
  border: 1px dashed rgb(99, 99, 99);
  padding: 10px;
}
#predictedNumberTable {
  border: 1px dashed rgb(99, 99, 99);
  margin: 110px;
  padding: 10px;
}
#listOfDigitsTable {
  border: 1px dashed rgb(185, 185, 185);
  margin-left: 0px;
  padding: 5px;
}

#listOfDigitsTable > tr > td {
  padding-bottom: 20px;
  padding-right: 15px;
}

#digitCell {
  text-align: center;
  padding: 30px;
  font: 3em "Fira Sans", sans-serif;
}
canvas {
  border: 1px dashed black;
  cursor: crosshair;
}
button {
  margin-top: 15px;
  width: 100%;
  height: 30px;
}
.font {
  text-align: center;
  font: 0.9em "Fira Sans", sans-serif;
}
#caption {
  padding-bottom: 10px;
}
</style>