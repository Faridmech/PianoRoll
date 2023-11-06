import PianoRollDisplay from "./pianoDisplay.js"

document.getElementById("loadCSV").addEventListener("click", async () => {
  const csvToSVG = new PianoRollDisplay()
  console.log("this is generated svg", await csvToSVG.preparePianoRollCard(4))
  await csvToSVG.generateSVGs()
})
