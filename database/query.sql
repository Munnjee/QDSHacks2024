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
-- coverage table 
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

-- claim table
ALTER TABLE `freedb_QDSHacks2024`.`claim` 
ADD INDEX `claim_frn_user_school_id_idx` (`frn_user_school_id` ASC) VISIBLE,
ADD INDEX `claim_frn_coverage_id_idx` (`frn_coverage_id` ASC) VISIBLE;
;
ALTER TABLE `freedb_QDSHacks2024`.`claim` 
ADD CONSTRAINT `claim_frn_user_school_id`
  FOREIGN KEY (`frn_user_school_id`)
  REFERENCES `freedb_QDSHacks2024`.`user_school` (`user_school_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `claim_frn_coverage_id`
  FOREIGN KEY (`frn_coverage_id`)
  REFERENCES `freedb_QDSHacks2024`.`coverage` (`coverage_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- user_school table
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

  -- school table
 ALTER TABLE `freedb_QDSHacks2024`.`school` 
ADD CONSTRAINT `school_frn_insurance_id`
  FOREIGN KEY (`frn_insurance_id`)
  REFERENCES `freedb_QDSHacks2024`.`insurance` (`insurance_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


-- insurance table
INSERT INTO `freedb_QDSHacks2024`.`insurance` (`insurance_company`, `insurance_number`) VALUES ('Canada Life', '330828');
INSERT INTO `freedb_QDSHacks2024`.`insurance` (`insurance_company`, `insurance_number`) VALUES ('Pacific Blue Cross', '43979');
INSERT INTO `freedb_QDSHacks2024`.`insurance` (`insurance_company`, `insurance_number`) VALUES ('Pacific Blue Cross', '79209');
INSERT INTO `freedb_QDSHacks2024`.`insurance` (`insurance_company`, `insurance_number`) VALUES ('Pacific Blue Cross', '2953');
INSERT INTO `freedb_QDSHacks2024`.`insurance` (`insurance_company`, `insurance_number`) VALUES ('Securian Canada', '97180');



























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
INSERT INTO `freedb_QDSHacks2024`.`school` (`school_name`, `frn_insurance_id`) VALUES ('BCIT', '1');
INSERT INTO `freedb_QDSHacks2024`.`school` (`school_name`, `frn_insurance_id`) VALUES ('UBC', '2');
INSERT INTO `freedb_QDSHacks2024`.`school` (`school_name`, `frn_insurance_id`) VALUES ('Langara', '4');
INSERT INTO `freedb_QDSHacks2024`.`school` (`school_name`, `frn_insurance_id`) VALUES ('SFU', '3');
	
-- coverage SFU
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('3', '1', '80', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('3', '2', '100', '360');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('3', '3', '70', '700');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('3', '4', '100', '5000000');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('3', '5', '50', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('3', '6', '80', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('3', '7', '50', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('3', '8', '50', '400');

-- coverage UBC
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('2', '1', '80', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('2', '2', '100', '250');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('2', '3', '100', '750');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('2', '4', '100', '5000000');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('2', '5', '30', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('2', '6', '80', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('2', '7', '30', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('2', '8', '100', '1250');
  
-- coverage langara
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('4', '1', '90', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('4', '2', '100', '300');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('4', '3', '60', '750');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('4', '4', '100', '5000000');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('4', '5', '30', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('4', '6', '80', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('4', '7', '80', '400');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('4', '8', '100', '500');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('4', '8', '100', '500');
INSERT INTO `freedb_QDSHacks2024`.`coverage` (`frn_insurance_id`, `frn_category_id`, `percentage`, `limit`) VALUES ('4', '8', '100', '500');
