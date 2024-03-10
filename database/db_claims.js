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

async function getClaims(postData) {
  let getClaimsSQL = `
		SELECT 
    category.category_name,
    category.category_id,
    SUM(claim.amount) AS total_amount
    FROM  user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON school.school_id = user_school.frn_school_id
    JOIN claim ON user_school.user_school_id = claim.frn_user_school_id
    JOIN coverage ON claim.frn_coverage_id = coverage.coverage_id
    JOIN category ON coverage.frn_category_id = category.category_id
    WHERE user_name = :user_name AND school_name = :school_name
    GROUP BY category.category_name, category.category_id;
	`;

  let params = {
    user_name: postData.user_name,
    school_name: postData.school_name,
  };

  try {
    const results = await database.query(getClaimsSQL, params);

    console.log("Successfully submitted");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error submitting claim");
    console.log(err);
    return [];
  }
}

module.exports = { submitClaim, getClaims };
