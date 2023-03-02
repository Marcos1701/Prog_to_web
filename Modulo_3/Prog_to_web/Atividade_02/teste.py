import requests
#import requests_cache
from bs4 import BeautifulSoup
import collections

#requests_cache.install_cache()

links_utilizados = []
def exibir_retorno(resultados):
    if resultados is not None:
       for resultado in resultados:
           for ocorrencia in resultado['ocorrencias']:
               print(f' - {ocorrencia}')
    else:
        print("Ops, um valor invalido foi enviado...")

def definir_ranks(resultados) :

    for link in links_utilizados:
        for link_2 in links_utilizados:
            link['qtd_referencias'] += link_2['links'].count(link['url'])

    for resultado in resultados:
        occurrences = len(resultado['ocorrencias'])
        rank = occurrences
        ref = resultado['qtd_referencias']

        if (ref <= 10):
            rank += ref * 0.5
        else:
            rank += ref * 1.5

        resultado['ranking'] = rank

        return resultados
        

        
        
def search(url, palavra, prof, url_ja_buscadas = []):
    if url in links_utilizados:
        links_utilizados['url']['qtd_referencias'] += 1
        return []

    pagina = requests.get(url)
    soup = BeautifulSoup(pagina.text, 'html.parser')
    
    ocorrencias = []
    tags_a = soup.find_all('a')
    links = []
    
    for a in tags_a:
        if a.has_attr("href"):
          link = a['href']
        
        # startswith verifica se a sting começa pelo que está sendo passado como parâmetro;
        if link.startswith('http://') or link.startswith('https://'):
            links.append(link)
        elif link.startswith('//'):
            links.append(f"{url.split('//')[0]}{link}")
        elif link.startswith('/'):
            links.append(f"{url}{link}")
        elif link is None or link == '' or link == '#':
            continue
        else:
            links.append(f"{url}/{link}")
    
    for ocorrencia in soup.find_all(palavra):
        if(ocorrencia.index >= 20):
            if(ocorrencia.index + len(palavra) + 20 <= len(soup.get_text())):
               ocorrencias.append(soup[int(ocorrencia.index) - 20: len(palavra) + 20])
            else:
               ocorrencias.append(soup[int(ocorrencia.index) - 20: len(soup.get_text())])
        else:
            if(ocorrencia.index + len(palavra) + 20 <= len(soup.get_text())):
               ocorrencias.append(soup[0: len(palavra) + 20])
            else:
               ocorrencias.append(soup[0: len(soup.get_text())])
        print(ocorrencia)
   
    links_utilizados.append([{
          'url' : url, 
          'qtd_referencias': 0
    }]) 
    resultado = {
        'url': url,
        'ocorrencias': ocorrencias,
        'ranking': 0,
        'links': links,
        'qtd_referencias': 0
    }
    
    resultados = [resultado]
    
    url_ja_buscadas.append(url)
    if(prof > 0):
        for link in links:
            resultados.append(search(link,palavra, prof - 1, url_ja_buscadas))
    
    return resultados
            
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