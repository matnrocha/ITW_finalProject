function SportsViewModel() {
  const self = this;

  self.sports = ko.observableArray([]);
  self.selectedSport = ko.observable(null);
  self.selectedSportDetails = ko.observable({});
  self.latestRequestId = ko.observable(null);
  self.searchQuery = ko.observable("");

  self.sportsCache = {}; 
  self.sportDetailsCache = {};

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const isLatestRequest = (requestId) => self.latestRequestId() === requestId;

  self.fetchSports = async (query = "") => {
    const url = query ? `http://192.168.160.58/Paris2024/api/Sports?q=${encodeURIComponent(query)}` : 'http://192.168.160.58/Paris2024/api/Sports';
    const data = await fetchData(url);
    
    if (data) {
      self.sports(query ? data.filter(sport => sport.Name.toLowerCase().includes(query.toLowerCase())) : data);
    }
  };

  self.searchSports = async () => {
    const query = self.searchQuery().trim();
    self.fetchSports(query);
  };

  self.searchQuery.subscribe((newValue) => self.searchSports());

  self.showSportDetails = async (sport) => {
    self.selectedSport(sport);

    const requestId = Date.now();
    self.latestRequestId(requestId); 

    if (self.sportDetailsCache[sport.Id]) {
      self.selectedSportDetails(self.sportDetailsCache[sport.Id]);
      return;
    }

    const data = await fetchData(`http://192.168.160.58/Paris2024/api/Sports/${sport.Id}`);
    if (isLatestRequest(requestId) && data) {
      self.selectedSportDetails(data);
    }
  };

  self.openSportDetails = async (sport) => {
    const requestId = Date.now();
    self.latestRequestId(requestId);

    const data = await fetchData(`http://192.168.160.58/Paris2024/api/Sports/${sport.Id}`);
    if (isLatestRequest(requestId) && data) {
      self.selectedSportDetails(data);
    }
  };

  self.fetchSports();
}

ko.applyBindings(new SportsViewModel());
