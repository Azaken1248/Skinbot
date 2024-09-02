async function getAvailableSkins(pageSize = 10) {
    try {
      const response = await fetch(`https://apis.issou.best/ordr/skins?pageSize=${pageSize}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Available skins:', data.skins);
    } catch (error) {
      console.error('Error fetching skins:', error);
    }
  }
  
  async function skinSearch(searchQuery, pageSize = 100, page = 1) {
    const apiUrl = `https://apis.issou.best/ordr/skins?search=${encodeURIComponent(searchQuery)}&pageSize=${pageSize}&page=${page}`;
    
    try {
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log(`Skins found for "${searchQuery}":`, data.skins);
      console.log(`Max skins available:`, data.maxSkins);
    } catch (error) {
      console.error('Error searching skins:', error);
    }
  }
  

  skinSearch("WhiteCat (CK 1.0)"); 
  