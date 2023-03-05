from utilitarios import confere_link, search, set_ranks, exibir_dados_obtidos


def App():
    print("Digite a url que deseja iniciar a busca a seguir: ")
    url = input('=> ')
    while not confere_link(url):
        print("\nOps, a url inserida é inválida, digite novamente: ")
        url = input("=> ")

    print("ok..\n Agora digite a palavra que deseja buscar: ")
    palavra = input('=> ')

    print("Certo..\n Agora insira a Profundidade da Busca: ")
    prof_busca = int(input("=> "))
    while not isinstance(prof_busca, int):
        print("Ops, a profundidade da busca deve ser um número inteiro, digite novamente: ")
        prof_busca = int(input("=> "))

    [retorno, links] = search(url, palavra, prof_busca)
    retorno = set_ranks(retorno, links)

    exibir_dados_obtidos(retorno)


App()
