export default async function getTracks(token, timeRange, limit) {
  const timeRangeFormatted = timeRange.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  const params = new URLSearchParams();

  params.append('time_range', timeRangeFormatted);
  params.append('limit', limit);

  await fetch(`https://api.spotify.com/v1/me/top/tracks?${params.toString()}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP status  ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .finally();
}
