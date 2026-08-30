module.exports = {
    eleventyComputed: {
        title: function (data) {
            return data.location ? data.location.name : 'Explore the Estate';
        },
        description: function (data) {
            return data.location ? data.location.shortDescription
                : 'An illustrated overhead map of Wagglesworth Estate, with every location also reachable as a plain accessible list.';
        }
    }
};
