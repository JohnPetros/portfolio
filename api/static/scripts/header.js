class Header {
  activeClass = "bg-gray-900 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 shadow-lg translate-y-1"

  constructor() {
    const container = document.querySelector('[data-header="container"]')
    const trigger = document.querySelector('[data-header="trigger"]')

    if (!container || !trigger) return

    this.container = container
    const intersectObserver = new IntersectionObserver(
      (entries) => this.handleIntersectObserver(entries[0])
    )

    intersectObserver.observe(trigger)
  }

  handleIntersectObserver(trigger) {
    if (trigger.isIntersecting || trigger.boundingClientRect.y < 0) {
      this.container.classList.add(...this.activeClass.split(" "))
    } else {
      this.container.classList.remove(...this.activeClass.split(" "))
    }
  }
}

window.addEventListener("load", () => new Header())