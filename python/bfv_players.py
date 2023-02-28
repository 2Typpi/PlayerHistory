import sys
import requests
import json
from bs4 import BeautifulSoup, element


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class PlayerX:
    
    def __init__(self, name):
        self.name = name
        self.games = 1
        self.yellow_cards = 0
        self.yellow_red_cards = 0
        self.red_cards = 0
        self.goals = 0

statistics = {
    "Home": "",
    "FirstEleven": [],
    "Substitudes": [],
    "YellowCards": [],
    "YellowRedCards": [],
    "RedCards": [],
    "Scorers": []
}


def get_soup(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    return soup


def get_lineup_url(main_Page_Soup):
    job_elements = []
    job_elements = main_Page_Soup.find_all(
        "li", id="tab-spieldetailreiter-aufstellung")
    lineup_url = ""
    for job_element in job_elements:
        lineup_url = job_element["data-api-load"]

    if not lineup_url:
        return None
    return ("https://www.bfv.de" + lineup_url)


def get_starting_lineup(lineup_Soup, clubname1, clubname2, clubname3):
    startLineup = []
    teams = lineup_Soup.find_all("figure")
    i = 0
    for team in teams:
        if(team["data-img-alt"] != clubname1 and team["data-img-alt"] != clubname2 and team["data-img-alt"] != clubname3):
            continue
        playerdivs = team.parent.parent.parent.parent.parent.parent
        players = playerdivs.find_all_next("a")
        for player in players:
            startLineup.append(player.text)
            i += 1
            if(i == 12):
                break
    startLineup.pop(0)
    startLineupFormatted = []
    while(len(startLineup) > 0):
        player = startLineup.pop()
        startLineupFormatted.append(player.split())
    return startLineupFormatted


def get_substitutions(soup):
    substitudes = []
    matchEvents = soup.find_all(
        "div", class_="bfv-course-of-match-event bfv-course-of-match-event--" + statistics.get("Home"))
    for matchEvent in matchEvents:
        substitution = matchEvent.find(
            "div", class_="bfv-course-of-match-event__substitution")
        if(substitution != None):
            player = substitution.parent.previous_element.previous_element.previous_element.previous_element.previous_element.previous_element.previous_element
            substitudes.append(player.split())
        else:
            substitution = matchEvent.find_all("path")
            if(len(substitution) == 2):
                element = substitution[0].parent.parent.parent.parent.parent
                
                playerName = element.find("div", class_="bfv-course-of-match-event__player-name")
                if(playerName != None):
                    player = playerName.findChildren("a", recursive=False)
                else:
                    player = substitution[0].parent.parent.parent.parent.parent.parent.find("div", class_="bfv-course-of-match-event__player-name").findChildren("a", recursive=False)
                substitudes.append(player[0].text.split())
    return substitudes


def get_scorer(soup):
    scorers = []
    matchEvents = soup.find_all(
        "div", class_="bfv-course-of-match-event bfv-course-of-match-event--" + statistics.get("Home"))
    for matchEvent in matchEvents:
        scoreDiv = matchEvent.find(
            "div", class_="bfv-course-of-match-event__score")
        if(scoreDiv != None):
            if(scoreDiv.next_element.next_element.next_element.get_text() == "Elfmeter"):
                player = scoreDiv.next_element.next_element.next_element.next_element.next_element.next_element.find("a")
            else:
                player = scoreDiv.next_element.next_element.next_element.next_element.next_element.find("a")
            scorers.append(player.text.split())
    return scorers


def set_cards(soup):
    yellow = []
    yellowRed = []
    red = []
    matchEvents = soup.find_all(
        "div", class_="bfv-course-of-match-event bfv-course-of-match-event--" + statistics.get("Home"))
    for matchEvent in matchEvents:
        # g-Tag only exisits if a YellowRedCard is given
        yellowRedDiv = matchEvent.find("g")
        if(yellowRedDiv != None):
            player = matchEvent.find(
                "div", class_="bfv-course-of-match-event__player-name").find("a")
            yellowRed.append(player.text.split())
            continue

        # Check for Yellow or Red Card
        cardDiv = matchEvent.find("path")
        if(cardDiv != None and not cardDiv.has_attr("fill")):
            continue
        if(cardDiv["fill"] == "#FDC828"):
            player = matchEvent.find(
                "div", class_="bfv-course-of-match-event__player-name").find("a")
            yellow.append(player.text.split())
        if(cardDiv["fill"] == "#E1081C"):
            player = matchEvent.find(
                "div", class_="bfv-course-of-match-event__player-name").find("a")
            red.append(player.text.split())

    # Set statistics
    statistics.update({"RedCards": red})
    statistics.update({"YellowRedCards": yellowRed})
    statistics.update({"YellowCards": yellow})


def is_home(soup, clubname1, clubname2, clubname3):
    homeTeamDiv = soup.find(
        "div", class_="bfv-matchdata-result__team-wrapper bfv-matchdata-result__team-wrapper--team0")
    if homeTeamDiv == None:
        return None

    homeTeamImg = homeTeamDiv.find("figure")

    if homeTeamImg == None:
        return None

    if(homeTeamImg["data-img-alt"] != clubname1 and homeTeamImg["data-img-alt"] != clubname2 and homeTeamImg["data-img-alt"] != clubname3):
        return "away"
    return "home"

def create_player_objects(stats): 
    scraped_player = []
    for player in stats["FirstEleven"]:
        p = PlayerX(player[0] + " " + player[1])
        scraped_player.append(p)
    for player in stats["Substitudes"]:
        p = PlayerX(player[0] + " " + player[1])
        scraped_player.append(p)
    for player in scraped_player:
        for scorer in stats["Scorers"]:
            if (player.name == scorer[0] + " " + scorer[1]):
                player.goals += 1
        for scorer in stats["YellowCards"]:
            if (player.name == scorer[0] + " " + scorer[1]):
                player.yellow_cards += 1
        for scorer in stats["YellowRedCards"]:
            if (player.name == scorer[0] + " " + scorer[1]):
                player.yellow_red_cards += 1
        for scorer in stats["RedCards"]:
            if (player.name == scorer[0] + " " + scorer[1]):
                player.red_cards += 1
    return scraped_player

def gui_starter(manual_url, clubname1, clubname2, clubname3):
    mainPageSoup = get_soup(manual_url)

    # Set Home or Away for match events
    home = is_home(mainPageSoup, clubname1, clubname2, clubname3)
    if(home == None):
        return -1

    statistics.update({"Home": home})

    lineupURL = get_lineup_url(mainPageSoup)
    if(lineupURL == None):
        return -1

    lineupSoup = get_soup(lineupURL)

    if(lineupSoup == None):
        return -1

    firstEleven = get_starting_lineup(lineupSoup, clubname1, clubname2, clubname3)
    statistics.update({"FirstEleven": firstEleven})

    substitudes = get_substitutions(mainPageSoup)
    statistics.update({"Substitudes": substitudes})


    scorers = get_scorer(mainPageSoup)
    statistics.update({"Scorers": scorers})

    set_cards(mainPageSoup)
    # print(statistics)

    scraped_players = create_player_objects(statistics)
    json_string = json.dumps([ob.__dict__ for ob in scraped_players])
    print(json_string)

    return 0


if __name__ == '__main__':
    # Filler because empty names would match everytime
    clubname1 = "Filler"
    clubname2 = "Filler"
    clubname3 = "Filler"
    if(len(sys.argv) > 2):
        clubname1 = sys.argv[2].replace("_", " ")
    
    if(len(sys.argv) > 3):
        clubname2 = sys.argv[3].replace("_", " ")
    
    if(len(sys.argv) > 4):
        clubname3 = sys.argv[4].replace("_", " ")
    
    gui_starter(sys.argv[1], clubname1, clubname2, clubname3)