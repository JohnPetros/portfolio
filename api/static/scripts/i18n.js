class I18n {
  storageKey = "john-petros@language"

  constructor() {
    const toggle = document.querySelector("[data-i18n='toggle']")
    const languages = document.querySelectorAll("[data-i18n='language']")
    const texts = document.querySelectorAll("[data-i18n]")

    if (!toggle || !languages.length || !texts.length) return

    const storagedLanguageId = localStorage.getItem(this.storageKey)
    this.activeLanguageId = storagedLanguageId ?? languages[0].id
    this.languages = languages

    toggle.addEventListener("click", () => this.handleToggleClick())

    if (!texts.length) return
    this.texts = texts

    if (this.activeLanguageId !== "br") {
      this.toggleTextsLanguage()
      this.languages[0].classList.add("brightness-50")
      this.languages[1].classList.remove("brightness-50")
    }
  }

  toggleTextsLanguage() {
    for (const text of this.texts) {
      const translation = text.dataset.i18n

      if (!translation || ["toggle", "language"].includes(translation))
        continue

      const currentContent = text.innerHTML

      text.innerHTML = translation
      text.setAttribute("data-i18n", currentContent)
    }
  }

  handleToggleClick() {
    for (const language of this.languages)
      language.classList.add("brightness-50")

    for (const language of this.languages) {
      if (language.id !== this.activeLanguageId) {
        language.classList.remove("brightness-50")
        this.activeLanguageId = language.id
        break
      }
    }

    this.toggleTextsLanguage()
    localStorage.setItem(this.storageKey, this.activeLanguageId)
  }
}

window.addEventListener('load', new I18n())