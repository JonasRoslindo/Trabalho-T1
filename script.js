
// Busca no HTML os elementos que serão usados pelo JavaScript.
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

// Abre a janela de cadastro quando o botão "abrirModal" é clicado.
abrir.addEventListener("click", () => {
  // showModal() abre um elemento <dialog> como uma janela modal.
  modal.showModal()
})

// Fecha a janela e limpa os campos do formulário.
fechar.addEventListener("click", () => {
  modal.close()
  limparModal()
})

// Tenta cadastrar uma reserva e só atualiza a tela se o cadastro for válido.
salvar.addEventListener('click', () => {
  if (cadastrar()) {
    fazerTabela()
    limparModal()
    modal.close()
  }
})

// Restaura os filtros para os valores iniciais e refaz a tabela.
btnLimpar.addEventListener('click', () => {
  // value representa o valor digitado em um input.
  document.querySelector('#filtroSolicitante').value = ''
  // selectedIndex indica qual opcao de um <select> esta selecionada.
  document.querySelector('#filtroBloco').selectedIndex = 0
  document.querySelector('#filtroSala').selectedIndex = 0
  document.querySelector('#filtroData').value = ''
  document.querySelector('#filtroTurno').selectedIndex = 0
  fazerTabela()
})

// Reservas usadas como dados iniciais da aplicação.
const reservaPronta = [
  {Id: '1', Solicitante: 'Lucas Ternes', Bloco: 'B', Sala: 'Sala 3', Data: '2026-09-09', Turno: 'Matutino'},
  {Id: '2', Solicitante: 'Jonas Olos Roslindo', Bloco: 'D', Sala: 'Sala 2', Data: '2026-09-11', Turno: 'Noturno'},
  {Id: '3', Solicitante: 'Luiz Antonio Freitas', Bloco: 'A', Sala: 'Sala 3', Data: '2026-09-11', Turno: 'Vespertino'},
  {Id: '4', Solicitante: 'Laura Meurer Ternes', Bloco: 'C', Sala: 'Sala 1', Data: '2026-09-15', Turno: 'Noturno'},
  {Id: '5', Solicitante: 'João Artur Serpa', Bloco: 'B', Sala: 'Sala 1', Data: '2026-09-14', Turno: 'Vespertino'}
]

// map() percorre o array e cria outro array com o resultado de cada item.
// Aqui, a desestruturacao retira Id e guarda o restante em cadastro.
const reserva = reservaPronta.map(({ Id, ...cadastro }) => cadastro)

// Limpa todos os campos do formulário de cadastro.
function limparModal() {
  document.querySelector('#solicitante').value = ''
  document.querySelector('#bloco').selectedIndex = 0
  document.querySelector('#sala').selectedIndex = 0
  document.querySelector('#data').value = ''
  document.querySelector('#turno').selectedIndex = 0
}

// Lê os campos, verifica conflitos e adiciona uma nova reserva.
function cadastrar() {
  // value le o valor atual preenchido em cada campo do formulario.
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

    // some() retorna true se pelo menos um item do array atender a condicao.
    // Neste caso, verifica se ja existe uma reserva no mesmo local, data e turno.
    const cadastroDuplicado = reserva.some(item =>
      item.Bloco === cadastro.Bloco &&
      item.Sala === cadastro.Sala &&
      item.Data === cadastro.Data &&
      item.Turno === cadastro.Turno
    )

    // Impede o cadastro quando o horário e o local já estão ocupados.
    if (cadastroDuplicado) {
      alert(`Conflito de Agendamento: A ${sala} do Bloco ${bloco} já está ocupada no turno ${turno} na data selecionada.`)
      return false
    }

    // Adiciona a reserva e atualiza os números exibidos no painel.
    reserva.push(cadastro)
    atualizarMetrica()
    return true
}

// Recalcula as métricas mostradas no topo da página.
function atualizarMetrica() {
  // Obtém a data atual no formato usado pelos campos de data (AAAA-MM-DD).
  // split('T')[0] pega somente a parte da data antes do horario.
  const hoje = new Date().toISOString().split('T')[0]

  // length informa quantos itens existem no array.
  totalReservas.textContent = reserva.length
  // filter() cria um novo array apenas com os itens que passam na condicao.
  // O length desse novo array informa quantas reservas atendem ao filtro.
  totalDeHoje.textContent = reserva.filter(({ Data }) => Data === hoje).length
  totalNoite.textContent = reserva.filter(({ Turno }) => Turno === 'Noturno').length
  totalDia.textContent = reserva.filter(({ Turno }) => Turno === 'Matutino' || Turno === 'Vespertino').length
}

// Monta novamente as linhas da tabela usando as reservas filtradas.
function fazerTabela() {
  const tbody = document.querySelector('#tabela')

  const reservasFiltradas = filtrarReservas()

  // map() transforma cada reserva em uma linha HTML.
  // join('') junta as linhas em um unico texto, sem inserir separadores entre elas.
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

// Retorna somente as reservas que correspondem aos filtros selecionados.
function filtrarReservas() {
  // toLowerCase() converte o texto para letras minusculas.
  // Assim, a busca nao diferencia letras maiusculas de minusculas.
  const textoSolicitante = filtroSolicitante.value.toLowerCase()

  return reserva
    // Mantém o cadastro junto ao índice original para permitir a exclusão correta.
    // map() recebe tambem o indice de cada item e cria um objeto com os dois dados.
    .map((cadastro, indice) => ({ cadastro, indice }))
    // filter() mantem somente os cadastros que retornarem true.
    .filter(({ cadastro }) => {
      const mesmoSolicitante = cadastro.Solicitante
        // includes() verifica se um texto esta contido dentro de outro texto.
        .toLowerCase()
        .includes(textoSolicitante)
      // || permite qualquer valor quando o filtro esta vazio.
      const mesmoBloco = filtroBloco.value === '' || cadastro.Bloco === filtroBloco.value
      const mesmaSala = filtroSala.value === '' || cadastro.Sala === filtroSala.value
      const mesmaData = filtroData.value === '' || cadastro.Data === filtroData.value
      const mesmoTurno = filtroTurno.value === '' || cadastro.Turno === filtroTurno.value

      // A reserva precisa atender simultaneamente a todos os filtros preenchidos.
      return mesmoSolicitante && mesmoBloco && mesmaSala && mesmaData && mesmoTurno
    })
}

// Atualiza a tabela assim que o usuário altera qualquer filtro.
filtroSolicitante.addEventListener('input', fazerTabela)
filtroBloco.addEventListener('change', fazerTabela)
filtroSala.addEventListener('change', fazerTabela)
filtroData.addEventListener('change', fazerTabela)
filtroTurno.addEventListener('change', fazerTabela)

document.querySelector('#tabela').addEventListener('click', event => {
  // Ignora cliques em partes da tabela que não sejam botões de exclusão.
  if (!event.target.classList.contains('limpar')) {
    return
  }

  // data-indice no HTML vira dataset.indice no JavaScript.
  // Number() converte o texto do atributo para um numero.
  // splice(indice, 1) remove um item do array a partir daquele indice.
  reserva.splice(Number(event.target.dataset.indice), 1)
  atualizarMetrica()
  fazerTabela()
})

// Preenche os números e a tabela quando a página é carregada.
atualizarMetrica()
fazerTabela()