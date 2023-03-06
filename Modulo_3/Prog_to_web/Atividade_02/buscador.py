import os
from utilitarios import confere_link, search, set_ranks, exibir_dados_obtidos


class Historico:
    def __init__(self, url: str, palavra: str, prof_busca: int):
        self.url = url
        self.palavra = palavra
        self.prof_busca = prof_busca


def confere_op(opcao: int, max: int, min: int):
    if opcao < min or opcao > max:
        return False
    return True


def exibe_opcoes(opcoes: list):
    print("Opções disponíveis:")
    for opcao in opcoes:
        print(opcao)


def exibir_Historicos(Historico_buscas: list):
    print("- - - - - - - - - - - - - Histórico de Buscas - - - - - - - - - - - - -\n")
    if len(Historico_buscas) == 0:
        print("Nenhum histórico de busca encontrado.")
        return None

    i = 1
    for historico in Historico_buscas:
        if isinstance(Historico_buscas, Historico):
            print(f"Busca n°{i}")
            print(f"Url: {historico.url}")
            print(f"Palavra: {historico.palavra}")
            print(f"Profundidade da Busca: {historico.prof_busca}")


def App():
    print("- - - - - - - - - - - - - Menu - - - - - - - - - - - - -\n")

    opcoes_menu = ["1 - Iniciar nova busca",
                   "2 - Exibir histórico de Busca", "0 - Sair"]
    exibe_opcoes(opcoes_menu)
    opcao = int(input("=> "))

    Historico_buscas = []

    while opcao != 0:
        try:
            while not confere_op(opcao, 1, 0):
                print("Ops, opção inválida, digite novamente: ")
                opcao = int(input("=> "))

            if opcao == 1:
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
                    print(
                        "Ops, a profundidade da busca deve ser um número inteiro, digite novamente: ")
                    prof_busca = int(input("=> "))

                [retorno, links] = search(url, palavra, prof_busca)
                retorno = set_ranks(retorno, links)

                exibir_dados_obtidos(retorno)
                Historico_buscas.append(Historico(url, palavra, prof_busca))
            elif opcao == 2:
                exibir_Historicos(Historico_buscas)

        except Exception as e:
            print("Ops, ocorreu um erro, tente novamente.")
            print(f"Erro: {e}")

    input("\n\nPressione qualquer tecla para sair...")
    os.system('cls' if os.name == 'nt' else 'clear')


App()
