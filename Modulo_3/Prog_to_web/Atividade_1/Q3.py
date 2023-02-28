from bs4 import BeautifulSoup
import requests
import requests_cache
import re  # essa biblioteca é utilizada para buscar elementos/palavras
# no html por meio de um padrão pre-estabelecido..


requests_cache.install_cache('banco')
print("Digite a url da página: ")
pag = input('=> ')

response = requests.get(pag, verify=False)

soap = BeautifulSoup(response.text, 'html.parser')

conteudo_pag = soap.get_text()

print('Digite o termo a ser buscado a seguir: ')
termo = input('=> ')
padrao = '.{0,20}' + termo + '.{0,20}'

ocorrencias = re.findall(padrao, conteudo_pag)

for ocorrencia in ocorrencias:
    print(' - ', ocorrencia)
