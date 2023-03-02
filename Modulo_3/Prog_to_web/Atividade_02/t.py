import requests
#import requests_cache
from bs4 import BeautifulSoup
        

links_utilizados = []


def exibir_retorno(results):
    for result in results:
        url = result['url']
        print(f'Url: {url}')
        profundidade = result['profundidade']
        print(f'Profundidade de busca: {profundidade}')
        print('------ Retorno ------')
        for ocorrencia in result['ocorrencias']:
            print(f' - {ocorrencia}')

def search(url, palavra, profundidade_maxima, url_ja_buscadas = [], prof_atual = 1):
    if url in links_utilizados:
        links_utilizados['url']['qtd_referencias'] += 1
        return []

    pagina = requests.get(url)
    soup = BeautifulSoup(pagina.text, 'html.parser')
    
    ocorrencias = []
    tags_a = soup.find_all('a')
    links = []
    
    for a in tags_a[:5]:
        link = a.get('href')
        if not link or link == '' or link == '#':
            continue
        
        # startswith verifica se a sting começa pelo que está sendo passado como parâmetro;
        if link.startswith('http://') or link.startswith('https://'):
            links.append(link)
        elif link.startswith('//'):
            links.append(f"{url.split('//')[0]}{link}")
        elif link.startswith('/'):
            links.append(f"{url}{link}")
        else:
            links.append(f"{url}/{link}")
    
    for ocorrencia in soup.find_all(palavra):
        #if(ocorrencia.index >= 20):
      #      if(ocorrencia.index + len(palavra) + 20 <= len(soup.get_text())):
    #           ocorrencias.append(soup[int(ocorrencia.index) - 20: len(palavra) + 20])
     #       else:
      #         ocorrencias.append(soup[int(ocorrencia.index) - 20: len(soup.get_text())])
       # else:
       #     if(ocorrencia.index + len(palavra) + 20 <= len(soup.get_text())):
      #         ocorrencias.append(soup[0: len(palavra) + 20])
     #       else:
    #           ocorrencias.append(soup[0: len(soup.get_text())])
       ocorrencias.append(ocorrencia)
       print(ocorrencia)
   
    links_utilizados.append({
          'url' : url, 
          'qtd_referencias': 0
    }) 
    resultado = {
        'url': url,
        'ocorrencias': ocorrencias,
        'ranking': 0,
        'links': links,
        'profundidade': prof_atual
    }

    
    resultados = [resultado]
    if profundidade_maxima > 0:
      for link in links:
        resultados += search(link, palavra, profundidade_maxima - 1, url_ja_buscadas, prof_atual + 1)

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