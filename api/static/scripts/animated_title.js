class AnimatedTitle {
  constructor() {
    const containers = document.querySelectorAll("[data-animated-title='container']")

    this.containers = containers

    this.addIntersectObserver()
  }

  addIntersectObserver() {
    for (const container of this.containers) {
      const intersectObserver = new IntersectionObserver(
        (entries) => this.handleIntersectObserver(entries[0], container)
      )

      intersectObserver.observe(container)
    }
  }

  handleIntersectObserver(state, container) {
    if (state.isIntersecting)
      this.animate(container)
  }

  animate(container) {
    const fade = container.querySelector("[data-animated-title='fade']")

    gsap.to(fade, {
      keyframes: [
        { opacity: 0, duration: .25 },
        { opacity: .80, duration: .25 },
      ],
    })

    gsap.to(container, {
      keyframes: [
        { x: container.offsetWidth + 48, duration: 2, delay: .5, ease: "ease-in-out" },
        { opacity: 0, duration: .25, },
      ],
    });

  }
}

window.addEventListener("load", () => new AnimatedTitle())
