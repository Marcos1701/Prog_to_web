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

    @_ocorrencias_palavra.setter
    def _ocorrencias_palavra(self, value):
        self._ocorrencias_palavra = value

    @_qtd_ocorrencias.setter
    def _qtd_ocorrencias(self, value):
        self._qtd_ocorrencias = value

    @property
    def url(self):
        return self._url

    @property
    def ocorrencias_palavra(self):
        return self._ocorrencias_palavra
    @property
    def qtd(self):
        return self._qtd_ocorrencias
    


def search(url, palavra, prof_busca):
    print("Buscando por: ", palavra)
    retorno = []
    retorno.append(Url(url))
    links = [url]
    for i in range(prof_busca):
        links = get_links(links, palavra, retorno)
    return retorno


def buscar_ocorrencias(url, palavra):
    print(url)
    pagina = requests.get(url)
    soup = BeautifulSoup(pagina.text, 'html.parser')

    if not soup.body:
        return {'ocorrencias': [], 'qtd_ocorrencias': 0}
    print("Carregando pagina: ", url)

    trechos = [tag.get_text() for tag in soup.body.find_all(text=re.compile('\S'))]
    trechos_com_palavra = [trecho for trecho in trechos if palavra in trecho]


    ocorrencias = ocorrencia(url)
    ocorrencias._ocorrencias_palavra = trechos_com_palavra
    ocorrencias._qtd_ocorrencias = sum(trecho.count(palavra) for trecho in trechos_com_palavra)

    return ocorrencias



def buscar_ocorrencias(url, palavra):
    print(url)
    pagina = requests.get(url)
    soup = BeautifulSoup(pagina.text, 'html.parser')

    if not soup.body:
        return {'ocorrencias': [], 'qtd_ocorrencias': 0}
    print("Carregando pagina: ", url)
    try:
        texto = soup.body.get_text()
    except AttributeError:
        print("Erro ao buscar texto no body da pagina, url: ", url)
        return {'ocorrencias': [], 'qtd_ocorrencias': 0}
    # html.find_all(string=lambda text: searchTerms in text)
    trechos = list(filter(bool, texto.split('\n')))

    print("Obtendo as ocorrencias da palavra: ", palavra, " na pagina: ", url)
    ocorrencias = ocorrencia(url)

    for trecho in trechos:
        if palavra in trecho:
            ocorrencias._ocorrencias_palavra.append(trecho)
            ocorrencias._qtd_ocorrencias += trecho.count(palavra)
    return ocorrencias



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
