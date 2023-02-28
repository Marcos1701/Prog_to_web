import requests

print("Digite a url da imagem a seguir: ")
site = input('=> ')

resposta = requests.get(site)

if resposta.status_code == 200:  # 200 = deu certo
    with open("img.png", 'wb') as f:
        f.write(resposta.content)
        print('Imagem baixada com sucesso!!')
else:
    print('Imagem não encontrada..')
