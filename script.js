//Alunos: Jonas Olos Roslindo, Lucas Ternes.
const modal = document.getElementById("meuModal")
const abrir = document.getElementById("abrirModal")
const fechar = document.getElementById("fecharModal")
const salvar = document.querySelector('#salvarModal')
const filtroSolicitante = document.querySelector('#filtroSolicitante')
const filtroBloco = document.querySelector('#filtroBloco')
const filtroSala = document.querySelector('#filtroSala')
const filtroData = document.querySelector('#filtroData')
const filtroTurno = document.querySelector('#filtroTurno')
const btnLimpar = document.querySelector('#btnLimpar')
const totalReservas = document.querySelector('#totalReservas')
const totalDeHoje = document.querySelector('#totalDeHoje')
const totalNoite = document.querySelector('#totalNoite')
const totalDia = document.querySelector('#totalDia')

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

btnLimpar.addEventListener('click', () => {
  document.querySelector('#filtroSolicitante').value = ''
  document.querySelector('#filtroBloco').selectedIndex = 0
  document.querySelector('#filtroSala').selectedIndex = 0
  document.querySelector('#filtroData').value = ''
  document.querySelector('#filtroTurno').selectedIndex = 0
  fazerTabela()
})

const reservaPronta = [
  {Id: '1', Solicitante: 'Ronaldinho Gaúcho', Bloco: 'B', Sala: 'Sala 3', Data: '2026-09-09', Turno: 'Matutino'},
  {Id: '2', Solicitante: 'Pelé', Bloco: 'D', Sala: 'Sala 2', Data: '2026-09-11', Turno: 'Noturno'},
  {Id: '3', Solicitante: 'Welington Gadelha Camisa Dez', Bloco: 'A', Sala: 'Sala 3', Data: '2026-09-11', Turno: 'Vespertino'},
  {Id: '4', Solicitante: 'Neymar Pai', Bloco: 'C', Sala: 'Sala 1', Data: '2026-09-15', Turno: 'Noturno'},
  {Id: '5', Solicitante: 'Filipe Luis Mengao', Bloco: 'B', Sala: 'Sala 1', Data: '2026-09-14', Turno: 'Vespertino'}
]

const reserva = reservaPronta.map(({ Id, ...cadastro }) => cadastro)

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
      item.Bloco === cadastro.Bloco &&
      item.Sala === cadastro.Sala &&
      item.Data === cadastro.Data &&
      item.Turno === cadastro.Turno
    )

    if (cadastroDuplicado) {
      alert(`Conflito de Agendamento: A ${sala} do Bloco ${bloco} já está ocupada no turno ${turno} na data selecionada.`)
      return false
    }

    reserva.push(cadastro)
    atualizarMetrica()
    return true
}

function atualizarMetrica() {

  const hoje = new Date().toISOString().split('T')[0]

  totalReservas.textContent = reserva.length
  totalDeHoje.textContent = reserva.filter(({ Data }) => Data === hoje).length
  totalNoite.textContent = reserva.filter(({ Turno }) => Turno === 'Noturno').length
  totalDia.textContent = reserva.filter(({ Turno }) => Turno === 'Matutino' || Turno === 'Vespertino').length
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
            <td><button class="limpar btn btn-danger" data-indice="${indice}">Excluir</button></td>
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
  atualizarMetrica()
  fazerTabela()
})

atualizarMetrica()
fazerTabela()