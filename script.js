const modal = document.getElementById("meuModal");
const abrir = document.getElementById("abrirModal");
const fechar = document.getElementById("fecharModal");

abrir.addEventListener("click", () => {
  modal.showModal();
});

fechar.addEventListener("click", () => {
  modal.close();
});