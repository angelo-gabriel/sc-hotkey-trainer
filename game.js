let names = []
let hotkeys = []

const universalAbilities = [
  { key: 'M', name: 'Move' },
  { key: 'S', name: 'Stop' },
  { key: 'A', name: 'Attack (and Attack Move)' },
  { key: 'H', name: 'Hold Position' },
  { key: 'P', name: 'Patrol' },
  { key: 'G', name: 'Gather' },
  { key: 'C', name: 'Return Cargo' },
  { key: 'B', name: 'Build Structure' },
  { key: 'V', name: 'Build Advanced Structure' },
  { key: 'R', name: 'Set Rally Point' },
  { key: 'L', name: 'Load' },
  { key: 'U', name: 'Unload All' },
  { key: 'Escape', name: 'Cancel' },
]

const buildingProduction = [
  { key: 'C', name: 'Command Center' },
  { key: 'S', name: 'Supply Depot' },
  { key: 'R', name: 'Refinery' },
  { key: 'B', name: 'Barracks' },
  { key: 'E', name: 'Engineering Bay' },
  { key: 'T', name: 'Missile Turret' },
  { key: 'U', name: 'Bunker' },
  { key: 'A', name: 'Academy' },
  { key: 'F', name: 'Factory' },
  { key: 'S', name: 'Starport' },
  { key: 'A', name: 'Armory' },
  { key: 'I', name: 'Science Facility' },
  { key: 'C', name: 'Comsat Station (To Command Center)' },
  { key: 'N', name: 'Nuclear Silo (To Command Center)' },
  { key: 'C', name: 'Machine Shop (To Factory)' },
  { key: 'C', name: 'Control Tower (To Starport)' },
  { key: 'P', name: 'Physics Lab (To Science Facility)' },
  { key: 'C', name: 'Covert Ops (To Science Facility)' },
]

const unitProduction = [
  { key: 'S', name: 'SCV' },
  { key: 'M', name: 'Marine' },
  { key: 'F', name: 'Firebat' },
  { key: 'C', name: 'Medic (Brood War)' },
  { key: 'G', name: 'Ghost' },
  { key: 'V', name: 'Vulture' },
  { key: 'T', name: 'Siege Tank' },
  { key: 'G', name: 'Goliath' },
  { key: 'W', name: 'Wraith' },
  { key: 'V', name: 'Science Vessel' },
  { key: 'D', name: 'Dropship' },
  { key: 'B', name: 'Battlecruiser' },
  { key: 'Y', name: 'Valkyrie (Brood War)' },
]

const allHotkeys = [
  ...universalAbilities,
  ...buildingProduction,
  ...unitProduction,
]

let currentIndex = -1
let startTime = 0
let timerDuration = 15000
let isGameOver = false

function getSelectedOptions() {
  const selected = []

  if (document.getElementById('abilities')?.checked) {
    selected.push(...universalAbilities)
  }
  if (document.getElementById('building')?.checked) {
    selected.push(...buildingProduction)
  }
  if (document.getElementById('unity')?.checked) {
    selected.push(...unitProduction)
  }

  return selected
}

function updateHotkeyList() {
  const selected = getSelectedOptions()

  if (selected.length === 0) {
    alert('Please select at least one category to start the game.')
    return false
  }

  names = selected.map((item) => item.name)
  hotkeys = selected.map((item) => item.key)

  return true
}

// função que inicia o jogo
function startGameRun() {
  if (!updateHotkeyList()) {
    return
  }

  localStorage.setItem('names', JSON.stringify(names))
  localStorage.setItem('hotkeys', JSON.stringify(hotkeys))

  window.location.href = 'game.html'
}

// função que cria novos pares de nome/hotkey
function selectNewPair(span_name, span_hk) {
  let newIndex
  do {
    newIndex = Math.floor(Math.random() * names.length)
  } while (newIndex === currentIndex)

  currentIndex = newIndex

  span_name.textContent = names[currentIndex]
  span_hk.textContent = hotkeys[currentIndex]

  startTime = performance.now()
  console.log(`New pair selected, new start time at: ${startTime}`)
}

// função que manipula o pressionamento de teclas
function handleKeyPress(event) {
  if (isGameOver) {
    return
  }

  let keyPressed = event.key.toUpperCase()
  let keyCode = event.code

  let span_keyPressed = document.getElementById('kp')
  let span_keyCode = document.getElementById('kc')
  let statusText = document.getElementById('status')
  let span_name = document.getElementById('hk_name')
  let span_hk = document.getElementById('hk')

  let endTime = performance.now()
  console.log(`key pressed at: ${endTime}`)

  if (span_keyPressed && span_keyCode && statusText && span_name && span_hk) {
    span_keyPressed.textContent = keyPressed
    span_keyCode.textContent = keyCode

    let reactionTime = endTime - startTime
    console.log(`calculated reaction time: ${reactionTime}`)
    if (keyPressed === hotkeys[currentIndex].toUpperCase()) {
      statusText.textContent = `You Got it Right! -> ${reactionTime.toFixed(
        2
      )}ms`
      statusText.style.color = 'green'
      selectNewPair(span_name, span_hk)
    } else {
      statusText.textContent = `Whomp Whomp... -> ${reactionTime.toFixed(2)}ms`
      statusText.style.color = 'red'
    }
  } else {
    console.error(`Elementos com IDs não encontrados.`)
  }
}

function startTimer() {
  setTimeout(() => {
    isGameOver = true
    let statusText = document.getElementById('status')
    if (statusText) {
      statusText.textContent = `Time's up! Game over.`
      statusText.style.color = 'blue'
    }
    console.log(`Game's over. Timer ended.`)
  }, timerDuration)
}

document.addEventListener('DOMContentLoaded', () => {
  const isGamePage = window.location.pathname.includes('game.html')

  if (isGamePage) {
    names = JSON.parse(localStorage.getItem('names')) || []
    hotkeys = JSON.parse(localStorage.getItem('hotkeys')) || []

    if (names.length === 0 || hotkeys.length === 0) {
      alert('No hotkeys loaded. Returning to main menu.')
      window.location.href = 'index.html'
      return
    }

    const span_name = document.getElementById('hk_name')
    const span_hk = document.getElementById('hk')

    if (span_name && span_hk) {
      selectNewPair(span_name, span_hk)
      startTimer()
    }
  } else {
    const startBtn = document.querySelector('.play-button')

    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.preventDefault()
        startGameRun()
      })
    }
  }
})

// event listener para o pressionamento de teclas
document.addEventListener('keydown', handleKeyPress)
