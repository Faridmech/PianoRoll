import PianoRoll from "./pianoroll.js"
import PianoRollDisplay from "./pianoDisplay.js"

const pathname = window.location.toString()
const id = new URL(pathname).searchParams.get("id")

;(async () => {
  const csvToSVG = new PianoRollDisplay()
  const detailedData = await csvToSVG.getDetailedData(Number(id))

  const pianoRollContainer = document.querySelector(".main-pianoRoll-container")

  const selectedPianoRollContainer = document.createElement("div")
  pianoRollContainer.append(selectedPianoRollContainer)

  const otherPianoRollContainer = document.createElement("div")
  otherPianoRollContainer.classList.add("other-pianoRoll-container")
  pianoRollContainer.append(otherPianoRollContainer)

  const selectedSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  )

  selectedSvg.classList.add("piano-roll-svg-detail")
  new PianoRoll(selectedSvg, detailedData.partData)

  selectedPianoRollContainer.appendChild(selectedSvg)

  const descriptionDiv = document.createElement("div")
  descriptionDiv.classList.add("description-detail")
  descriptionDiv.innerHTML = `Selected piano roll number is: <b>${detailedData.id}</b>`
  selectedPianoRollContainer.appendChild(descriptionDiv)

  let previousSelectedData = null

  const updateSelectedPianoRoll = async (i) => {
    const otherPartData = await csvToSVG.getDetailedData(i)
    selectedSvg.innerHTML = ""
    new PianoRoll(selectedSvg, otherPartData.partData)

    descriptionDiv.innerHTML = `Selected piano roll number is: <b>${i}</b>`

    history.pushState({}, "", `detail.html?id=${i}`)

    if (previousSelectedData) {
      const prevOther = document.createElement("div")
      prevOther.classList.add("other")
      const prevOtherSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      )

      prevOtherSvg.classList.add("piano-roll-svg-detail-right")
      new PianoRoll(prevOtherSvg, previousSelectedData.partData)

      const prevOtherDescriptionDiv = document.createElement("div")
      prevOtherDescriptionDiv.classList.add("description-detail-other")
      prevOtherDescriptionDiv.innerHTML = `Description for piano roll number ${previousSelectedData.id}`

      prevOther.appendChild(prevOtherSvg)
      prevOther.appendChild(prevOtherDescriptionDiv)

      otherPianoRollContainer.appendChild(prevOther)
    }

    previousSelectedData = otherPartData
  }

  for (let i = 0; i < 20; i++) {
    if (i !== detailedData.id) {
      const otherPartData = await csvToSVG.getDetailedData(i)
      const other = document.createElement("div")
      other.classList.add("other")
      const otherSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      )

      otherSvg.classList.add("piano-roll-svg-detail-right")
      new PianoRoll(otherSvg, otherPartData.partData)

      const otherDescriptionDiv = document.createElement("div")
      otherDescriptionDiv.classList.add("description-detail-other")
      otherDescriptionDiv.innerHTML = `Description for piano roll number ${i}`

      other.appendChild(otherSvg)
      other.appendChild(otherDescriptionDiv)

      otherPianoRollContainer.appendChild(other)

      otherSvg.addEventListener(
        "click",
        ((index) => async () => {
          otherPianoRollContainer.removeChild(other)

          await updateSelectedPianoRoll(index)
        })(i)
      )
    }
  }
})()
