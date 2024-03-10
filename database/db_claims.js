const database = include("databaseConnection");

// Sign up a user
async function submitClaim(postData) {
  let submitClaimSQL = `
		INSERT INTO claim (frn_user_school_id, frn_coverage_id, amount)
    VALUES (:frn_user_school_id, :frn_coverage_id, :amount);
	`;

  let params = {
    frn_user_school_id: postData.user_school_id,
    frn_coverage_id: postData.coverage_id,
    amount: postData.amount,
  };

  try {
    const results = await database.query(submitClaimSQL, params);

    console.log("Successfully submitted");
    // console.log(results[0]);
    return results;
  } catch (err) {
    console.log("Error submitting claim");
    console.log(err);
    return [];
  }
}

module.exports = { submitClaim };
