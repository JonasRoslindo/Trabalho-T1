const modal = document.getElementById("meuModal");
const abrir = document.getElementById("abrirModal");
const fechar = document.getElementById("fecharModal");

abrir.addEventListener("click", () => {
  modal.showModal();
});

fechar.addEventListener("click", () => {
  modal.close();
});

const reserva = []

function cadastrar() {
    const solicitante = document.querySelector('#solicitante').value
    const bloco = document.querySelector('#bloco').value
    const sala = document.querySelector('#sala').value
    const data = document.querySelector('#data').value
    const turno = document.querySelector('#turno').value

    console.log(solicitante, bloco, sala, data, turno)

    const cadastro = {
      Solicitante: solicitante,
      Bloco: bloco,
      Sala: sala,
      Data: data,
      Turno: turno
    }

    reserva.push(cadastro)

}

function fazerTabela() {
  const tbody = document.querySelector('#tabela')

   tbody.innerHTML = reserva.map(({Solicitante, Bloco, Sala, Data, Turno}) =>
        `<tr>
            <td>${Solicitante}</td>
            <td>${Bloco}</td>
            <td>${Sala}</td>
            <td>${Data}</td>
            <td>${Turno}</td>
        </tr>`
    ).join('')
}

function salvarCadastro() {
  const button = document.querySelector('#salvarModal')

  button.addEventListener('click', () => {
    cadastrar()
    fazerTabela()
 })

}

salvarCadastro()