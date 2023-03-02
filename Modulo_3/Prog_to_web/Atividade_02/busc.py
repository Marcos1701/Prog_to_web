import collections
import requests
from bs4 import BeautifulSoup


def coleta_e_organiza_dados(soup, palavra_chave, url):
    try:
        ocorrencias_pc = []
        for ocorrencia in soup.find_all(text=lambda text: palavra_chave in text):
            texto = ocorrencia.parent.get_text()
            index = texto.index(palavra_chave)
            inicio = texto[max(index - 20, 0):index]
            fim = texto[index+len(palavra_chave):index+len(palavra_chave)+20]
            ocorrencias_pc.append(f'{inicio}{palavra_chave}{fim}')

        links = []
        for a in soup.find_all('a', href=True):
            link = a['href']
            if link.startswith('http://') or link.startswith('https://'):
                links.append(link)
            elif link.startswith('//'):
                links.append(f"{url.split('//')[0]}{link}")
            elif link.startswith('/'):
                links.append(f"{url}{link}")
            else:
                links.append(f"{url}/{link}")

        data = {
            'url': url,
            'ocorrencias': ocorrencias_pc,
            'links': links,
            'ranking': 0
        }
        return data
    except Exception as e:
        print(
            f"An error occurred in the 'coleta_e_organiza_dados' function: {e}\n")
        return None


def definir_ranks(resultados, links):
    try:
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
    except:
        print('Ops, ocorreu um erro na função "definir_ranks"... \n')
        return None


def exibe_por_ranking(resultados):
    try:
        print("----- Resultados da Busca de Profundidade -----")
        dados_ordenados = sorted(
            resultados, key=lambda k: k['ranking'], reverse=True)
        for dado in dados_ordenados:
            print(f'url: {dado["url"]}')
            print("Resultados da busca: ")
            for resultado in dado['ocorrencias']:
                print(f" - {resultado}")
            print()
    except Exception as e:
        print(f'Ops, ocorreu um erro na função "exibe_por_ranking": {e} \n')


def search(palavra, url, profundidade=0):
    try:
        retorno = requests.get(url)
        soup = BeautifulSoup(retorno.content, 'html.parser')

        resultados = []
        links_utilizados = {url: {'qtd_referencias': 0}}
        json_resultante = coleta_e_organiza_dados(soup, palavra, url)

        if json_resultante is not None:
            resultados.append(json_resultante)

        for _ in range(profundidade):
            novos_links = []
            for link in json_resultante['links']:  # lista de links
                if not link.startswith(('http', 'www')):
                    continue

                if link not in links_utilizados:
                    links_utilizados[link] = {'qtd_referencias': 0}
                    retorno = requests.get(link)
                    soup = BeautifulSoup(retorno.content, 'html.parser')
                    json_resultante = coleta_e_organiza_dados(
                        soup, palavra, link)

                    if json_resultante is not None:
                        resultados.append(json_resultante)
                        novos_links.extend(json_resultante['links'])
                        # atualiza o número de referências dos links já utilizados

        # conta quantas vezes cada link aparece na lista de novos links
        # e atualiza o número de referências dos links já utilizados
        contador_links = collections.Counter(novos_links)
        for link, count in contador_links.items():
            links_utilizados[link]['qtd_referencias'] += count

        resultados_com_ranking = definir_ranks(resultados, links_utilizados)
        exibe_por_ranking(resultados_com_ranking)
    except:
        print('Ops, ocorreu um erro na função "search"... \n')

    return None


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
