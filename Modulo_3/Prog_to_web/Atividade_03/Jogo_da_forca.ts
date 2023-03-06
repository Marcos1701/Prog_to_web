import prompt from 'prompt-sync'
const input = prompt()

function game_tes(palavras: string[]): void{
    const palavra = palavras[Math.floor(Math.random() * (palavras.length - 1))]
    let valor_continuidade: boolean = false

    const Retira_caracteres = (palavra: string) => {
        let palavra_retorno: string = ''
        for(let i = 0; i < palavras.length; i++){
            if(palavra[i] === ' ' || palavra[i] === '-'){
                palavra_retorno += palavra[i]
            }else{
                palavra_retorno += "_"
            }
        }
        return palavra_retorno
    }

    const confere_caractere = (palavra_completa: string, palavra_incompleta: string, caractere: string) => {
        let retorno: string[] = palavra_incompleta.split('')
        const palavra: string = palavra_completa.toLowerCase()

        for(let i = 0; i < palavra_completa.length; i++){
            if(palavra[i] === caractere.toLowerCase()){
                retorno[i] = palavra_completa[i]
            }
        }
        return retorno.join('')
    }

    const confere_palavra = (palavra_original: string, palavra_alternativa: string) => {
        if(palavra_original.length != palavra_alternativa.length){
            return false
        }
        for(let i = 0; i < palavra_original.length; i++){
            if(palavra_original[i].toLowerCase() != palavra_alternativa[i].toLowerCase()){
                return false
            }
        }
        return true
    }

    let palavra_incompleta: string = Retira_caracteres(palavra)
   
    while(!valor_continuidade){
        console.log(`Palavra incompleta: \n ----> ${palavra_incompleta} <----\n`)
   
        console.log("Digite uma letra a seguir: ")
        const letra: string = input('=> ')

        palavra_incompleta = confere_caractere(palavra, palavra_incompleta, letra)

        if(confere_palavra(palavra, palavra_incompleta)){
            valor_continuidade = true
        }

    }

    console.log(`Parabens por completar a palavra: \n ----> ${palavra} <----\n`)

    input("Presione <enter> para continuar")

    console.clear()

}

function main(): void {
    const exibe_opcoes = (opcoes: string[]) => {
        for (let opcao in opcoes){
            console.log(opcao)
        }
    }

    const confere_e_recebe_opcao_valida = (max: number, min: number) => {
        let opcao: number = Number(input('=> '))
        while(opcao > max || opcao < min){
            console.log(`A opção ${opcao} é inválida!!`)
            opcao = input('=> ')
        }
        return opcao
    }

    console.log("---- Menu ----")

    let opcoes: string[] = ['1 - Novo Jogo', '0 - Sair']
    let palavras: string[] = ['Teste', 'ifpi', 'Analise e Desenvolvimento de Sistemas']

    exibe_opcoes(opcoes)
    let op: number = confere_e_recebe_opcao_valida(1, 0)
    while(op != 0){

        game_tes(palavras)

        exibe_opcoes(opcoes)

        op = confere_e_recebe_opcao_valida(1, 0)
    }
    
}

main()
