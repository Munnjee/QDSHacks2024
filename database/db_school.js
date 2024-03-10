const database = include("databaseConnection");

async function getSchools() {
  let getSchoolsSQL = `
		SELECT school.school_id, school.school_name, insurance.insurance_id, insurance.insurance_company, insurance.insurance_number
        FROM school
        JOIN insurance ON school.frn_insurance_id = insurance.insurance_id;
	`;
  try {
    const results = await database.query(getSchoolsSQL);

    console.log("Successfully created user");
    console.log(results[0]);
    return results;
  } catch (err) {
    console.log("Error inserting user");
    console.log(err);
    return [];
  }
}

async function getMySchools(postData) {
  let getMySchoolsSQL = `
		SELECT user.user_name, school_id, school_name
    FROM user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    WHERE user.user_name = :user_name;
	`;

  let params = {
    user_name: postData.user_name,
  };

  try {
    const results = await database.query(getMySchoolsSQL, params);

    console.log("Successfully created user");
    console.log(results[0]);
    return results;
  } catch (err) {
    console.log("Error inserting user");
    console.log(err);
    return [];
  }
}

async function signUpSchool() {
  let signUpSchoolSQL = `
		SELECT user.user_name, school_id, school_name
    FROM user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    WHERE user.user_name = 'test';
	`;

  let params = {
    user_name: postData.user_name,
  };

  try {
    const results = await database.query(signUpSchoolSQL, params);

    console.log("Successfully created user");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error inserting user");
    console.log(err);
    return false;
  }
}

module.exports = { getSchools, getMySchools };
