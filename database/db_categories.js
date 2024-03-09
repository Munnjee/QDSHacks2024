const database = include("databaseConnection");

// Sign up a user
async function getCategories() {
  let getCategoriesSQL = `
		SELECT category_id, category_name
        FROM category;
	`;

  try {
    const results = await database.query(getCategoriesSQL);

    console.log("Successfully got category");
    // console.log(results[0]);
    return results;
  } catch (err) {
    console.log("Error getting category");
    console.log(err);
    return [];
  }
}

module.exports = { getCategories };
