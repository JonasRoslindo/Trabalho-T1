const modal = document.getElementById("meuModal");
const abrir = document.getElementById("abrirModal");
const fechar = document.getElementById("fecharModal");

abrir.addEventListener("click", () => {
  modal.showModal();
});

fechar.addEventListener("click", () => {
  modal.close();
});

const turma = []

function definirSituacao(situacao) {
    const nome = document.getElementById('iptNome').value
    const n1 = Number(document.getElementById('iptNota1').value)
    const n2 = Number(document.getElementById('iptNota2').value)
    console.log(nome, n1, n2)

    const media = (n1 + n2) / 2

    console.log(media)

    if (media >= 7.0) {situacao = 'Aprovado'}
    else if (media >= 5.0 && media < 7.0) {situacao = 'Recuperação'}
    else {situacao = 'Reprovado'}

    console.log(situacao)

    const aluno = {
        Nome: nome,
        Nota1: n1,
        Nota2: n2,
        Média: media,
        Situação: situacao
    }

    turma.push(aluno)
}

function renderizarTabela(alunosFiltrados) {
    const tbody = document.querySelector('#tblAlunos')
    const filter = document.querySelector('#sltFiltro').value
    
    if (filter === 'Todos') { alunosFiltrados = turma } 
    else if (filter === 'Aprovados') { alunosFiltrados = turma.filter(aluno => aluno.Situação === 'Aprovado') } 
    else if (filter === 'Reprovados') { alunosFiltrados = turma.filter(aluno => aluno.Situação === 'Reprovado') } 
    else if (filter === 'Recuperação') { alunosFiltrados = turma.filter(aluno => aluno.Situação === 'Recuperação') }

    tbody.innerHTML = alunosFiltrados.map(({Nome, Nota1, Nota2, Média, Situação}) =>
        `<tr>
            <td>${Nome}</td>
            <td>${Nota1}</td>
            <td>${Nota2}</td>
            <td>${Média}</td>
            <td>${Situação}</td>
        </tr>`
    ).join('')
}

function cadastrarAluno() {
    const button = document.querySelector('#btnCadastrar')
    const filtro = document.querySelector('#sltFiltro')

    button.addEventListener('click', () => {
        definirSituacao()
        renderizarTabela()
        })

    filtro.addEventListener('change', renderizarTabela)
}

cadastrarAluno()