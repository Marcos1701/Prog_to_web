// selecione o botão usando o método getElementById
const botao_alt = document.getElementById("botao_altera_txt");

const botao_exc = document.getElementById("botao_exclui_txt");

//let botao_cancel = document.getElementById("botao_calcela_exc_txt");

//let txt_antigo = [];

// adicione um evento de clique ao botão
botao_alt.addEventListener("click", function() {
// selecione o parágrafo usando o método getElementById
const paragrafo = document.getElementById("paragrafo");
// altere o texto do parágrafo
paragrafo.textContent = "O texto deste parágrafo foi alterado!";
});

botao_exc.addEventListener("click", function(){

    const paragrafo = document.getElementById("paragrafo");

/*
    if(paragrafo.textContent){
        txt_antigo.push(paragrafo.textContent);
    }
*/
    paragrafo.textContent = "";
/*
    if(!document.getElementById("botao_calcela_exc_txt")){
        botao_cancel = document.createElement("button")
        botao_cancel.appendChild(document.createTextNode("cancelar exclusão"))

        botao_cancel.setAttribute("id", "botao_calcela_exc_txt")
        document.body.appendChild(botao_cancel)
    }*/
})

/*
if(botao_cancel){
    botao_cancel.addEventListener("click", function(){
        const paragrafo = document.getElementById("paragrafo");

        paragrafo.textContent = txt_antigo.pop();

        document.body.removeChild(botao_cancel)
    })
}
/*
