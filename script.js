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

    console.log(solicitante, bloco, sala)
}

cadastrar()