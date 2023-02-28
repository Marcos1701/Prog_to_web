from bs4 import BeautifulSoup
import requests
import requests_cache

requests_cache.install_cache('banco')

print('Digite a url da página que deseja retirar a tabela: ')
url_pag = input('=> ')

response = requests.get(url_pag)

soup = BeautifulSoup(response.text, 'html.parser')

table = soup.find('table')  # aqui está a tabela..
linhas = table.find_all('tr')

for linha_da_tabela in linhas:
    colunas = linha_da_tabela.find_all('td')
    dados_da_linha = [coluna.text for coluna in colunas]
    print(dados_da_linha)  # os dados saem bagunçados, mas depende da tabela..
