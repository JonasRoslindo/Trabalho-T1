
const modal = document.getElementById("meuModal")
const abrir = document.getElementById("abrirModal")
const fechar = document.getElementById("fecharModal")
const salvar = document.querySelector('#salvarModal')
const filtroSolicitante = document.querySelector('#filtroSolicitante')
const filtroBloco = document.querySelector('#filtroBloco')
const filtroSala = document.querySelector('#filtroSala')
const filtroData = document.querySelector('#filtroData')
const filtroTurno = document.querySelector('#filtroTurno')

abrir.addEventListener("click", () => {
  modal.showModal()
})

fechar.addEventListener("click", () => {
  modal.close()
  limparModal()
})

salvar.addEventListener('click', () => {
  if (cadastrar()) {
    fazerTabela()
    limparModal()
    modal.close()
  }
})

const reserva = []

function limparModal() {
  document.querySelector('#solicitante').value = ''
  document.querySelector('#bloco').selectedIndex = 0
  document.querySelector('#sala').selectedIndex = 0
  document.querySelector('#data').value = ''
  document.querySelector('#turno').selectedIndex = 0
}

function cadastrar() {
    const solicitante = document.querySelector('#solicitante').value
    const bloco = document.querySelector('#bloco').value
    const sala = document.querySelector('#sala').value
    const data = document.querySelector('#data').value
    const turno = document.querySelector('#turno').value

    const cadastro = {
      Solicitante: solicitante,
      Bloco: bloco,
      Sala: sala,
      Data: data,
      Turno: turno
    }

    const cadastroDuplicado = reserva.some(item =>
      item.Solicitante === cadastro.Solicitante &&
      item.Bloco === cadastro.Bloco &&
      item.Sala === cadastro.Sala &&
      item.Data === cadastro.Data &&
      item.Turno === cadastro.Turno
    )

    if (cadastroDuplicado) {
      alert('Esta reserva já foi cadastrada.')
      return false
    }

    reserva.push(cadastro)
    return true
}


function fazerTabela() {
  const tbody = document.querySelector('#tabela')

  const reservasFiltradas = filtrarReservas()

  tbody.innerHTML = reservasFiltradas.map(({ cadastro, indice }) => {
    const { Solicitante, Bloco, Sala, Data, Turno } = cadastro

    return `
      <tr>
            <td>${Solicitante}</td>
            <td>${Bloco}</td>
            <td>${Sala}</td>
            <td>${Data}</td>
            <td>${Turno}</td>
            <td><button class="limpar" data-indice="${indice}">Limpar</button></td>
        </tr>`
  }).join('')

}

function filtrarReservas() {
  const textoSolicitante = filtroSolicitante.value.toLowerCase()

  return reserva
    .map((cadastro, indice) => ({ cadastro, indice }))
    .filter(({ cadastro }) => {
      const mesmoSolicitante = cadastro.Solicitante
        .toLowerCase()
        .includes(textoSolicitante)
      const mesmoBloco = filtroBloco.value === '' || cadastro.Bloco === filtroBloco.value
      const mesmaSala = filtroSala.value === '' || cadastro.Sala === filtroSala.value
      const mesmaData = filtroData.value === '' || cadastro.Data === filtroData.value
      const mesmoTurno = filtroTurno.value === '' || cadastro.Turno === filtroTurno.value

      return mesmoSolicitante && mesmoBloco && mesmaSala && mesmaData && mesmoTurno
    })

}

filtroSolicitante.addEventListener('input', fazerTabela)
filtroBloco.addEventListener('change', fazerTabela)
filtroSala.addEventListener('change', fazerTabela)
filtroData.addEventListener('change', fazerTabela)
filtroTurno.addEventListener('change', fazerTabela)

document.querySelector('#tabela').addEventListener('click', event => {
  if (!event.target.classList.contains('limpar')) {
    return
  }

  reserva.splice(Number(event.target.dataset.indice), 1)
  fazerTabela()
})