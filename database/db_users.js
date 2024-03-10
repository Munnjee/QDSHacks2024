const database = include("databaseConnection");

// Sign up a user
async function signUpUser(postData) {
  let signUpUserSQL = `
		INSERT INTO user
		(user_name, first_name, last_name, password, birthdate, email, phone)
		VALUES
		(:user_name, :first_name, :last_name, :password, :birthdate, :email, :phone);
	`;
  let params = {
    user_name: postData.user_name,
    first_name: postData.first_name,
    last_name: postData.last_name,
    password: postData.password,
    birthdate: postData.birthdate,
    email: postData.email,
    phone: postData.phone,
  };
  try {
    const results = await database.query(signUpUserSQL, params);
    console.log("Successfully created user");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error inserting user");
    console.log(err);
    return false;
  }
}

// Get a user
async function getUser(postData) {
  let getUserSQL = `
		SELECT user_name, first_name, last_name, password, birthdate, email, phone
		FROM user
		WHERE user_name = :user_name;
	`;

  let params = {
    user_name: postData.user_name,
  };

  try {
    const results = await database.query(getUserSQL, params);

    console.log("Successfully found user");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error trying to find user");
    console.log(err);
    return false;
  }
}

async function getUserByEmail(postData) {
  let getUserByEmailSQL = `
		SELECT user_name, password, email
		FROM user
		WHERE email = :email;
	`;

  let params = {
    email: postData.email,
  };

  try {
    const results = await database.query(getUserByEmailSQL, params);

    console.log("Successfully found user");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error trying to find user");
    console.log(err);
    return false;
  }
}

// get a user with school list
async function getUserSchool(postData) {
  let getUserSchoolSQL = `
		SELECT  user.user_name, user.first_name, user.last_name, user.password, user.birthdate, user.email, user.phone, school.school_name
    FROM user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    WHERE user.user_name = :user_name;
	`;

  let params = {
    user_name: postData.user_name,
  };

  try {
    const results = await database.query(getUserSchoolSQL, params);

    console.log("Successfully found user");
    // console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error trying to find user");
    console.log(err);
    return false;
  }
}

// get a user with school list
async function getUserProfile(postData) {
  let getUserProfileSQL = `
		SELECT  user.user_name, user.first_name, user.last_name, user.birthdate, user.email, user.phone, school.school_name, insurance.insurance_company, insurance.insurance_number
    FROM user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    JOIN insurance ON school.frn_insurance_id = insurance.insurance_id
    WHERE user.user_name = :user_name;
	`;

  let params = {
    user_name: postData.user_name,
  };

  try {
    const results = await database.query(getUserProfileSQL, params);

    console.log("Successfully found user");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error trying to find user");
    console.log(err);
    return [];
  }
}

async function updatePassword(postData) {
  let updatePasswordSQL = `
		UPDATE user (password) VALUES (:password) WHERE user_name = :user_name;
	`;

  let params = {
    user_name: postData.user_name,
    password: postData.password,
  };

  try {
    const results = await database.query(updatePasswordSQL, params);

    console.log("Successfully retrieved users");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error getting users");
    console.log(err);
    return false;
  }
}

// get a user with coverage balance
async function getUsers(postData) {
  let getUsersSQL = `
		SELECT username, password
		FROM user;
	`;

  try {
    const results = await database.query(getUsersSQL);

    console.log("Successfully retrieved users");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error getting users");
    console.log(err);
    return false;
  }
}

// get a user with school list
async function getUserProfile(postData) {
  let getUserProfileSQL = `
		SELECT  user.user_name, user.first_name, user.last_name, user.birthdate, user.email, user.phone, school.school_name, insurance.insurance_company, insurance.insurance_number
    FROM user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    JOIN insurance ON school.frn_insurance_id = insurance.insurance_id
    WHERE user.user_name = :user_name;
	`;

  let params = {
    user_name: postData.user_name,
  };

  try {
    const results = await database.query(getUserProfileSQL, params);

    console.log("Successfully found user");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error trying to find user");
    console.log(err);
    return [];
  }
}

// get a user with coverage balance
async function getUserCoverageInformation(postData) {
  let getUserCoverageInformationSQL = `
		SELECT user.user_name, school.school_name, category.category_id, category.category_name, coverage.limit, coverage.percentage
    FROM user
    LEFT JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    JOIN insurance ON school.frn_insurance_id = insurance.insurance_id
    JOIN coverage ON insurance.insurance_id = coverage.frn_insurance_id
    JOIN category ON coverage.frn_category_id= category.category_id
    WHERE user.user_name = :user_name and school.school_name = :school_name;
	`;

  let params = {
    user_name: postData.user_name,
    school_name: postData.school_name,
  };

  console.log(params);

  try {
    const results = await database.query(getUserCoverageInformationSQL, params);

    console.log("Successfully retrieved users");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error getting users");
    console.log(err);
    return false;
  }
}

// get a user with coverage balance
async function getUserId(postData) {
  let getUserIdSQL = `
		SELECT user_id
		FROM user
    WHERE user_name = :user_name;
	`;

  let params = {
    user_name: postData.user_name,
  };

  try {
    const results = await database.query(getUserIdSQL, params);

    console.log("Successfully retrieved users");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error getting users");
    console.log(err);
    return false;
  }
}

// get a user with coverage balance
async function getUserClaim(postData) {
  let getUserClaimSQL = `
		SELECT user_school.user_school_id, insurance.insurance_id, coverage.coverage_id
		FROM user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    JOIN insurance ON school.frn_insurance_id = insurance.insurance_id
    JOIN coverage ON insurance.insurance_id = coverage.frn_insurance_id
    JOIN category ON coverage.frn_category_id= category.category_id
    WHERE user.user_name = :user_name and school.school_id = :school_id and category.category_id = :category_id;
	`;

  let params = {
    user_name: postData.user_name,
    school_id: postData.school_id,
    category_id: postData.category_id,
  };

  try {
    const results = await database.query(getUserClaimSQL, params);

    console.log("Successfully retrieved users claim");
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error getting users");
    console.log(err);
    return false;
  }
}

``;
module.exports = {
  signUpUser,
  getUser,
  getUserSchool,
  getUserProfile,
  getUserCoverageInformation,
  getUserId,
  getUserClaim,
};
