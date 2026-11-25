const menuBtn = document.querySelector(".menu-btn")
const nav = document.getElementById("nav")
const header = document.querySelector(".top")
const progress = document.querySelector(".progress")
const indicator = document.querySelector(".indicator")
const navLinks = document.querySelectorAll("nav a")
const sections = document.querySelectorAll("main section")
const typed = document.getElementById("typed")

function toggleMenu() {
  nav.classList.toggle("open")
  menuBtn.classList.toggle("open")
  document.body.classList.toggle("no-scroll")

  if (nav.classList.contains("open")) {
    menuBtn.setAttribute("aria-expanded", "true")
    menuBtn.setAttribute("aria-label", "Close menu")
  } else {
    menuBtn.setAttribute("aria-expanded", "false")
    menuBtn.setAttribute("aria-label", "Open menu")
  }
}

menuBtn.addEventListener("click", toggleMenu)

nav.addEventListener("click", () => {
  if (nav.classList.contains("open")) toggleMenu()
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    toggleMenu()
    menuBtn.focus()
  }
})

function moveIndicator(link) {
  if (link) {
    indicator.style.left = link.offsetLeft + "px"
    indicator.style.width = link.offsetWidth + "px"
    indicator.style.opacity = 1
  } else {
    indicator.style.opacity = 0
  }
}

function showActiveLink() {
  moveIndicator(document.querySelector("nav a.active"))
}

navLinks.forEach(link => {
  link.addEventListener("mouseenter", () => moveIndicator(link))
  link.addEventListener("focus", () => moveIndicator(link))
})
nav.addEventListener("mouseleave", showActiveLink)
nav.addEventListener("focusout", showActiveLink)

function handleScroll() {
  const scrolled = window.scrollY
  const pageHeight = document.body.scrollHeight - window.innerHeight
  progress.style.width = (scrolled / pageHeight) * 100 + "%"

  if (scrolled > 20) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }

  let current = ""
  sections.forEach(section => {
    if (scrolled >= section.offsetTop - 200) current = section.id
    if (scrolled + window.innerHeight > section.offsetTop + 100) section.classList.add("show")
  })
  if (scrolled >= pageHeight - 5) current = sections[sections.length - 1].id

  navLinks.forEach(link => {
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active")
      link.setAttribute("aria-current", "true")
    } else {
      link.classList.remove("active")
      link.removeAttribute("aria-current")
    }
  })
  showActiveLink()
}

sections.forEach(section => {
  if (section.id !== "home") section.classList.add("reveal")
})

window.addEventListener("scroll", handleScroll)
window.addEventListener("resize", handleScroll)
window.addEventListener("load", handleScroll)

let phraseIndex = 0
let letterIndex = 0
let deleting = false

function type() {
  const phrase = phrases[phraseIndex]
  if (deleting) {
    letterIndex--
  } else {
    letterIndex++
  }
  typed.textContent = phrase.slice(0, letterIndex)

  let delay = 80
  if (deleting) delay = 40
  if (!deleting && letterIndex === phrase.length) {
    deleting = true
    delay = 1600
  }
  if (deleting && letterIndex === 0) {
    deleting = false
    phraseIndex++
    if (phraseIndex === phrases.length) phraseIndex = 0
    delay = 400
  }
  setTimeout(type, delay)
}

type()

function getChips(list) {
  return list.map(item => `<li>${item}</li>`).join("")
}

function getButton(url, label, soonLabel) {
  if (url) {
    return `<a class="btn small" href="${url}" target="_blank" rel="noopener">${label}</a>`
  }
  return `<span class="btn small off">${soonLabel}</span>`
}

document.getElementById("skills").innerHTML = getChips(skills)
document.getElementById("tools").innerHTML = getChips(tools)

function getCard(project) {
  return `
    <article class="card">
      <div class="thumb">
        ${project.image ? `<img src="${project.image}" alt="${project.name} screenshot">` : `<span>${project.name.charAt(0)}</span>`}
      </div>
      <div class="card-body">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <ul class="chips">${getChips(project.tools)}</ul>
        <div class="links">
          ${getButton(project.live, "Live demo", "Live demo soon")}
          ${getButton(project.github, "GitHub", "GitHub soon")}
        </div>
      </div>
    </article>
  `
}

document.getElementById("project-list").innerHTML = projects.map(project => getCard(project)).join("")
document.getElementById("more-list").innerHTML = moreProjects.map(project => getCard(project)).join("")

document.getElementById("year").textContent = new Date().getFullYear()

const moreBtn = document.getElementById("moreBtn")
const moreBox = document.getElementById("more-projects")

moreBtn.addEventListener("click", () => {
  if (moreBox.hidden) {
    moreBox.hidden = false
    moreBtn.textContent = "Hide the extra projects"
    moreBtn.setAttribute("aria-expanded", "true")
    moreBox.scrollIntoView()
  } else {
    moreBox.hidden = true
    moreBtn.textContent = "See the rest of my projects"
    moreBtn.setAttribute("aria-expanded", "false")
  }
})