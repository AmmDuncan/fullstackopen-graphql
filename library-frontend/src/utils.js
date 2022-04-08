export const updateCache = (cache, query, addedBook) => {
  const uniqueByName = (list) => {
    const names = new Set();
    return list.filter((item) => {
      return names.has(item.name) ? false : names.set(item.name);
    });
  };
  cache.updateQuery(query, (data) => {
    console.log(data);
    const { allBooks } = data;
    return {
      allBooks: uniqueByName(allBooks.concat(addedBook)),
    };
  });
};
