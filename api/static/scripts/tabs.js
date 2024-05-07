class Tabs {
  constructor() {
    const tabs = document.querySelectorAll("[data-tabs]")

    if (!tabs.length) return

    const firstTab = tabs[0]
    firstTab.classList.add("active-tab")
    this.activeTabContentId = firstTab.dataset.tabs

    for (const tab of tabs) {
      tab.addEventListener("click", (event) => this.handleTabClick(event))
    }

    this.tabs = tabs
  }

  showTabContent(contentId) {
    const tabContent = document.querySelector(contentId)

    if (tabContent)
      tabContent.classList.remove("hidden-tab-content")
  }

  hideTabContent(contentId) {
    const tabContent = document.querySelector(contentId)

    if (tabContent)
      tabContent.classList.add("hidden-tab-content")
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
      this.showTabContent(tabContentId)
      this.hideTabContent(this.activeTabContentId)
      this.activeTabContentId = tabContentId

      this.toggleTabs(currentTab)
    }

  }
}

window.addEventListener("load", () => new Tabs())