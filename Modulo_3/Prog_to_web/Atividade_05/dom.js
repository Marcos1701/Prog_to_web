// selecione o botão usando o método getElementById
const botoes = document.querySelectorAll('button');

const botao_alt = botoes[0];

const botao_exc = botoes[1];

// adicione um evento de clique ao botão
botao_alt.addEventListener("click", function () {
    // selecione o parágrafo usando o método getElementById
    const paragrafo = document.getElementById("paragrafo");
    // altere o texto do parágrafo
    paragrafo.textContent = "O texto deste parágrafo foi alterado!";
});

botao_exc.addEventListener("click", function () {

    const paragrafo = document.getElementById("paragrafo");
    paragrafo.textContent = "";

})
