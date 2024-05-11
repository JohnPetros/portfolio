class Tabs {
  constructor() {
    const tabs = document.querySelectorAll("button[data-tabs]")
    const contentContainer = document.querySelector("[data-tabs='container']")

    if (!tabs.length || !contentContainer) return

    const firstTab = tabs[0]
    firstTab.classList.add("active-tab")

    this.activeTabContentId = firstTab.dataset.tabs
    this.tabs = tabs
    this.delay = 700 // ms

    for (const tab of this.tabs) {
      tab.addEventListener("click", (event) => this.handleTabClick(event))

      const contentId = tab.dataset.tabs
      if (contentId != this.activeTabContentId) {
        this.hideTabContent(contentId)
      }
    }
  }

  showTabContent(contentId) {
    const tabContent = document.querySelector(contentId)

    if (!tabContent) return
    const items = tabContent.querySelectorAll("[data-tabs='item']")

    setTimeout(() => {
      for (const item of items) {
        item.classList.add("invisible", "intersect:visible", "intersect:animate-fade-up")
        item.classList.remove("animate-out", "fade-out", "slide-out-to-bottom-52")
      }

      tabContent.childNodes[1].classList.remove("hidden")
    }, this.delay)

  }

  hideTabContent(contentId) {
    const tabContent = document.querySelector(contentId)

    if (!tabContent) return

    const items = tabContent.querySelectorAll("[data-tabs='item']")

    for (const item of items) {
      item.classList.remove("invisible", "intersect:visible", "intersect:animate-fade-up")
      item.classList.add("animate-out", "fade-out", "slide-out-to-bottom-52")
    }

    setTimeout(() => {
      tabContent.childNodes[1].classList.add("hidden")
    }, this.delay)
  }

  toggleTabs(currentTab) {
    for (const tab of this.tabs)
      tab.classList.remove("active-tab")

    currentTab.classList.add("active-tab")
  }

  handleTabClick(event) {
    const currentTab = event.currentTarget
    const tabContentId = currentTab.dataset.tabs

    if (this.activeTabContentId !== tabContentId) {
      this.hideTabContent(this.activeTabContentId)
      this.showTabContent(tabContentId)
      this.activeTabContentId = tabContentId

      this.toggleTabs(currentTab)
    }
  }
}

window.addEventListener("load", () => new Tabs())