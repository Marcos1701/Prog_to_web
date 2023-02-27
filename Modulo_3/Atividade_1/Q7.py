import requests

print("Digite o cep a seguir: ")
cep = input('=> ')

retorno = requests.get(f'https://viacep.com.br/ws/{cep}/json/')

endereco = retorno.json()

print("Endereço resultante:\n")
print(f'Logradouro: {endereco["logradouro"]}')
print(f'Bairro: {endereco["bairro"]}')
print(f'Cidade: {endereco["localidade"]}')
print(f'UF: {endereco["uf"]}')
print(f'DDD utilizado: {endereco["ddd"]}')
