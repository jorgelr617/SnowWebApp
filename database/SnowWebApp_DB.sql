CREATE DATABASE  IF NOT EXISTS `snow_web_app` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `snow_web_app`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: snow_web_app
-- ------------------------------------------------------
-- Server version	5.6.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `id_address_pk` int(11) NOT NULL AUTO_INCREMENT,
  `address_line1` varchar(120) NOT NULL,
  `address_line2` varchar(120) NOT NULL,
  `address_line3` varchar(120) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` char(2) NOT NULL,
  `zip_code` varchar(25) NOT NULL,
  PRIMARY KEY (`id_address_pk`),
  UNIQUE KEY `id_address_pk` (`id_address_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_method` (
  `id_payment_method_pk` int(11) NOT NULL AUTO_INCREMENT,
  `payment_method` varchar(45) NOT NULL,
  `credit_crard_full_name` varchar(45) DEFAULT NULL,
  `credit_card_number` varchar(45) DEFAULT NULL,
  `expiry` date DEFAULT NULL,
  `security_code` varchar(45) DEFAULT NULL,
  `checkings_account_holder_full_name` varchar(45) DEFAULT NULL,
  `checkings_bank_account_routing_number` varchar(45) DEFAULT NULL,
  `checkings_bank_account_number` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_payment_method_pk`),
  UNIQUE KEY `id_payment_method_pk` (`id_payment_method_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method`
--

LOCK TABLES `payment_method` WRITE;
/*!40000 ALTER TABLE `payment_method` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile` (
  `id_profile_pk` int(11) NOT NULL AUTO_INCREMENT,
  `profile_name` varchar(45) NOT NULL,
  `id_address_fk` int(11) NOT NULL,
  `id_payment_method_fk` int(11) NOT NULL,
  `id_services_fk` int(11) NOT NULL,
  PRIMARY KEY (`id_profile_pk`),
  UNIQUE KEY `id_services_fk` (`id_services_fk`),
  UNIQUE KEY `id_payment_method_fk` (`id_payment_method_fk`),
  UNIQUE KEY `id_address_fk` (`id_address_fk`),
  UNIQUE KEY `id_profile_pk` (`id_profile_pk`),
  CONSTRAINT `id_address_fk` FOREIGN KEY (`id_address_fk`) REFERENCES `address` (`id_address_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_payment_method_fk` FOREIGN KEY (`id_payment_method_fk`) REFERENCES `payment_method` (`id_payment_method_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_services_fk` FOREIGN KEY (`id_services_fk`) REFERENCES `services` (`id_services_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings_and_reviews`
--

DROP TABLE IF EXISTS `ratings_and_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ratings_and_reviews` (
  `id_ratings_and_reviews_pk` int(11) NOT NULL AUTO_INCREMENT,
  `id_transactions_history_fk` int(11) NOT NULL,
  `stars` int(11) DEFAULT '0',
  `review` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id_ratings_and_reviews_pk`),
  UNIQUE KEY `id_ratings_and_reviews_pk` (`id_ratings_and_reviews_pk`),
  UNIQUE KEY `id_transactions_history_fk` (`id_transactions_history_fk`),
  CONSTRAINT `id_transactions_history_fk` FOREIGN KEY (`id_transactions_history_fk`) REFERENCES `transactions_history` (`id_transactions_history_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings_and_reviews`
--

LOCK TABLES `ratings_and_reviews` WRITE;
/*!40000 ALTER TABLE `ratings_and_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `ratings_and_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id_services_pk` int(11) NOT NULL AUTO_INCREMENT,
  `service_type` varchar(45) NOT NULL,
  `service_description` varchar(45) NOT NULL,
  `service_default_price` varchar(45) NOT NULL,
  PRIMARY KEY (`id_services_pk`),
  UNIQUE KEY `id_services_pk` (`id_services_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_info`
--

DROP TABLE IF EXISTS `transaction_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction_info` (
  `id_transaction_info_pk` int(11) NOT NULL,
  `date_requested` datetime DEFAULT NULL,
  `date_accepted` datetime DEFAULT NULL,
  `date_paid` datetime DEFAULT NULL,
  `date_offer_made` datetime DEFAULT NULL,
  `date_offer_expires` datetime DEFAULT NULL,
  `amount` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_transaction_info_pk`),
  UNIQUE KEY `id_transaction_info_pk_UNIQUE` (`id_transaction_info_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_info`
--

LOCK TABLES `transaction_info` WRITE;
/*!40000 ALTER TABLE `transaction_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions_history`
--

DROP TABLE IF EXISTS `transactions_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions_history` (
  `id_transactions_history_pk` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `id_buyer_fk` int(11) NOT NULL,
  `id_seller_fk` int(11) NOT NULL,
  `id_services_fk` int(11) NOT NULL,
  `id_transaction_info_fk` int(11) NOT NULL,
  PRIMARY KEY (`id_transactions_history_pk`),
  UNIQUE KEY `id_seller_fk` (`id_seller_fk`),
  UNIQUE KEY `id_services_fk` (`id_services_fk`),
  UNIQUE KEY `id_transactions_history_pk` (`id_transactions_history_pk`),
  UNIQUE KEY `id_buyer_fk` (`id_buyer_fk`),
  UNIQUE KEY `id_transaction_info_fk` (`id_transaction_info_fk`),
  CONSTRAINT `id_buyer_fk` FOREIGN KEY (`id_buyer_fk`) REFERENCES `user_account` (`id_user_account_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_seller_fk` FOREIGN KEY (`id_seller_fk`) REFERENCES `user_account` (`id_user_account_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_transaction_info_fk` FOREIGN KEY (`id_transaction_info_fk`) REFERENCES `transaction_info` (`id_transaction_info_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_transaction_services_fk` FOREIGN KEY (`id_services_fk`) REFERENCES `services` (`id_services_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions_history`
--

LOCK TABLES `transactions_history` WRITE;
/*!40000 ALTER TABLE `transactions_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_account`
--

DROP TABLE IF EXISTS `user_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_account` (
  `id_user_account_pk` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `id_user_info_fk` int(11) DEFAULT NULL,
  `id_profile_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_user_account_pk`),
  UNIQUE KEY `id_user_account_pk` (`id_user_account_pk`),
  UNIQUE KEY `id_profile_fk` (`id_profile_fk`),
  UNIQUE KEY `id_user_info_fk` (`id_user_info_fk`),
  CONSTRAINT `id_profile_fk` FOREIGN KEY (`id_profile_fk`) REFERENCES `profile` (`id_profile_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_user_info_fk` FOREIGN KEY (`id_user_info_fk`) REFERENCES `user_info` (`id_user_info_pk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_account`
--

LOCK TABLES `user_account` WRITE;
/*!40000 ALTER TABLE `user_account` DISABLE KEYS */;
INSERT INTO `user_account` VALUES (7,'jorge','12345',NULL,NULL);
/*!40000 ALTER TABLE `user_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_info` (
  `id_user_info_pk` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varbinary(100) NOT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) NOT NULL,
  `user_type` varchar(15) NOT NULL,
  PRIMARY KEY (`id_user_info_pk`),
  UNIQUE KEY `id_user_info_pk` (`id_user_info_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES (117,'k','E','',''),(118,'k','E','',''),(119,'k','E','',''),(120,'k','E','',''),(121,'k','E','',''),(122,'k','E','',''),(123,'k','E','',''),(124,'k','E','',''),(125,'k','E','',''),(126,'k','E','',''),(127,'k','E','',''),(128,'k','E','',''),(129,'k','E','',''),(130,'k','E','',''),(131,'k','E','',''),(132,'k','E','',''),(133,'k','E','',''),(134,'k','E','',''),(135,'k','E','',''),(136,'k','E','',''),(137,'k','E','',''),(138,'k','E','',''),(139,'k','E','',''),(140,'k','E','',''),(141,'k','E','',''),(142,'k','E','',''),(143,'k','E','',''),(144,'k','E','',''),(145,'vÃ£yg','E','',''),(146,'vÃ£yg','E','',''),(147,'vÃ£yg','E','',''),(148,'vÃ£yg','E','',''),(149,'vÃ£yg','E','',''),(150,'vÃ£yg','E','',''),(151,'vÃ£yg','E','',''),(152,'vÃ£yg','E','',''),(153,'vÃ£yg','E','',''),(154,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(155,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(156,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(157,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(158,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(159,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(160,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(161,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(162,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(163,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(164,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(165,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(166,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(167,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(168,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(169,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(170,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(171,'vÃ£ygÂM’≠∞ˇﬂ¸B·àü˚æ8ûûè^\03O˝^ \0H\"ûñ©)”ÂFEÿñ£ˆ€','E','',''),(172,'9âÔ`—∂8lµ{w5\Z“','','',''),(173,'9âÔ`—∂8lµ{w5\Z“','','',''),(174,'9âÔ`—∂8lµ{w5\Z“','','','');
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `email` varchar(45) CHARACTER SET latin1 NOT NULL,
  `password` varchar(45) CHARACTER SET latin1 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('a‚Ä∞¬°\'√¶O≈Ω‚Äú√äv1hZ%√à','√†√ö√¢¬°¬™~i‚Äìh¬¥`K√Ö.√ê\'√≤&≈ì1*¬æ<√Ω.‚ÄòdD¬ß‚Ä¶');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-04-08 17:05:01
