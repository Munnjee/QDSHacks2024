-- Create tables 
  CREATE TABLE `freedb_QDSHacks2024`.`user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `birthdate` datetime NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

  
  CREATE TABLE `freedb_QDSHacks2024`.`user_school` (
  `user_school_id` INT NOT NULL AUTO_INCREMENT,
  `frn_user_id` INT NOT NULL,
  `frn_school_id` INT NOT NULL,
  PRIMARY KEY (`user_school_id`));
  
  CREATE TABLE `freedb_QDSHacks2024`.`school` (
  `school_id` INT NOT NULL AUTO_INCREMENT,
  `school_name` VARCHAR(45) NOT NULL,
  `frn_insurance_id` INT NOT NULL,
  PRIMARY KEY (`school_id`));
  
  CREATE TABLE `freedb_QDSHacks2024`.`insurance` (
  `insurance_id` INT NOT NULL,
  `insurance_company` VARCHAR(45) NOT NULL,
  `insurance_number` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`insurance_id`));

  CREATE TABLE `freedb_QDSHacks2024`.`coverage` (
  `coverage_id` INT NOT NULL AUTO_INCREMENT,
  `frn_insurance_id` INT NOT NULL,
  `frn_category_id` INT NOT NULL,
  `percentage` INT NOT NULL,
  `limit` INT NOT NULL,
  PRIMARY KEY (`coverage_id`));
  
  CREATE TABLE `freedb_QDSHacks2024`.`claim` (
  `claim_id` INT NOT NULL AUTO_INCREMENT,
  `frn_user_school_id` INT NOT NULL,
  `frn_coverage_id` INT NOT NULL,
  `amount` INT NOT NULL,
  PRIMARY KEY (`claim_id`));
  
  SELECT  user.user_name, user.first_name, user.last_name, user.birthdate, user.email, user.phone, school.school_name, insurance.insurance_company, insurance.insurance_number
    FROM user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    JOIN insurance ON school.frn_insurance_id = insurance.insurance_id
    WHERE user.user_name = 'yongeun';
    
  
SELECT * FROM category;


CREATE TABLE `freedb_QDSHacks2024`.`category` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`category_id`));

-- Foreign keys
ALTER TABLE `freedb_QDSHacks2024`.`coverage` 
ADD INDEX `coverage_frn_category_id_idx` (`frn_category_id` ASC) VISIBLE,
ADD INDEX `coverage_frn_insurance_id_idx` (`frn_insurance_id` ASC) VISIBLE;
;
ALTER TABLE `freedb_QDSHacks2024`.`coverage` 
ADD CONSTRAINT `coverage_frn_category_id`
  FOREIGN KEY (`frn_category_id`)
  REFERENCES `freedb_QDSHacks2024`.`category` (`category_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `coverage_frn_insurance_id`
  FOREIGN KEY (`frn_insurance_id`)
  REFERENCES `freedb_QDSHacks2024`.`insurance` (`insurance_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


























ALTER TABLE `freedb_QDSHacks2024`.`coverage` 
ADD INDEX `coverage_frn_category_id_idx` (`frn_category_id` ASC) VISIBLE,
ADD INDEX `coverage_frn_school_id_idx` (`frn_school_id` ASC) VISIBLE;
;
ALTER TABLE `freedb_QDSHacks2024`.`coverage` 
ADD CONSTRAINT `coverage_frn_category_id`
  FOREIGN KEY (`frn_category_id`)
  REFERENCES `freedb_QDSHacks2024`.`category` (`category_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `coverage_frn_school_id`
  FOREIGN KEY (`frn_school_id`)
  REFERENCES `freedb_QDSHacks2024`.`school` (`school_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;  


ALTER TABLE `freedb_QDSHacks2024`.`coverage_balance` 
ADD INDEX `coverage_balance_frn_user_school_id_idx` (`frn_user_school_id` ASC) VISIBLE,
ADD INDEX `coverage_balance_frn_coverage_id_idx` (`frn_coverage_id` ASC) VISIBLE;
;
ALTER TABLE `freedb_QDSHacks2024`.`coverage_balance` 
ADD CONSTRAINT `coverage_balance_frn_user_school_id`
  FOREIGN KEY (`frn_user_school_id`)
  REFERENCES `freedb_QDSHacks2024`.`user_school` (`user_school_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `coverage_balance_frn_coverage_id`
  FOREIGN KEY (`frn_coverage_id`)
  REFERENCES `freedb_QDSHacks2024`.`coverage` (`coverage_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


ALTER TABLE `freedb_QDSHacks2024`.`user_school` 
ADD INDEX `user_school_frn_user_id_idx` (`frn_user_id` ASC) VISIBLE,
ADD INDEX `user_school_frn_school_id_idx` (`frn_school_id` ASC) VISIBLE;
;
ALTER TABLE `freedb_QDSHacks2024`.`user_school` 
ADD CONSTRAINT `user_school_frn_user_id`
  FOREIGN KEY (`frn_user_id`)
  REFERENCES `freedb_QDSHacks2024`.`user` (`user_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `user_school_frn_school_id`
  FOREIGN KEY (`frn_school_id`)
  REFERENCES `freedb_QDSHacks2024`.`school` (`school_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- SELECT 
SELECT  user.user_name, user.first_name, user.last_name, user.password, user.birthdate, user.email, user.phone, school.school_name
FROM user
JOIN user_school ON user.user_id = user_school.frn_user_id
JOIN school ON user_school.frn_school_id = school.school_id
WHERE user.user_name = 'test';

-- school insurance coverage
SELECT school.school_name, school.insurance_company, category.category_name, coverage.limit
FROM school
JOIN coverage ON school.school_id = coverage.frn_school_id
JOIN category ON coverage.frn_category_id = category.category_id
WHERE school.school_name = 'BCIT';


-- school
1	BCIT	Canada Life
2	UBC	Pacific Blue Cross
3	Langara	Pacific Blue Cross
4	SFU	Pacific Blue Cross
	
-- category
1	Prescription Drug
2	Vision
3	Dental
4	Travel
	

SELECT school.school_id, school.school_name, insurance.insurance_id, insurance.insurance_company, insurance.insurance_number
FROM school
JOIN insurance ON school.frn_insurance_id = insurance.insurance_id;

SELECT user_name, first_name, last_name, password, birthdate, email, phone
FROM user
JOIN userschool
WHERE user_name = :user_name;
  
  
SELECT user.user_name, school.school_name, insurance.insurance_id, insurance.insurance_company, insurance.insurance_number,
category.category_name, coverage.limit, coverage.percentage, claim.amount
FROM user
LEFT JOIN user_school ON user.user_id = user_school.frn_user_id
JOIN claim ON user_school.user_school_id = claim.frn_user_school_id
JOIN school ON user_school.frn_school_id = school.school_id
JOIN insurance ON school.frn_insurance_id = insurance.insurance_id
JOIN coverage ON insurance.insurance_id = coverage.frn_insurance_id
JOIN category ON coverage.frn_category_id= category.category_id
WHERE user.user_name = 'yongeun';




SELECT user.user_name, school.school_name, insurance.insurance_id, insurance.insurance_company, insurance.insurance_number,
category.category_name, coverage.limit, coverage.percentage, claim.amount
FROM user
LEFT JOIN user_school ON user.user_id = user_school.frn_user_id
JOIN claim ON user_school.user_school_id = claim.frn_user_school_id
JOIN school ON user_school.frn_school_id = school.school_id
JOIN insurance ON school.frn_insurance_id = insurance.insurance_id
JOIN coverage ON insurance.insurance_id = coverage.frn_insurance_id
JOIN category ON coverage.frn_category_id= category.category_id
WHERE user.user_name = 'yongeun' and school.school_id = 1;


SELECT user.user_name, school.school_name, insurance.insurance_id, insurance.insurance_company, insurance.insurance_number,
category.category_name, coverage.limit, coverage.percentage
FROM user
LEFT JOIN user_school ON user.user_id = user_school.frn_user_id
JOIN school ON user_school.frn_school_id = school.school_id
JOIN insurance ON school.frn_insurance_id = insurance.insurance_id
JOIN coverage ON insurance.insurance_id = coverage.frn_insurance_id
JOIN category ON coverage.frn_category_id= category.category_id
WHERE user.user_name = 'yongeun' and school.school_name = 'BCIT';

SELECT user.user_name, school_id, school_name
FROM user
JOIN user_school ON user.user_id = user_school.frn_user_id
JOIN school ON user_school.frn_school_id = school.school_id
WHERE user.user_name = 'test';

INSERT INTO user

SELECT school.school_id, school.school_name, insurance.insurance_id, insurance.insurance_company, insurance.insurance_number
        FROM school
        JOIN insurance ON school.frn_insurance_id = insurance.insurance_id;
        
        
        SELECT user.user_name, school_id, school_name
    FROM user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    WHERE user.user_name ='test';

INSERT INTO claim (column1, column2, column3)
SELECT source_column1, source_column2, source_column3
FROM source_table
WHERE condition;

    
SELECT user_school.user_school_id, insurance.insurance_id, coverage.coverage_id, category.category_id
		FROM user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    JOIN insurance ON school.frn_insurance_id = insurance.insurance_id
    JOIN coverage ON insurance.insurance_id = coverage.frn_insurance_id
    JOIN category ON coverage.frn_category_id= category.category_id
    WHERE user_name = 'test' and school_id = 1 and category_id;
    
SELECT user_school.user_school_id, insurance.insurance_id, coverage.coverage_id
		FROM user
    JOIN user_school ON user.user_id = user_school.frn_user_id
    JOIN school ON user_school.frn_school_id = school.school_id
    JOIN insurance ON school.frn_insurance_id = insurance.insurance_id
    JOIN coverage ON insurance.insurance_id = coverage.frn_insurance_id
    JOIN category ON coverage.frn_category_id= category.category_id
    WHERE user.user_name = 'test' and school.school_id = 1 and category.category_id = 2;
    
    
    
SELECT category.category_name, category.category_id
FROM user
JOIN user_school ON user.user_id = user_school.frn_user_id
JOIN claim ON user_school.user_school_id = claim.frn_user_school_id
JOIN coverage ON claim.frn_coverage_id = coverage.coverage_id
JOIN category ON coverage.frn_category_id = category.category_id
WHERE user_name = 'test';
