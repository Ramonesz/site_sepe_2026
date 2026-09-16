const audio = new Audio()
const audioEntradaSite = new Audio('../audio/efeitos sonoros/efeito-entrada-site.wav')
const audioClique = new Audio('../audio/efeitos sonoros/efeito-clique-navegacao.wav')
const audioRespostaCerta = new Audio('../audio/efeitos sonoros/efeito-resposta-correta.mp3')
const audioRespostaErrada = new Audio('../audio/efeitos sonoros/efeito-resposta-incorreta.mp3')
const audioVictory = new Audio('../audio/efeitos sonoros/efeito-vitoria.mp3')
const botaoFechar = document.querySelector('#botao-fechar')
const botaoPausar = document.querySelector('#botao-pausar')
const nomeMusica = document.querySelector('#nome-musica')
const nomeArtista = document.querySelector('#nome-artista')
const cartoesMusicais = document.querySelectorAll('.cartao-musical')
const progress = document.querySelector('.progress')
const progressFill = progress?.querySelector('span')
const volumeButtons = document.querySelectorAll('.volume-btn')
const volumeSlider = document.querySelector('.volume-slider')
const artePlayer = document.querySelector('.arte-player')
let navigationTimeout

audio.volume = 0.8

function playClickSound() {
  audioClique.currentTime = 0
  audioClique.play().catch(() => {})
}

function navigateWithTransition(link) {
  const isCoverLink = link.classList.contains('tela-inicial')
  if (isCoverLink) {
    audioEntradaSite.currentTime = 0
    audioEntradaSite.play().catch(() => {})
  } else {
    playClickSound()
  }
  if (isCoverLink) {
    link.classList.add('capa-saindo')
  } else {
    document.body.classList.add('pagina-saindo')
  }
  window.clearTimeout(navigationTimeout)
  navigationTimeout = window.setTimeout(() => {
    window.location.href = link.href
  }, isCoverLink ? 700 : 520)
}

function restorePageFromHistory() {
  window.clearTimeout(navigationTimeout)
  document.body.classList.remove('pagina-saindo')
  document.querySelector('.tela-inicial')?.classList.remove('capa-saindo')
}

window.addEventListener('pageshow', restorePageFromHistory)

function setupFlipCards() {
  cartoesMusicais.forEach((card) => {
    const description = card.querySelector('.descricao-artista')
    const action = card.querySelector('.acao-descricao')
    if (!description || card.querySelector('.cartao-inner')) return

    const inner = document.createElement('div')
    const front = document.createElement('div')
    const back = document.createElement('div')
    inner.className = 'cartao-inner'
    front.className = 'cartao-frente'
    back.className = 'cartao-verso'

    Array.from(card.children).forEach((child) => {
      if (child === description) {
        back.appendChild(child)
      } else {
        front.appendChild(child)
      }
    })

    inner.append(front, back)
    if (action) {
      back.appendChild(action.cloneNode(true))
    }
    card.appendChild(inner)
  })
}

setupFlipCards()

function updateVolumeDisplay() {
  const volume = Math.round(audio.volume * 100)
  if (volumeSlider) {
    volumeSlider.value = String(volume)
  }
}

function updateProgressBar() {
  if (!progressFill || !audio.duration || !Number.isFinite(audio.duration)) {
    if (progressFill) progressFill.style.width = '0%'
    return
  }

  const percent = (audio.currentTime / audio.duration) * 100
  progressFill.style.width = `${Math.min(100, Math.max(0, percent))}%`
  if (progress) {
    progress.setAttribute('aria-valuenow', String(Math.round(percent)))
  }
}

function clearPlayingCard() {
  document.querySelector('.cartao-musical.playing')?.classList.remove('playing')
}

function updatePlayButton(isPlaying) {
  if (!botaoPausar) return

  botaoPausar.classList.toggle('tocando', isPlaying)
  botaoPausar.textContent = isPlaying ? '' : '▶'
  botaoPausar.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproduzir música')
  botaoPausar.title = isPlaying ? 'Pausar música' : 'Reproduzir música'
}

function pauseMusic() {
  audio.pause()
  document.body.classList.remove('player-no-final')
  updatePlayButton(false)
}

function resetPlayer() {
  audio.pause()
  audio.removeAttribute('src')
  audio.load()
  clearPlayingCard()
  nomeMusica.textContent = 'Escolha uma voz para começar'
  nomeArtista.textContent = 'O áudio aparecerá aqui'
  updatePlayButton(false)
  if (artePlayer) {
    artePlayer.style.backgroundImage = ''
    artePlayer.innerHTML = '♪'
  }
  document.body.classList.remove('player-visivel')
}

function closeExpandedDescriptions() {
  cartoesMusicais.forEach((card) => {
    card.classList.remove('expanded')
    card.querySelectorAll('.botao-descricao').forEach((button) => {
      button.setAttribute('aria-expanded', 'false')
    })
  })
}

function selectArtist(card) {
  clearPlayingCard()
  pauseMusic()
  nomeMusica.textContent = card.dataset.song
  nomeArtista.textContent = card.dataset.artist || 'Nome do Artista'
  audio.src = card.dataset.audio

  if (artePlayer) {
    if (card.dataset.cover) {
      artePlayer.style.backgroundImage = `url('${card.dataset.cover}')`
      artePlayer.innerHTML = '<img src="' + card.dataset.cover + '" alt="Capa da música" />'
    } else {
      artePlayer.style.backgroundImage = ''
      artePlayer.innerHTML = '♪'
    }
  }

  audio.load()
  audio.play().then(() => {
    card.classList.add('playing')
    document.body.classList.add('player-visivel')
    updatePlayerAtPageEnd()
    updatePlayButton(true)
  }).catch(() => {
    resetPlayer()
  })
}

function updatePlayerAtPageEnd() {
  if (!document.body.classList.contains('player-visivel')) return

  const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8
  const playlistSection = document.querySelector('.playlist-spotify')
  const nearPlaylist = playlistSection && (() => {
    const rect = playlistSection.getBoundingClientRect()
    return rect.top <= window.innerHeight * 0.8 && rect.bottom >= 120
  })()

  document.body.classList.toggle('player-no-final', atPageEnd || nearPlaylist)
}

window.addEventListener('scroll', updatePlayerAtPageEnd, { passive: true })
window.addEventListener('resize', updatePlayerAtPageEnd)

document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return

    event.preventDefault()
    pauseMusic()
    closeExpandedDescriptions()
    navigateWithTransition(link)
  })
})

cartoesMusicais.forEach((card) => {
  const selectCard = () => {
    if (card.classList.contains('playing')) return
    selectArtist(card)
  }

  card.addEventListener('click', (event) => {
    const button = event.target.closest('.botao-descricao')
    if (button) {
      event.stopPropagation()
      const isExpanded = card.classList.toggle('expanded')
      card.querySelectorAll('.botao-descricao').forEach((cardButton) => {
        cardButton.setAttribute('aria-expanded', String(isExpanded))
      })
      return
    }

    selectCard()
  })

  card.addEventListener('keydown', (event) => {
    if (event.target.closest('.botao-descricao')) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectCard()
    }
  })
})

document.addEventListener('click', (event) => {
  if (event.target.closest('.cartao-musical, .player-audio, a[href], .voltar-capa, .link-acervo')) {
    return
  }

  pauseMusic()
  document.body.classList.remove('player-visivel')
})

botaoFechar?.addEventListener('click', () => {
  resetPlayer()
})

botaoPausar?.addEventListener('click', () => {
  if (!audio.src) return

  if (audio.paused) {
    audio.play().then(() => updatePlayButton(true)).catch(() => updatePlayButton(false))
    document.body.classList.add('player-visivel')
    updatePlayerAtPageEnd()
  } else {
    pauseMusic()
  }
})

if (progress) {
  let dragPercent = 0

  const updateDragPreview = (event) => {
    if (!audio.src || !audio.duration || !Number.isFinite(audio.duration)) return

    const rect = progress.getBoundingClientRect()
    dragPercent = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    if (progressFill) {
      progressFill.style.width = `${dragPercent * 100}%`
    }
    progress.setAttribute('aria-valuenow', String(Math.round(dragPercent * 100)))
  }

  progress.addEventListener('pointerdown', (event) => {
    if (!audio.src || !audio.duration || !Number.isFinite(audio.duration)) return

    progress.classList.add('dragging')
    try {
      progress.setPointerCapture(event.pointerId)
    } catch {}
    updateDragPreview(event)
  })

  progress.addEventListener('pointermove', (event) => {
    if (progress.classList.contains('dragging')) {
      updateDragPreview(event)
    }
  })

  progress.addEventListener('pointerup', (event) => {
    updateDragPreview(event)
    if (audio.src && audio.duration && Number.isFinite(audio.duration)) {
      audio.currentTime = dragPercent * audio.duration
    }
    progress.classList.remove('dragging')
    updateProgressBar()
    if (progress.hasPointerCapture(event.pointerId)) {
      try {
        progress.releasePointerCapture(event.pointerId)
      } catch {}
    }
  })

  progress.addEventListener('pointercancel', () => {
    progress.classList.remove('dragging')
  })

  progress.addEventListener('keydown', (event) => {
    if (!audio.src || !audio.duration || !Number.isFinite(audio.duration)) return

    const step = 5
    if (event.key === 'ArrowRight') {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + step)
    }
    if (event.key === 'ArrowLeft') {
      audio.currentTime = Math.max(0, audio.currentTime - step)
    }
    updateProgressBar()
  })
}

volumeSlider?.addEventListener('input', () => {
    audio.volume = Number(volumeSlider.value) / 100
    updateVolumeDisplay()
})

volumeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const delta = button.dataset.volumeAction === 'up' ? 0.1 : -0.1
    audio.volume = Math.min(1, Math.max(0, audio.volume + delta))
    updateVolumeDisplay()
  })
})

updateVolumeDisplay()

audio.addEventListener('playing', () => {
  document.body.classList.add('player-visivel')
})

audio.addEventListener('pause', () => {
  document.body.classList.remove('player-no-final')
})

audio.addEventListener('timeupdate', updateProgressBar)
audio.addEventListener('loadedmetadata', updateProgressBar)

audio.addEventListener('ended', () => {
  pauseMusic()
})

updatePlayButton(false)

if (artePlayer && artePlayer.innerHTML.trim() === '') {
  artePlayer.innerHTML = '♪'
}

const quizInicio = document.querySelector('#iniciar-quiz')
const quizReinicio = document.querySelector('#reiniciar-quiz')
const quizApresentacao = document.querySelector('#quiz-apresentacao')
const quizJogo = document.querySelector('#quiz-jogo')
const quizResultado = document.querySelector('#quiz-resultado')
const quizProgresso = document.querySelector('#quiz-progresso')
const quizPontuacao = document.querySelector('#quiz-pontuacao')
const quizPergunta = document.querySelector('#quiz-pergunta')
const quizRespostas = document.querySelector('#quiz-respostas')
const quizFeedback = document.querySelector('#quiz-feedback')
const quizProxima = document.querySelector('#proxima-quiz')
const quizResultadoTitulo = document.querySelector('#quiz-resultado-titulo')
const quizResultadoTexto = document.querySelector('#quiz-resultado-texto')

let perguntaAtual = 0
let acertosQuiz = 0
let perguntasAtuais = []

function prepararPerguntasQuiz() {
  perguntasAtuais = perguntasQuiz.map((pergunta) => {
    const respostas = pergunta.respostas.map((texto, indice) => ({
      texto,
      correta: indice === pergunta.correta,
    }))

    for (let indice = respostas.length - 1; indice > 0; indice -= 1) {
      const indiceAleatorio = Math.floor(Math.random() * (indice + 1))
      const respostaTemporaria = respostas[indice]
      respostas[indice] = respostas[indiceAleatorio]
      respostas[indiceAleatorio] = respostaTemporaria
    }

    return {
      pergunta: pergunta.pergunta,
      respostas: respostas.map((resposta) => resposta.texto),
      correta: respostas.findIndex((resposta) => resposta.correta),
    }
  })
}

function atualizarPontuacaoQuiz() {
  if (quizPontuacao) quizPontuacao.textContent = `${acertosQuiz} ${acertosQuiz === 1 ? 'acerto' : 'acertos'}`
}

function mostrarPerguntaQuiz() {
  const item = perguntasAtuais[perguntaAtual]
  if (!item || !quizPergunta || !quizRespostas) return

  quizProgresso.textContent = `Pergunta ${perguntaAtual + 1} de ${perguntasAtuais.length}`
  quizPergunta.textContent = item.pergunta
  quizRespostas.innerHTML = ''
  quizFeedback.textContent = ''
  quizFeedback.className = 'quiz-feedback'
  quizProxima.hidden = true

  item.respostas.forEach((resposta, indice) => {
    const botao = document.createElement('button')
    botao.className = 'quiz-resposta'
    botao.type = 'button'
    botao.textContent = `${String.fromCharCode(97 + indice)}) ${resposta}`
    botao.addEventListener('click', () => corrigirRespostaQuiz(indice, item.correta))
    quizRespostas.appendChild(botao)
  })
  atualizarPontuacaoQuiz()
}

function corrigirRespostaQuiz(indiceEscolhido, indiceCorreto) {
  const botoes = quizRespostas.querySelectorAll('.quiz-resposta')
  botoes.forEach((botao) => { botao.disabled = true })

  if (indiceEscolhido === indiceCorreto) {
    botoes[indiceEscolhido].classList.add('correta')
    acertosQuiz += 1
    audioRespostaCerta.currentTime = 0
    audioRespostaCerta.play().catch(() => {})
    quizFeedback.textContent = ''
    quizFeedback.classList.add('feedback-correto')
  } else {
    botoes[indiceEscolhido].classList.add('errada')
    botoes[indiceCorreto].classList.add('correta')
    audioRespostaErrada.currentTime = 0
    audioRespostaErrada.play().catch(() => {})
    quizFeedback.textContent = ''
    quizFeedback.classList.add('feedback-errado')
  }

  atualizarPontuacaoQuiz()
  quizProxima.hidden = false
  quizProxima.textContent = perguntaAtual === perguntasAtuais.length - 1 ? 'Ver resultado' : 'Próxima pergunta'
}

function iniciarQuiz() {
  perguntaAtual = 0
  acertosQuiz = 0
  prepararPerguntasQuiz()
  playClickSound()
  document.body.classList.add('quiz-iniciado')
  const primeiraEntrada = !quizApresentacao.hidden

  if (!primeiraEntrada) {
    quizResultado.hidden = true
    quizJogo.hidden = false
    mostrarPerguntaQuiz()
    return
  }

  quizInicio.disabled = true
  quizApresentacao.classList.add('quiz-saindo')
  window.setTimeout(() => {
    quizApresentacao.hidden = true
    quizApresentacao.classList.remove('quiz-saindo')
    quizResultado.hidden = true
    quizJogo.hidden = false
    mostrarPerguntaQuiz()
  }, 420)
}

function finalizarQuiz() {
  quizJogo.hidden = true
  quizResultado.hidden = false
  quizResultadoTitulo.textContent = `${acertosQuiz}/10 acertos`
  const mensagensResultado = [
    'Você não acertou nenhuma... Talvez seja hora de estudar um pouco mais!',
    'Pelo menos uma você acertou! Todo começo é alguma coisa.',
    'Ainda dá para melhorar bastante, mas você já começou bem.',
    'Não foi ruim, mas ainda falta um pouco para dominar o assunto.',
    'Quase na metade! Continue tentando.',
    'Metade do caminho! Um resultado razoável.',
    'Nada mal! Você mostrou que entende do assunto.',
    'Muito bem! Você teve um ótimo desempenho.',
    'Excelente resultado! Você realmente sabe bastante.',
    'Quase perfeito! Faltou muito pouco para acertar tudo.',
    'PERFEITO! Você acertou todas as perguntas. Parabéns!',
  ]
  quizResultadoTexto.textContent = mensagensResultado[acertosQuiz]
  window.setTimeout(() => {
    audioVictory.currentTime = 0
    audioVictory.play().catch(() => {})
    soltarConfetes()
  }, 1100)
}

function soltarConfetes() {
  document.querySelector('.confetes-resultado')?.remove()

  const container = document.createElement('div')
  container.className = 'confetes-resultado'
  const cores = ['#57b85c', '#f4c542', '#e35b4f', '#4f9fd1', '#d98ac5', '#f28c28']

  for (let indice = 0; indice < 32; indice += 1) {
    const confete = document.createElement('span')
    confete.className = 'confete'

    const left = Math.random() * 100
    confete.style.setProperty('--confete-x', `${left}vw`)
    confete.style.setProperty('--confete-y', `${-30 - Math.random() * 20}px`)
    confete.style.setProperty('--confete-cor', cores[indice % cores.length])
    confete.style.setProperty('--confete-atraso', `${Math.random() * 0.5}s`)
    confete.style.setProperty('--confete-duracao', `${2.2 + Math.random() * 1.8}s`)
    confete.style.setProperty('--confete-tamanho', `${8 + Math.random() * 14}px`)
    confete.style.setProperty('--confete-inclinacao', `${-40 + Math.random() * 80}deg`)

    const deslocamentoHorizontal = (Math.random() - 0.5) * 240
    const deslocamentoVertical = window.innerHeight + 120
    confete.style.setProperty('--confete-final-x', `${deslocamentoHorizontal}px`)
    confete.style.setProperty('--confete-final-y', `${deslocamentoVertical}px`)

    container.appendChild(confete)
  }

  document.body.appendChild(container)
  window.setTimeout(() => container.remove(), 4200)
}

quizInicio?.addEventListener('click', iniciarQuiz)
quizReinicio?.addEventListener('click', iniciarQuiz)
quizProxima?.addEventListener('click', () => {
  playClickSound()
  if (perguntaAtual === perguntasAtuais.length - 1) {
    finalizarQuiz()
    return
  }
  quizProxima.disabled = true
  quizJogo.classList.add('quiz-trocando')
  window.setTimeout(() => {
    perguntaAtual += 1
    mostrarPerguntaQuiz()
    quizJogo.classList.remove('quiz-trocando')
    quizProxima.disabled = false
  }, 260)
})
