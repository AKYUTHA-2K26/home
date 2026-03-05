async function loadEvents() {

  const res = await fetch('data/events.json')
  const data = await res.json()

  const container = document.getElementById('events-container')
  const heroImg = document.getElementById('hero-image')

  let heroImages = []

  data.event_categories.forEach(category => {

    const section = document.createElement('div')
    section.className = 'category-section'

    section.innerHTML = `
      <h2 class="category-title">${category.category}</h2>
      <div class="events-grid"></div>
    `

    const grid = section.querySelector('.events-grid')

    category.events.forEach(event => {

      const imagePath = `media/events/${event.id}/image.png`

      // collect hero images
      heroImages.push(imagePath)

      const card = document.createElement('div')
      card.className = 'event-card'
      card.style.backgroundImage = `url(${imagePath})`

      card.innerHTML = `
        <h3>${event.name}</h3>

        <p>${event.description?.substring(0, 80) || ''}...</p>

        <div class="event-meta">
          <p>👥 ${event.participation}</p>
          <p>💰 ${event.registration_fee}</p>
        </div>
      `

      card.onclick = () => {
        window.location.href = `event.html?id=${event.id}`
      }

      grid.appendChild(card)

    })

    container.appendChild(section)

  })

  // start hero slider after images collected
  startHeroSlider(heroImages)

}

function startHeroSlider(images){

  const img1 = document.getElementById("hero-img1")
  const img2 = document.getElementById("hero-img2")

  let index = 0
  let current = img1
  let next = img2

  current.src = images[0]
  current.classList.add("active")

  setInterval(()=>{

    index = (index + 1) % images.length

    next.src = images[index]

    next.classList.add("active")
    current.classList.remove("active")

    let temp = current
    current = next
    next = temp

  },2000)

}

loadEvents()