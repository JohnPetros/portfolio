class CV {
  constructor() {
    const link = document.querySelector("[data-cv='link']")

    if (!link) return

    const storagedLanguageId = localStorage.getItem("john-petros@language")

    this.link = link

    this.pdfLanguage = "ptbr"

    if (storagedLanguageId !== "en") {
      this.setCVLink("ptbr")
    }

    document.addEventListener("i18n:toggle", () => this.togglePdfLanguage())
  }

  togglePdfLanguage() {
    if (this.pdfLanguage === "ptbr") {
      this.pdfLanguage = "en"
      this.setCVLink(this.pdfLanguage)
      return
    }

    if (this.pdfLanguage === "en") this.pdfLanguage = "ptbr"
    this.setCVLink(this.pdfLanguage)
  }

  setCVLink(pdfLanguage) {
    this.link.href = `static/pdf/petros-cv-${pdfLanguage}.pdf`
  }
}

window.addEventListener("load", new CV())
