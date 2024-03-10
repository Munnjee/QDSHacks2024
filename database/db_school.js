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
    return true;
  } catch (err) {
    console.log("Error inserting user");
    console.log(err);
    return false;
  }
}

module.exports = { getSchools };
