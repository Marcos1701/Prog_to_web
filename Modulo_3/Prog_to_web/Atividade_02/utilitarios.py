import requests
import requests_cache
from bs4 import BeautifulSoup
from typing import List

requests_cache.install_cache('banco')


class Armazena_links:
    def __init__(self):
        self.links_sem_repetir = []
        self._novos_links = []
        self._total_links = []

    @property
    def links(self):
        return self.links_sem_repetir

    @links.setter
    def links(self, value):
        self.links_sem_repetir = value

    def add_novo_link(self, link):
        self._total_links.append(link)
        if link not in self.links_sem_repetir:
            self._novos_links.append(link)

    def conferir_link(self, link: str):
        if link is not None and link != '':
            self._total_links.append(link)
            return link in self.links_sem_repetir
        return False

    def add_novos_links(self, links):
        for link in links:
            self._total_links.append(link)
            if link not in self.links_sem_repetir:
                self._novos_links.append(link)
        self.links_sem_repetir.extend(self._novos_links)
        self._novos_links = []

    def reseta_novos_links(self):
        self.links_sem_repetir.append(self._novos_links)
        self._novos_links = []

    def get_all_links(self):
        return self._total_links


class Url:
    def __init__(self, url: str):
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


# Recebe uma lista de urls e remove as urls que não possuem ocorrencias da palavra-chave.
def remover_url_sem_ocorrencias(resultados: List[Url]):
    return [url for url in resultados if isinstance(url, Url) and url.qtd > 0]


# Recebe uma lista de urls, remove as urls sem ocorrencias da palavr-chave
# e retorna a lista organizada com base em um ranqueamento.

def set_ranks(resultados: List[Url], links: Armazena_links):
    try:
        resultados = add_ref(links, resultados)
        resultados = remover_url_sem_ocorrencias(resultados)

        i = 0
        for result in resultados:
            if isinstance(result, type(Url)):

                qtd_ocorrencias = result.qtd
                if qtd_ocorrencias == 0:
                    resultados.pop(i)
                    continue
                rank = qtd_ocorrencias * 10
                ref = result.referencias

                if (ref <= 10):
                    rank += ref * 0.5
                else:
                    rank += ref * 1.5

                result.rank = rank
                i += 1
        retorno = sorted(resultados, key=lambda x: x.rank if isinstance(
            x, Url) else resultados.pop(resultados.index(x)), reverse=True)
        return retorno

    except Exception as e:
        print('Ops, ocorreu um erro na função: "set_ranks"... \nErro: ', e)
        return None


# Recebe uma url e uma palavra-chave e retorna uma lista com as ocorrencias da palavra-chave.
def buscar_ocorrencias(url, palavra: str):
    # print(url)
    try:
        pagina = requests.get(url)
        ocorrencias = ocorrencia(url)
        texto = BeautifulSoup(pagina.text, 'html.parser')
        print(f"Obtendo as ocorrencias de {palavra} na pagina '{url}'..\n")
        trechos = texto.find_all(string=lambda text: palavra in text)
    except Exception as e:
        print("Ocorreu um erro ao buscar o texto presente no body da pagina, url: ", url)
        print("Erro: ", e)
        return ['']

    for trecho in trechos:
        if trecho and trecho.text.strip():
            ocorrencias.ocorrencias_palavra.append(trecho.text)
            ocorrencias._qtd_ocorrencias += trecho.count(palavra)

    return ocorrencias


# Recebe uma lista de Urls, uma palavra-chave e uma profundidade de busca e
# retorna uma lista com as Urls que possuem ocorrencias da palavra buscada.

def search(url_inicio: str, palavra: str, prof_busca: int):
    try:
        links = Armazena_links()
        dados = []

        print("Buscando por: ", palavra)
        dados.append(Url(url_inicio))
        links.add_novo_link(url_inicio)
        [dados, links] = get_links(links, palavra, dados, prof_busca)

        return [dados, links]
    except Exception as e:
        print('Ops, ocorreu um erro na função: "search"... \nErro: ', e)
        return None


# Recebe uma lista de Urls e adiciona a quantidade de referencias que cada uma tem com base
# em uma lista geral de ocorrencias.
def add_ref(links: Armazena_links, results: List[Url]):
    try:
        for result in results:
            if isinstance(result, type(Url)):
                for link in links.get_all_links():
                    if result.url == link:
                        result.referencias += 1
        return results
    except Exception as e:
        print('Ops, ocorreu um erro na função: "add_ref"... \nErro: ', e)
        return None


# Recebe uma lista de Urls, uma palavra-chave e uma profundidade de busca e
# retorna uma lista com as Urls analisadas.
def get_links(links: Armazena_links, palavra: str, dados, prof_busca: int):
    try:
        links_novos = []
        for url in links._novos_links:
            if not links.conferir_link(url):
                pagina = requests.get(url)
                soup = BeautifulSoup(pagina.text, 'html.parser')
                tags_a = soup.find_all('a')
                for a in tags_a:
                    link = a.get('href')
                    if not link or link is None:
                        continue
                    novo_link = ''

                    if link[0] == '/':
                        if link.startswith('//'):
                            novo_link = Url(f"http:{link}")
                        elif dados[0].url.endswith('/'):
                            novo_link = Url(
                                f"{dados[0].url}{link[1:]}")
                        else:
                            novo_link = Url(
                                f"{dados[0].url}{link}")
                        links_novos.append(novo_link)
                    elif link.startswith(dados[0].url):
                        novo_link = Url(link)
                        links_novos.append(novo_link)
                    else:
                        continue

                    ocorrencias = buscar_ocorrencias(novo_link.url, palavra)
                    novo_link.ocorrencias = ocorrencias
                    dados.append(novo_link)

        links.reseta_novos_links()
        links.add_novos_links(links_novos)

        retorno = [dados, links]

        if len(links._novos_links) > 0 and prof_busca > 0:
            # print('chegou aqui..')
            aux = get_links(links, palavra, dados,
                            prof_busca - 1)
            retorno[0].append(aux[0])
            retorno[1] = aux[1]

        return retorno
    except Exception as e:
        print('Ops, ocorreu um erro na função: "get_links"... \nErro: ', e)
        return None


# Exibe os dados obtidos na busca.
def exibir_dados_obtidos(Dados_resultantes: List[Url]):
    try:
        print("\n- - - - - - - - - - - - Exibindo Resultados da Busca - - - - - - - - - - - -\n")
        if Dados_resultantes:
            for i in range(len(Dados_resultantes) - 1):
                if Dados_resultantes[i] is not None and isinstance(Dados_resultantes[i], Url) and Dados_resultantes[i].qtd > 0:
                    print(f"URL: {Dados_resultantes[i].url}")
                    x = 1
                    print("Ocorrencias: \n")
                    for ocorrencia in Dados_resultantes[i].ocorrencias:
                        print(f"{x} - {ocorrencia}\n")
                        x += 1
                    print(f"Qtd Ocorrencias: {Dados_resultantes[i].qtd}")
                    print(
                        f'Este site foi referenciado {Dados_resultantes[i].referencias} vezes')
                else:
                    print("Dado inválido encontrado...\n")
                    Dados_resultantes.pop(i)
        else:
            print("Ops, nenhum dado foi encontrado...")
    except Exception as e:
        print('Ops, ocorreu um erro na função: "exibir_dados_obtidos"... \nErro: ', e)
        return None


# Recebe uma url e retorna True se a url for válida e False caso contrário.
def confere_link(url: str):
    try:
        pagina = requests.get(url)
        return True
    except:
        return False
