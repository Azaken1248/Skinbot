import fetch from 'node-fetch';

export async function getSearch(query, pageSize = 100, page = 1) {
  const apiUrl = `https://apis.issou.best/ordr/skins?search=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export async function getRandomSkin(pageSize = 100, page = 1) {
  const data = await getSearch('', pageSize, page); // Call with empty query
  
  if (!data || !data.skins || data.skins.length === 0) {
    throw new Error('No skins found');
  }

  const randomIndex = Math.floor(Math.random() * data.skins.length);
  return data.skins[randomIndex];
}