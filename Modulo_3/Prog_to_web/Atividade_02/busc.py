

# Optimized Code
import collections
import requests
import requests_cache
from bs4 import BeautifulSoup

requests_cache.install_cache("banco")


def collect_and_organize_data(soup, keyword, url):
    try:
        occurrences_pc = []
        for occurrence in soup.find_all(keyword):
            text = occurrence.parent.get_text()
            index = text.index(keyword)
            start = text[max(index - 20, 0):index]
            end = text[index+len(keyword):index+len(keyword)+20]
            occurrences_pc.append(f'{start}{keyword}{end}')

        links = []
        for a in soup.find_all('a'):
            link = a['href']
            if link.startswith('http://') or link.startswith('https://'):
                links.append(link)
            elif link.startswith('//'):
                links.append(f"{url.split('//')[0]}{link}")
            elif link.startswith('/'):
                links.append(f"{url}{link}")
            else:
                links.append(f"{url}/{link}")

        data = {
            'url': url,
            'occurrences': occurrences_pc,
            'links': links,
            'ranking': 0
        }
        return data
    except Exception as e:
        print(
            f"An error occurred in the 'collect_and_organize_data' function: {e}\n")
        return None


def set_ranks(results, links):
    try:
        for result in results:
            occurrences = len(result['occurrences'])
            rank = occurrences
            ref = links[result['url']]['qtd_references']

            if (ref <= 10):
                rank += ref * 0.5
            else:
                rank += ref * 1.5

            result['ranking'] = rank

        return results
    except:
        print('Ops, an error occurred in the "set_ranks" function... \n')
        return None


def display_by_ranking(results):
    try:
        print("----- Deep Search Results -----")
        sorted_data = sorted(
            results, key=lambda k: k['ranking'], reverse=True)
        for data in sorted_data:
            print(f'url: {data["url"]}')
            print("Search results: ")
            for result in data['occurrences']:
                print(f" - {result}")
            print()
    except Exception as e:
        print(
            f'Ops, an error occurred in the "display_by_ranking" function: {e} \n')


def search(word, url, depth=0):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        results = []
        used_links = {url: {'qtd_references': 0}}
        resulting_json = collect_and_organize_data(soup, word, url)

        if resulting_json is not None:
            results.append(resulting_json)

        for _ in range(depth):
            new_links = []
            for link in resulting_json['links']:  # list of links
                if not link.startswith(('http', 'www')):
                    continue

                if link not in used_links:
                    used_links[link] = {'qtd_references': 0}
                    response = requests.get(link)
                    soup = BeautifulSoup(response.content, 'html.parser')
                    resulting_json = collect_and_organize_data(
                        soup, word, link)

                    if resulting_json is not None:
                        results.append(resulting_json)
                        new_links.extend(resulting_json['links'])
                        # update the number of references of the already used links

        # count how many times each link appears in the new links list
        # and update the number of references of the already used links
        link_counter = collections.Counter(new_links)
        for link, count in link_counter.items():
            used_links[link]['qtd_references'] += count

        results_with_ranking = set_ranks(results, used_links)
        
        return results_with_ranking
    except:
        print('Ops, an error occurred in the "search" function... \n')

    return None


def main():
    print("Digite a url que deseja iniciar a busca a seguir: ")
    url = input('=> ')

    print("ok..\n Agora digite a palavra que deseja buscar: ")
    keyword = input('=> ')

    print("Certo..\n Agora insira a Profundidade da Busca: ")
    search_depth = int(input("=> "))

    response = search(keyword, url, search_depth)
    display_by_ranking(response)


main()
