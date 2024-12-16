function SportsViewModel() {
    const self = this;

    self.sports = ko.observableArray([]);
    self.selectedSport = ko.observable(null);
    self.selectedSportDetails = ko.observable({});
    self.latestRequestId = ko.observable(null);
    self.searchQuery = ko.observable("");

    self.sportsCache = {}; 
    self.sportDetailsCache = {};

    // lista de esportes
    self.fetchSports = async function (query = "") {
        try {
            let url = 'http://192.168.160.58/Paris2024/api/Sports';
            if (query) {
                url += `?q=${encodeURIComponent(query)}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            
            // Filtrar com oq tá escrito
            if (query) {
                self.sports(data.filter(sport => sport.Name.toLowerCase().includes(query.toLowerCase())));
            } else {
                self.sports(data);
            }
        } catch (error) {
            console.error('Error fetching sports:', error);
        }
    };

    self.searchSports = async function () {
        const query = self.searchQuery().trim();
        if (query === "") {
            self.fetchSports();
            return;
        }
        else{
            self.fetchSports(query)
        }
    };

    self.searchQuery.subscribe(function (newValue) {
        self.searchSports()
    });

    // Detalhes com hover
    self.showSportDetails = async function (sport) {
      self.selectedSport(sport);
      
      const requestId = Date.now();
      self.latestRequestId(requestId); 

      if (self.sportDetailsCache[sport.Id]) {
        self.selectedSportDetails(self.sportDetailsCache[sport.Id]);
        return;
    }

      // pegar os detalhes da api
      try {
        const response = await fetch(`http://192.168.160.58/Paris2024/api/Sports/${sport.Id}`);
        if (self.latestRequestId() !== requestId) {
          // verifica se as informções coincidem (sem isso, algumas vezes as informações nn atualizavam)
          return;
        }
        
        const data = await response.json();
        self.selectedSportDetails(data);  // esporte com hover
      } catch (error) {
        console.error('Error fetching sport details:', error);
      }
    };

    // detalhes no modal
    self.openSportDetails = async function (sport) {
      const requestId = Date.now();
      self.latestRequestId(requestId);

      try {
        const response = await fetch(`http://192.168.160.58/Paris2024/api/Sports/${sport.Id}`);
        if (self.latestRequestId() !== requestId) {
          // msm coisa escrita na linha 31
          return;
        }

        const data = await response.json();
        self.selectedSportDetails(data);
      } catch (error) {
        console.error('Error fetching sport details:', error);
      }
    };

    self.fetchSports();
}

ko.applyBindings(new SportsViewModel());