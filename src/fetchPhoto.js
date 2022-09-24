const axios = require('axios');

export default async function fetchPhoto(userSearch, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=30141721-d76c6397e8bd997ef3ff6c661=${userSearch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    const result = await response;
    return result;
  } catch (error) {
    console.log(error);
  }
}