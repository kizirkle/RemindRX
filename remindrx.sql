-- MySQL dump 10.13  Distrib 9.6.0, for macos14.8 (arm64)
--
-- Host: localhost    Database: RemindRx
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '83c45b9c-11a2-11f1-a518-f17faad63173:1-732';

--
-- Table structure for table `analysis`
--

DROP TABLE IF EXISTS `analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analysis` (
  `analysis_id` int NOT NULL AUTO_INCREMENT,
  `adherence_rate` decimal(6,5) DEFAULT NULL,
  `missed_doses` int DEFAULT NULL,
  `taken_doses` int DEFAULT NULL,
  `medication_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `log_id` int DEFAULT NULL,
  PRIMARY KEY (`analysis_id`),
  KEY `medication_id` (`medication_id`),
  KEY `patient_id` (`patient_id`),
  KEY `provider_id` (`provider_id`),
  KEY `log_id` (`log_id`),
  CONSTRAINT `analysis_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medication` (`medication_id`) ON DELETE SET NULL,
  CONSTRAINT `analysis_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE SET NULL,
  CONSTRAINT `analysis_ibfk_3` FOREIGN KEY (`provider_id`) REFERENCES `healthcare_provider` (`provider_id`) ON DELETE SET NULL,
  CONSTRAINT `analysis_ibfk_4` FOREIGN KEY (`log_id`) REFERENCES `patient_log` (`log_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analysis`
--

LOCK TABLES `analysis` WRITE;
/*!40000 ALTER TABLE `analysis` DISABLE KEYS */;
/*!40000 ALTER TABLE `analysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_provider`
--

DROP TABLE IF EXISTS `healthcare_provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `healthcare_provider` (
  `provider_id` int NOT NULL AUTO_INCREMENT,
  `provider_first_name` varchar(50) DEFAULT NULL,
  `provider_last_name` varchar(50) DEFAULT NULL,
  `provider_phone_number` varchar(10) DEFAULT NULL,
  `provider_email` varchar(50) DEFAULT NULL,
  `provider_password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`provider_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `healthcare_provider`
--

LOCK TABLES `healthcare_provider` WRITE;
/*!40000 ALTER TABLE `healthcare_provider` DISABLE KEYS */;
INSERT INTO `healthcare_provider` VALUES (100000,'Bob','Smith','8042223333','bob@gmail.com','RandomPasswords444!!!'),(100001,'John','Doe','111','111@gmaill.com','Randompasswords555!!!');
/*!40000 ALTER TABLE `healthcare_provider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medication`
--

DROP TABLE IF EXISTS `medication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medication` (
  `medication_id` int NOT NULL AUTO_INCREMENT,
  `medication_name` varchar(50) DEFAULT NULL,
  `side_effects` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`medication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medication`
--

LOCK TABLES `medication` WRITE;
/*!40000 ALTER TABLE `medication` DISABLE KEYS */;
/*!40000 ALTER TABLE `medication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `patient_id` int NOT NULL AUTO_INCREMENT,
  `patient_first_name` varchar(50) DEFAULT NULL,
  `patient_last_name` varchar(50) DEFAULT NULL,
  `patient_phone_number` varchar(10) DEFAULT NULL,
  `patient_email` varchar(100) DEFAULT NULL,
  `patient_password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES (1,'Jeff','Frank','8043007898','frank@gmail.com','RandomPasswords555!!!');
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_log`
--

DROP TABLE IF EXISTS `patient_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(10) DEFAULT NULL,
  `log_date` date DEFAULT NULL,
  `log_time_taken` time DEFAULT NULL,
  `medication_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `medication_id` (`medication_id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `patient_log_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medication` (`medication_id`) ON DELETE SET NULL,
  CONSTRAINT `patient_log_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_log`
--

LOCK TABLES `patient_log` WRITE;
/*!40000 ALTER TABLE `patient_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PatientProvider`
--

DROP TABLE IF EXISTS `PatientProvider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PatientProvider` (
  `patient_id` int NOT NULL,
  `provider_id` int NOT NULL,
  PRIMARY KEY (`patient_id`,`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PatientProvider`
--

LOCK TABLES `PatientProvider` WRITE;
/*!40000 ALTER TABLE `PatientProvider` DISABLE KEYS */;
INSERT INTO `PatientProvider` VALUES (1,100000);
/*!40000 ALTER TABLE `PatientProvider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription` (
  `prescription_id` int NOT NULL AUTO_INCREMENT,
  `prescription_name` varchar(100) DEFAULT NULL,
  `dose` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `total_pills` int DEFAULT NULL,
  `frequency_hours` int DEFAULT NULL,
  `side_effects` varchar(300) DEFAULT NULL,
  `additional_notes` varchar(500) DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  PRIMARY KEY (`prescription_id`),
  KEY `patient_id` (`patient_id`),
  KEY `provider_id` (`provider_id`),
  CONSTRAINT `prescription_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE SET NULL,
  CONSTRAINT `prescription_ibfk_3` FOREIGN KEY (`provider_id`) REFERENCES `healthcare_provider` (`provider_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription`
--

LOCK TABLES `prescription` WRITE;
/*!40000 ALTER TABLE `prescription` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminder`
--

DROP TABLE IF EXISTS `reminder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reminder` (
  `reminder_id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(500) DEFAULT NULL,
  `send_time` datetime DEFAULT NULL,
  `patient_ID` int DEFAULT NULL,
  PRIMARY KEY (`reminder_id`),
  KEY `patient_ID` (`patient_ID`),
  CONSTRAINT `reminder_ibfk_1` FOREIGN KEY (`patient_ID`) REFERENCES `patient` (`patient_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminder`
--

LOCK TABLES `reminder` WRITE;
/*!40000 ALTER TABLE `reminder` DISABLE KEYS */;
/*!40000 ALTER TABLE `reminder` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-27 15:19:21
