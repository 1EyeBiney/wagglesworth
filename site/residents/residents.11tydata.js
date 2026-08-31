// Directory data for site/residents/ (both the group index and the paginated
// profile template). Title/description are computed here, branching on
// whether this render is a paginated resident profile, so there's exactly
// one source of truth instead of two front-matter values that could drift
// out of sync with each other.
module.exports = {
    eleventyComputed: {
        title: function (data) {
            return data.resident ? data.resident.name : 'Meet the Residents';
        },
        description: function (data) {
            return data.resident ? data.resident.role
                : 'The household of Wagglesworth Estate — Baroness Wagglesworth, her household, and friends of the family.';
        }
    }
};
