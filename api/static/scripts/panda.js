class Panda {
  constructor() {
    const pandaImage = document.querySelector("[data-panda='image']")
    const wave = document.querySelector("[data-panda='wave']")
    const background = document.querySelector("[data-panda='background']")
    const speechBubble = document.querySelector("[data-panda='speech-bubble']")
    const pageContent = document.querySelector("[data-panda='page-content']")
    const quote = document.querySelector("[data-panda='quote']")
    const buttonOut = document.querySelector("[data-panda='button-out']")
    const buttonIn = document.querySelector("[data-panda='button-in']")

    const heroLeft = document.querySelector("[data-panda='hero-left']")
    const heroRight = document.querySelector("[data-panda='hero-right']")

    this.pandaImage = pandaImage
    this.wave = wave
    this.background = background
    this.speechBubble = speechBubble
    this.pageContent = pageContent
    this.heroLeft = heroLeft
    this.heroRight = heroRight
    this.quote = quote
    this.buttonOut = buttonOut
    this.buttonIn = buttonIn

    this.buttonOut.addEventListener("click", () => this.handleButtonOutClick())
    this.buttonIn.addEventListener("click", () => this.handleButtonInClick())

    this.shouldAnimate = JSON.parse(localStorage.getItem("john-petros@panda-animation")) ?? true

    if (this.shouldAnimate) {
      this.showButton()

      this.showRandomQuote()
      this.animateSpeechBubble()
      return
    }

    this.handleButtonOutClick()
  }

  storeState() {
    localStorage.setItem("john-petros@panda-animation", this.shouldAnimate)
  }

  wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
  }

  async showRandomQuote() {
    const quotes = ["toma", "petros", "eita", "codar codar e codar", "foguete não tem ré", "o que você quer tá mole"]
    let randomNumber = 0

    do {
      randomNumber = Math.floor(Math.random() * quotes.length)
    } while (randomNumber == this.randomNumber)

    this.randomNumber = randomNumber

    this.quote.innerHTML = quotes[randomNumber]
  }

  async animateSpeechBubble() {
    if (!this.shouldAnimate) return

    this.speechBubble.classList.remove("animate-fade-out")
    this.speechBubble.classList.add("animate-fade-in")
    await this.wait(2)
    this.speechBubble.classList.remove("animate-fade-in")
    this.speechBubble.classList.add("animate-fade-out")
    await this.wait(2)
    this.showRandomQuote()
    requestAnimationFrame(() => this.animateSpeechBubble())
  }

  async showButton() {
    this.buttonOut.classList.remove("invisible")
    this.buttonOut.classList.add("animate-rotate-in")
    await this.wait(0.5)
    this.buttonOut.classList.remove("animate-rotate-in")
    this.buttonOut.classList.add("animate-pulsing", "animate-infinite")
  }

  hideHero() {
    this.heroLeft.classList.remove("animate-fade-in-right")
    this.heroRight.classList.remove("animate-fade", "animate-delay-500")

    this.heroLeft.classList.add("animate-fade-out-left")
    this.heroRight.classList.add("animate-fade-out")
  }

  showHero() {
    this.heroLeft.classList.remove("animate-fade-out-left")
    this.heroRight.classList.remove("animate-fade-out")

    this.heroLeft.classList.add("animate-fade-in-right")
    this.heroRight.classList.add("animate-fade", "animate-delay-500")
  }

  async animateOut() {
    this.pandaImage.classList.add("animate-flip-out-x")
    this.speechBubble.classList.add("animate-fade-out-up")
    this.wave.classList.add("animate-fade-out-left")

    if (this.shouldAnimate) await this.wait(0.5)
    this.background.classList.remove("animate-fade-left")
    this.background.classList.add("animate-fade-out")
    if (this.shouldAnimate) await this.wait(0.5)
    this.background.classList.add("hidden")
    this.pageContent.classList.remove("sr-only")
    if (this.shouldAnimate) await this.wait(0.25)
    this.showHero()
  }

  async animateIn() {
    this.hideHero()
    await this.wait(1)

    this.pandaImage.classList.remove("animate-flip-out-x")
    this.speechBubble.classList.remove("animate-fade-out-up")
    this.wave.classList.remove("animate-fade-out-left")

    this.background.classList.remove("hidden")
    this.background.classList.remove("animate-fade-out")
    this.background.classList.add("animate-fade-left")
    this.showButton()
    this.pageContent.classList.add("sr-only")
  }

  async handleButtonOutClick() {
    await this.wait(1)

    this.buttonOut.classList.add("invisible")

    this.animateOut()

    this.shouldAnimate = false
    this.storeState()
  }

  handleButtonInClick() {
    this.shouldAnimate = true
    this.storeState()

    this.animateIn()
    this.animateSpeechBubble()
  }
}

window.addEventListener("load", () => new Panda())