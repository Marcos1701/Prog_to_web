# import collections
import requests
from bs4 import BeautifulSoup


# def coleta_e_organiza_dados(soup, keyword, url):
#     try:
#         occurrences_pc = []
#         for occurrence in soup.find_all(keyword):
#             # text = occurrence.parent.get_text()
#             # index = text.index(keyword)
#             # start = text[max(index - 20, 0):index]
#             # end = text[index+len(keyword):index+len(keyword)+20]
#             # occurrences_pc.append(f'{start}{keyword}{end}')

#         links = []
#         for a in soup.find_all('a', href=True):
#             link = a['href']
#             if link.startswith('http://') or link.startswith('https://'):
#                 links.append(link)
#             elif link.startswith('//'):
#                 links.append(f"{url.split('//')[0]}{link}")
#             elif link.startswith('/'):
#                 links.append(f"{url}{link}")
#             else:
#                 links.append(f"{url}/{link}")

#         data = {
#             'url': url,
#             'occurrences': occurrences_pc,
#             'links': links,
#             'ranking': 0
#         }
#         return data
#     except Exception as e:
#         print(
#             f"An error occurred in the 'collect_and_organize_data' function: {e}\n")
#         return None


# def definir_ranks(resultados, links):
#     # try:
#     for resultado in resultados:
#         ocorrencias = len(resultado['ocorrencias'])
#         rank = ocorrencias
#         ref = links[resultado['url']]['qtd_referencias']

#         if (ref <= 10):
#             rank += ref * 0.5
#         else:
#             rank += ref * 1.5

#         resultado['ranking'] = rank

#     return resultados
#     # except:
#     #    print('Ops, ocorreu um erro na função "definir_ranks"... \n')
#     #    return None


# def exibe_por_ranking(resultados):
#     # try:
#     print("----- Resultados da Busca de Profundidade -----")
#     dados_ordenados = sorted(
#         resultados, key=lambda k: k['ranking'], reverse=True)
#     for dado in dados_ordenados:
#         print(f'url: {dado["url"]}')
#         print("Resultados da busca: ")
#         for resultado in dado['ocorrencias']:
#             print(f" - {resultado}")
#         print('\n')
#     # except:
#     #    print('Ops, ocorreu um erro na função "exibe_por_ranking"... \n')


# def search(palavra, url, profundidade=0):
#     # try:
#     retorno = requests.get(url)

#     soup = BeautifulSoup(retorno.content, 'html.parser')

#     results = []
#     used_links = {url: {'qtd_references': 0}}
#     resulting_json = coleta_e_organiza_dados(soup, palavra, url)

#     if resulting_json is not None:
#         results.append(resulting_json)

#     for _ in range(profundidade):
#         new_links = []
#         for link in resulting_json['links']:  # list of links
#             if not link.startswith(('http', 'www')):
#                 continue

#             if link not in used_links:
#                 used_links[link] = {'qtd_references': 0}
#                 response = requests.get(link)
#                 soup = BeautifulSoup(response.content, 'html.parser')
#                 resulting_json = coleta_e_organiza_dados(
#                     soup, palavra, link)
#                 if resulting_json is not None:
#                     results.append(resulting_json)
#                     new_links.extend(resulting_json['links'])
#                     # update the number of references of the already used links

#         # count how many times each link appears in the new links list
#         # and update the number of references of the already used links
#     link_counter = collections.Counter(new_links)
#     for link, count in link_counter.items():
#         used_links[link]['qtd_references'] += count

#     results_with_ranking = definir_ranks(results, used_links)
#     exibe_por_ranking(results_with_ranking)

#     return None


# def main():
#     print("Digite a url que deseja iniciar a busca a seguir: ")
#     url = input('=> ')

#     print("ok..\n Agora digite a palavra que deseja buscar: ")
#     palavra_chave = input('=> ')

#     print("Certo..\n Agora insira a Profundidade da Busca: ")
#     profundidade_busca = int(input("=> "))

#     retorno = search(palavra_chave, url, profundidade_busca)
#     exibe_por_ranking(retorno)


# main()

url = requests.get('https://www.cnnbrasil.com.br/')
soup = BeautifulSoup(url.content, 'html.parser')
# text = soup.get_text()

for a in soup.find_all('governo'):
    print(a.text)
