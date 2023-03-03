import requests
import requests_cache
from bs4 import BeautifulSoup
import re

requests_cache.install_cache('banco')


class Url:
    def __init__(self, url):
        self._url = url
        self.links = []
        self._ocorrencias = ocorrencia(url)
        self.rank = 0
        self.referencias = 0

    @property
    def url(self):
        return self._url

    @property
    def ocorrencias(self):
        return self._ocorrencias.ocorrencias_palavra

    @ocorrencias.setter
    def ocorrencias(self, value):
        self._ocorrencias = value

    @property
    def qtd(self):
        return self._ocorrencias.qtd


class ocorrencia:
    def __init__(self, url):
        self._url = url
        self._ocorrencias_palavra = []
        self._qtd_ocorrencias = 0

    @property
    def url(self):
        return self._url

    @property
    def ocorrencias_palavra(self):
        return self._ocorrencias_palavra

    @property
    def qtd(self):
        return self._qtd_ocorrencias

    
def set_ranks(results, links):
    try:

        for result in results:
            if isinstance(Url,result):
               rank = result.qtd
               ref = 

               if (ref <= 10):
                   rank += ref * 0.5
                else:
                   rank += ref * 1.5

            result['ranking'] = rank

        return results
    except:
        print('Ops, an error occurred in the "set_ranks" function... \n')
        return None

def buscar_ocorrencias(url, palavra):
    print(url)
    try:
        pagina = requests.get(url)
    except AttributeError:
        print("Erro ao buscar texto no body da pagina, url: ", url)
        return {'ocorrencias': [], 'qtd_ocorrencias': 0}
    texto = BeautifulSoup(pagina.text, 'html.parser')
    ocorrencias = ocorrencia(url)
    trechos = texto.find_all(string=lambda text: palavra in text)
    #aux = []
    print(trechos)

    for trecho in trechos:
        if palavra in trecho:
           indice = trecho.index(palavra)
           trecho_completo = trecho[max(0, indice-20):indice+len(palavra)+20]
           ocorrencias._ocorrencias_palavra.append(trecho_completo)
           ocorrencias._qtd_ocorrencias += trecho.count(palavra)
    return ocorrencias



def search(url, palavra, prof_busca):
    print("Buscando por: ", palavra)
    retorno = []
    retorno.append(Url(url))
    links = [url]
    for i in range(0, prof_busca):
        links = get_links(links, palavra, retorno)
    return retorno


def get_links(links, palavra, retorno):
    links_novos = []
    for url in links:

        pagina = requests.get(url)
        soup = BeautifulSoup(pagina.text, 'html.parser')
        tags_a = soup.find_all('a')
        for a in tags_a[:5]:
            link = a.get('href')
            novo_link = ''
            if not link or link == '' or link == '#' or link is None:
                continue

            if link.startswith('http://') or link.startswith('https://'):
                novo_link = Url(link)
                links_novos.append(novo_link)
            elif link.startswith('//'):
                novo_link = Url(f"{link.split('//')[0]}{link}")
                links_novos.append(novo_link)
            elif link.startswith('/'):
                novo_link = Url(f"{url}{link}")
                links_novos.append(novo_link)
            elif link.startswith('./'):
                novo_link = Url(f"{url}/{link.split('./')[1]}")
                links_novos.append(novo_link)
            else:
                novo_link = Url(f"{url}/{link}")
                links_novos.append(novo_link)

            ocorrencias = buscar_ocorrencias(novo_link.url, palavra)
            novo_link.ocorrencias = ocorrencias
            if ocorrencias is not None:
                retorno.append(novo_link)
               # retorno.append(ocorrencias)
    return links_novos


def exibir_retorno(retorno = []):
    print("- - - - - - - - - - - - Exibindo retorno - - - - - - - - - - - -")
    for i in range(len(retorno)):
        if retorno[i] is not None:
            print(f"URL: {retorno[i].url}")
            for ocorrencia in retorno[i].ocorrencias:
               print(f"Ocorrencias: {ocorrencia}")
            print(f"Qtd Ocorrencias: {retorno[i].qtd}")


def main():
    print("Digite a url que deseja iniciar a busca a seguir: ")
    url = input('=> ')

    print("ok..\n Agora digite a palavra que deseja buscar: ")
    palavra = input('=> ')

    print("Certo..\n Agora insira a Profundidade da Busca: ")
    prof_busca = int(input("=> "))

    retorno = search(url, palavra, prof_busca)

    exibir_retorno(retorno)


main()
