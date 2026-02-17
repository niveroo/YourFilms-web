const getNavigateUrl = (filters) => {

    console.log("filters", JSON.stringify(filters));

    const queryParams = new URLSearchParams();

    if (filters.name) {
        queryParams.set('name', filters.name);
    }

    if (filters.minPrice) {
        queryParams.set('minprice', filters.minPrice);
    }

    if (filters.maxPrice) {
        queryParams.set('maxprice', filters.maxPrice);
    }

    if (filters.category) {
        queryParams.set('category', filters.category);
    }

    console.log(queryParams.toString());
    return (`/search?${queryParams.toString()}`);
};

export default getNavigateUrl;