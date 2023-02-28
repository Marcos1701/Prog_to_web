from bs4 import BeautifulSoup
import requests
import requests_cache
# não sei como fazer com que apenas os resultados desejados e
# suas url apareção, por isso o retorno fica bagunçado..

requests_cache.install_cache('banco')
print("Digite o que deseja buscar no google: ")
q = input('=> ')

exibir_url = input('exibir url? (s/n): ')

resposta = requests.get(f'https://www.google.com/search?q={q}', verify=False)

soup = BeautifulSoup(resposta.text, 'html.parser')

retorno = soup.find_all('a')

print("Resultado da Busca: ")

print("Texto resultante - url respectiva\n")

for resultado in retorno:
    url = resultado.get('href')
    texto = resultado.get_text()
    if texto is None or texto == ' ':
        texto = 'Sem texto..'

    if exibir_url == 's':
        print(f'{texto} - {url}')
    else:
        print(f'{texto}')
