const REST_API_KEY = 'e25c1f8f10faa094c0f8f96def890ede';
const kakaoBookAPI = 'https://dapi.kakao.com/v3/search/book?';
//https://test.cors.workers.dev/?

export const bookSearchData = async ({ queryKey }) => {
  const [_, query] = queryKey;
  const result = fetch(`${kakaoBookAPI}target=title&query=${query}`, {
    headers: {
      Authorization: `KakaoAK ${REST_API_KEY}`,
    },
  }).then((response) => response.json());

  return result;
};
