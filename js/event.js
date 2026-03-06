async function loadEvent () {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')

  const res = await fetch('data/events.json')
  const data = await res.json()

  let selectedEvent = null
  let categoryName = ''

  data.event_categories.forEach(category => {
    category.events.forEach(event => {
      if (event.id === id) {
        selectedEvent = event
        categoryName = category.category
      }
    })
  })

  const registerBtn = document.getElementById('register-btn')
  const paymentQR = document.getElementById('qr-image')
  const spotNote = document.getElementById('spot-note')

  if (selectedEvent.registration_type === 'spot') {
    registerBtn.style.display = 'none'
    paymentQR.style.display = 'none'

    spotNote.textContent = 'Registration will be done at the event venue.'
  } else {
    if (selectedEvent.registration_link) {
      registerBtn.href = selectedEvent.registration_link
    } else {
      registerBtn.style.display = 'none'
    }

    if (selectedEvent.payment) {
      paymentQR.src = `media/events/${selectedEvent.id}/qr.jpg`
      // Copy UPI ID to clipboard
      paymentQR.addEventListener('click', () => {
        navigator.clipboard
          .writeText(selectedEvent.payment.upi_id)
          .then(() =>
            alert('UPI ID copied! Open your UPI app and paste to pay.')
          )
          .catch(err => alert('Failed to copy UPI ID.'))
      })
    } else {
      paymentQR.style.display = 'none'
    }
  }

  if (!selectedEvent) return
  document.getElementById(
    'event-image'
  ).src = `media/events/${selectedEvent.id}/image.png`
  document.getElementById('event-title').textContent = selectedEvent.name
  document.getElementById('event-category').textContent = categoryName
  document.getElementById('event-participation').textContent =
    selectedEvent.participation
  document.getElementById('event-team').textContent =
    selectedEvent.team_size || '-'
  document.getElementById('event-fee').textContent =
    selectedEvent.registration_fee
  document.getElementById('event-description').textContent =
    selectedEvent.description

  const prizeBox = document.getElementById('event-prize')

  let prizeHTML = ''

  for (const place in selectedEvent.prize) {
    prizeHTML += `<p><strong>${place}</strong> : ${selectedEvent.prize[place]}</p>`
  }

  prizeBox.innerHTML = prizeHTML

  document.getElementById('event-winning').textContent =
    selectedEvent.winning_criteria || 'Based on judges evaluation.'

  const flowList = document.getElementById('event-flow')

  if (selectedEvent.event_flow) {
    selectedEvent.event_flow.forEach(step => {
      const li = document.createElement('li')
      li.textContent = step
      flowList.appendChild(li)
    })
  }
}

loadEvent()
