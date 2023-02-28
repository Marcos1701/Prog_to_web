import requests
from bs4 import BeautifulSoup


def coleta_e_organiza_dados(soup, palavra_chave, url):
    # try:

    ocorrencias_pc = []
    for ocorrencia in soup.find_all(palavra_chave):
        texto = soup.get_text()
        index = texto.index(palavra_chave)
        inicio = texto[index - 20:  index]
        fim = texto[index + len(palavra_chave): index +
                    len(palavra_chave) + 20]
        ocorrencia = inicio + palavra_chave + fim
        ocorrencias_pc.append(ocorrencia)

    ancor = soup.find_all('a')
    links = []
    for a in ancor:
        link = a.get('href')
        if link is not None:
            if not link.startswith('https'):
                links.append(f'{url}{link}')
            else:
                links.append(link)

    data = {
        'url': url,
        'ocorrencias': ocorrencias_pc,
        'links': links,
        'ranking': 0
    }
    return data
    # except:
    #    print('Ops, ocorreu um erro na função "coleta_e_organiza_dados"... \n')
    #    return None


def definir_ranks(resultados, links):
    # try:
    for resultado in resultados:
        ocorrencias = len(resultado['ocorrencias'])
        rank = ocorrencias
        ref = links[resultado['url']]['qtd_referencias']

        if (ref <= 10):
            rank += ref * 0.5
        else:
            rank += ref * 1.5

        resultado['ranking'] = rank

    return resultados
    # except:
    #    print('Ops, ocorreu um erro na função "definir_ranks"... \n')
    #    return None


def exibe_por_ranking(resultados):
    # try:
    print("----- Resultados da Busca de Profundidade -----")
    dados_ordenados = sorted(
        resultados, key=lambda k: k['ranking'], reverse=True)
    for dado in dados_ordenados:
        print(f'url: {dado["url"]}')
        print("Resultados da busca: ")
        for resultado in dado['ocorrencias'][:10]:
            print(f" - {resultado}")
        print('\n')
    # except:
    #    print('Ops, ocorreu um erro na função "exibe_por_ranking"... \n')


def search(palavra, url, profundidade=0):
    # try:
    retorno = requests.get(url)

    soup = BeautifulSoup(retorno.content, 'html.parser')

    resultados = []
    links_utilizados = {url: {'qtd_referencias': 0}}
    json_resultante = coleta_e_organiza_dados(soup, palavra, url)

    if json_resultante is not None:
        resultados.append(json_resultante)

    for i in range(0, profundidade):
        for link in json_resultante['links']:  # lista de links
            if not link.startswith('http'):
                continue

            if link not in links_utilizados:
                links_utilizados[link] = {'qtd_referencias': 0}
                retorno = requests.get(link)
                soup = BeautifulSoup(retorno.content, 'html.parser')
                json_resultante = coleta_e_organiza_dados(
                    soup, palavra, link)

                if json_resultante is not None:
                    resultados.append(json_resultante)
            else:
                links_utilizados[link]['qtd_referencias'] += 1

    resultados = definir_ranks(resultados, links_utilizados)
    return resultados
    # except:
    #    print('Ops, ocorreu um erro na função "search"... \n')


def main():
    print("Digite a url que deseja iniciar a busca a seguir: ")
    url = input('=> ')

    print("ok..\n Agora digite a palavra que deseja buscar: ")
    palavra_chave = input('=> ')

    print("Certo..\n Agora insira a Profundidade da Busca: ")
    profundidade_busca = int(input("=> "))

    retorno = search(palavra_chave, url, profundidade_busca)
    exibe_por_ranking(retorno)


main()