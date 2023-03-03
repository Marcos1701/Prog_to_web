import requests
import requests_cache
from bs4 import BeautifulSoup
import re

requests_cache.install_cache('banco')


class Armazena_links:
    def __init__(self):
        self.links = []

    def add_link(self, link):
        self.links.append(link)

    def get_links(self):
        return self.links

    def limpa_links(self):
        self.links = []

    def __str__(self):
        return f"Links: {self.links}"


def search(url, palavra, prof_busca):
    print("Buscando por: ", palavra)
    retorno = []
    retorno.append(url)
    links = [url]
    for i in range(prof_busca):
        links = get_links(links, palavra, retorno)
    return retorno


def buscar_ocorrencias(url, palavra):
    print(url)
    pagina = requests.get(url)
    soup = BeautifulSoup(pagina.text, 'html.parser')

    if not soup.body:
        return []
    print("Carregando pagina: ", url)
    try:
        texto = soup.body.get_text()
    except AttributeError:
        print("Erro ao buscar texto no body da pagina, url: ", url)
        return []

    trechos = list(filter(bool, texto.split('\n')))

    print("Obtendo as ocorrencias da palavra: ", palavra, " na pagina: ", url)
    ocorrencias = [{
        'ocorrencias': [],
        'qtd_ocorrencias': 0
    }]
    qtd_ocorrencias = 0

    for trecho in trechos:
        if palavra in trecho:
            ocorrencias.append(trecho)
            qtd_ocorrencias += trecho.count(palavra)

    ocorrencias[0]['qtd_ocorrencias'] = qtd_ocorrencias
    ocorrencias[0]['ocorrencias'] = ocorrencias[1:]
    return ocorrencias


def get_links(links, palavra, retorno):
    links_novos = []
    for url in links:

        pagina = requests.get(url)
        soup = BeautifulSoup(pagina.text, 'html.parser')
        tags_a = soup.find_all('a')
        for a in tags_a:
            link = a.get('href')
            novo_link = ''
            if not link or link == '' or link == '#' or link is None:
                continue

            if link.startswith('http://') or link.startswith('https://'):
                novo_link = link
                links_novos.append(link)
            elif link.startswith('//'):
                novo_link = f"{link.split('//')[0]}{link}"
                links_novos.append(novo_link)
            elif link.startswith('/'):
                novo_link = f"{url}{link}"
                links_novos.append(novo_link)
            elif link.startswith('./'):
                novo_link = f"{url}/{link.split('./')[1]}"
                links_novos.append(novo_link)
            else:
                novo_link = f"{url}/{link}"
                links_novos.append(novo_link)

            ocorrencias = buscar_ocorrencias(novo_link, palavra)
            if ocorrencias is not None:
                retorno.append(novo_link)
                retorno.append(ocorrencias)
    return links_novos


def exibir_retorno(retorno):
    print("- - - - - - - - - - - - Exibindo retorno - - - - - - - - - - - -")
    for i in range(len(retorno)):
        if i % 2 == 0:
            print(f"URL: {retorno[i]}")
        else:
            for ocorrencia in retorno[i]['ocorrencias']:
                print(f"Ocorrencias: {ocorrencia}")
            print(f"Qtd Ocorrencias: {retorno[i]['qtd_ocorrencias']}")


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
