import PianoRoll from "./pianoroll.js"

class PianoRollDisplay {
  constructor(csvURL) {
    this.csvURL = csvURL
    this.data = null
    console.count("hi")
    this.ID = []
    console.log("id", this.ID)
  }

  async getDetailedData(id) {
    if (!this.data) await this.loadPianoRollData()
    if (!this.data) return

    const start = id * 60
    const end = start + 60
    const partData = this.data.slice(start, end)

    return { id, partData }
  }

  async loadPianoRollData() {
    try {
      const response = await fetch("https://pianoroll.ai/random_notes")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      this.data = await response.json()
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  preparePianoRollCardSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.classList.add("piano-roll-svg")
    svg.setAttribute("width", "80%")
    svg.setAttribute("height", "150")
    return svg
  }

  preparePianoRollCardRemainSvg() {
    const remain_svg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "remain_svg"
    )
    remain_svg.classList.add("piano-roll-svg")
    remain_svg.setAttribute("width", "20%")
    remain_svg.setAttribute("height", "30")
    return remain_svg
  }

  preparePianoRollCard(rollId) {
    const cardDiv = document.createElement("div")
    cardDiv.classList.add("piano-roll-card")
    const descriptionDiv = document.createElement("div")
    descriptionDiv.classList.add("description")
    descriptionDiv.textContent = `This is a piano roll number ${rollId}`
    cardDiv.appendChild(descriptionDiv)
    cardDiv.setAttribute("id", `${rollId}`)
    const svg = this.preparePianoRollCardSvg()
    cardDiv.appendChild(svg)

    this.ID.push(rollId)

    return { cardDiv, svg }
  }

  async generateSvg(id) {
    if (!this.data) await this.loadPianoRollData()
    if (!this.data) return

    new PianoRoll(svg, partData, remain_svg)

    return pianoRollContainer
  }

  async generateSVGs() {
    if (!this.data) await this.loadPianoRollData()
    if (!this.data) return

    const pianoRollContainer = document.getElementById("pianoRollContainer")

    pianoRollContainer.addEventListener("click", (e) => {
      const element = e.target
      var cardContainerId = element.closest(".piano-roll-card").id
      window.location.href = `detail.html?id=${cardContainerId}`
    })

    pianoRollContainer.innerHTML = ""

    for (let i = 0; i < 20; i++) {
      const start = i * 60
      const end = start + 60
      const partData = this.data.slice(start, end)

      const { cardDiv, svg } = this.preparePianoRollCard(i)

      pianoRollContainer.appendChild(cardDiv)

      cardDiv.dataset.partData = JSON.stringify(partData)
      const roll = new PianoRoll(svg, partData)
    }
    return pianoRollContainer
  }
}

export default PianoRollDisplay
