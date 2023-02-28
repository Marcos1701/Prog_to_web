import requests
import requests_cache
from bs4 import BeautifulSoup
# from pprint import pprint
requests_cache.install_cache('banco')
response = requests.get(
    'https://www.ifpi.edu.br/', verify=False)
soup = BeautifulSoup(response.text, 'html.parser')
a = soup.find_all('a')
print('texto do atributo <a> - Link(href)\n')
for link in a:
    href = link.get('href')
    print(link.get_text(), " - ", href)
