from bs4 import BeautifulSoup
import requests
import requests_cache

requests_cache.install_cache("banco")

response = requests.get('https://www.ifpi.edu.br/', verify=False)
soup = BeautifulSoup(response.text, 'html.parser')

print('Digite a tag a seguir: ')
tag = input('=> ')

conteudos = soup.find_all(tag)

for conteudo in conteudos:
    text = conteudo.get_text()
    print('- ', text)
