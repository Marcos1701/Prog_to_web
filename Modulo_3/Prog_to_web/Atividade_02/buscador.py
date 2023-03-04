import requests
import requests_cache
from bs4 import BeautifulSoup
import re
from typing import List

requests_cache.install_cache('banco')


class Armazena_links:
    def __init__(self):
        self._total_links = []
        self._novos_links = []

    @property
    def links(self):
        return self._total_links

    @links.setter
    def links(self, value):
        self._total_links = value

    def add_novo_link(self, link):
        if link not in self._total_links:
            self._novos_links.append(link)

    def add_novos_links(self, links):
        for link in links:
            if link not in self._total_links:
                self._novos_links.append(links)

    def reseta_novos_links(self):
        self._total_links.append(self._novos_links)
        self._novos_links = []

    def get_all_links(self):
        return self._total_links


links = Armazena_links()
retorno = []


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
    def __init__(self, url: str):
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


def set_ranks(resultados: List[Url], links: Armazena_links):
    try:
        add_ref(links, resultados)
        resultados = remover_url_sem_ocorrencias(resultados)

        for result in resultados:
            if isinstance(result, type(Url)):

                qtd_ocorrencias = result.qtd
                if qtd_ocorrencias == 0:
                    resultados.remove(result)
                    continue
                rank = qtd_ocorrencias * 10
                ref = result.referencias

                if (ref <= 10):
                    rank += ref * 0.5
                else:
                    rank += ref * 1.5

                result.rank = rank

    except Exception as e:
        print('Ops, ocorreu um erro na função: "set_ranks"... \nErro: ', e)
        return None


def buscar_ocorrencias(url: str, palavra: str):
    print(url)
    try:
        pagina = requests.get(url)
    except AttributeError:
        print("Erro ao buscar texto no body da pagina, url: ", url)
        return {'ocorrencias': [], 'qtd_ocorrencias': 0}
    ocorrencias = ocorrencia(url)
    try:
        texto = BeautifulSoup(pagina.text, 'html.parser')
        padrao = re.compile(r'\b{}\b'.format(palavra))
        trechos = texto.find_all(string=padrao)
    except AttributeError:
        print("Erro ao buscar texto no body da pagina, url: ", url)
        return {'ocorrencias': [], 'qtd_ocorrencias': 0}

    for trecho in trechos:
        if palavra in trecho:
            ocorrencias._ocorrencias_palavra.append(trecho)
            ocorrencias._qtd_ocorrencias += trecho.count(palavra)
    return ocorrencias


def search(url_inicio: str, palavra: str, prof_busca: int):
    print("Buscando por: ", palavra)
    retorno.append(Url(url=url_inicio))
    links.add_novo_link(url_inicio)
    get_links(links, palavra, retorno, prof_busca)


def add_ref(links: Armazena_links, results: List[Url]):
    for result in results:
        for link in links.get_all_links():
            if result.url == link:
                result.referencias += 1


def get_links(links: Armazena_links, palavra: str, retorno, prof_busca: int):
    links_novos = []
    for url in links._novos_links:
        if url in links._total_links:
            continue

        pagina = requests.get(url)
        soup = BeautifulSoup(pagina.text, 'html.parser')
        tags_a = soup.find_all('a')
        for a in tags_a[:10]:
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
                novo_link = Url(
                    f"{url.split('//')[0]}{url.split('//')[1].split('/')[0]}{link}")
                links_novos.append(novo_link)
            else:
                novo_link = Url(
                    f"{url.split('//')[0]}{url.split('//')[1].split('/')[0]}/{link}")
                links_novos.append(novo_link)

            ocorrencias = buscar_ocorrencias(novo_link.url, palavra)
            novo_link.ocorrencias = ocorrencias
            retorno.append(novo_link)

    links.add_novos_links(links_novos)
    links.reseta_novos_links()

    if len(links_novos) > 0 and prof_busca > 0:
        get_links(links, palavra, retorno, prof_busca - 1)

    return retorno


def exibir_retorno(retorno: List[Url]):
    print("- - - - - - - - - - - - Exibindo retorno - - - - - - - - - - - -")
    for i in range(len(retorno)):
        if retorno[i] is not None:
            print(f"URL: {retorno[i].url}")
            for ocorrencia in retorno[i].ocorrencias:
                print(f"Ocorrencias: {ocorrencia}")
            print(f"Qtd Ocorrencias: {retorno[i].qtd}")
            print(f'Este site foi referenciado {retorno[i].referencias} vezes')


def remover_url_sem_ocorrencias(retorno: List[Url]):
    for url in retorno:
        if url.qtd == 0:
            retorno.remove(url)
    return retorno


def confere_link(url: str):
    try:
        pagina = requests.get(url)
        return True
    except:
        return False


def main():
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

    search(url, palavra, prof_busca)
    set_ranks(retorno, links)

    exibir_retorno(retorno)


main()
