const database = include("databaseConnection");

// Sign up a user
async function submitClaim() {
  let submitClaimSQL = `
		SELECT category_id, category_name
        FROM category;
	`;

  let params = {
    user_name: postData.user_name,
  };

  try {
    const results = await database.query(submitClaimSQL, params);

    console.log("Successfully got category");
    // console.log(results[0]);
    return results;
  } catch (err) {
    console.log("Error getting category");
    console.log(err);
    return [];
  }
}

module.exports = { submitClaim };
