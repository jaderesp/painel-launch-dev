CREATE DATABASE  IF NOT EXISTS `launch_panel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `launch_panel`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 207.244.239.204    Database: launch_panel
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_cat` int unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(2000) NOT NULL,
  `descricao` varchar(2000) DEFAULT NULL,
  `imagemDir` varchar(2000) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_cat`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Ação','Jogos de ação.','/uploads/categorias/1/81c3512374152823630826401.png','2025-02-28 21:49:25','2025-03-01 21:10:35'),(2,'RPG','Jogos de estratégia.','/uploads/categorias/2/9070662b9561ab50904e5a000.jpg','2025-03-04 19:20:59','2025-03-04 19:22:13');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracoes`
--

DROP TABLE IF EXISTS `configuracoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracoes` (
  `id_conf` int unsigned NOT NULL AUTO_INCREMENT,
  `id_usr` int DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'APP',
  `titulo` varchar(800) NOT NULL,
  `pacote` varchar(2000) NOT NULL,
  `versao` varchar(2000) DEFAULT NULL,
  `img_app` varchar(2000) DEFAULT NULL,
  `img_logo` varchar(2000) DEFAULT NULL,
  `img_back` varchar(1000) DEFAULT NULL,
  `img_banner` varchar(2000) DEFAULT NULL,
  `descricao` varchar(2000) DEFAULT NULL,
  `url_apk` varchar(2000) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_conf`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracoes`
--

LOCK TABLES `configuracoes` WRITE;
/*!40000 ALTER TABLE `configuracoes` DISABLE KEYS */;
INSERT INTO `configuracoes` VALUES (4,3,'MIDIA','Configurações de Mídias','','','[{\'url\':\"\"}]','[{\"url\":\"https://img.freepik.com/free-vector/banking-business-sale-banner-template_23-2150972725.jpg\"}]','[{\"url\":\"https://img.freepik.com/free-vector/banking-business-sale-banner-template_23-2150972725.jpg\"}]','[{\"url\":\"https://img.freepik.com/free-vector/banking-business-sale-banner-template_23-2150972725.jpg\"},{\"url\":\"https://docs.angularjs.org/api/ng/directive/ngClass\"},{\"url\":\"https://img.freepik.com/free-vector/banking-business-sale-banner-template_23-2150972725.jpg\"}]','Configurações de aplicativos (Updates)','','2025-02-17 19:11:28','2025-03-11 19:08:29'),(5,3,'APP','Configurações de Apps','teste','2.3.1','https://img.odcdn.com.br/wp-content/uploads/2017/01/20170127024951.png',NULL,NULL,NULL,'Configurações de aplicativos (APK)','teste','2025-02-17 19:11:28','2025-03-11 19:08:29'),(6,3,'UPDATE','Configurações de Updates','1234','2.3.4','https://img.freepik.com/free-vector/banking-business-sale-banner-template_23-2150972725.jpg',NULL,NULL,NULL,'Configurações de aplicativos (Updates)','https://docs.angularjs.org/api/ng/directive/ngClass','2025-02-17 19:11:28','2025-03-11 19:08:29'),(7,4,'MIDIA','Configurações de Mídias','','','[{\'url\':\"\"}]','[{\"url\":\"\"}]','[{\"url\":\"\"}]','[{\"url\":\"\"}]','Configurações de aplicativos (Updates)','','2025-02-17 19:11:28','2025-03-10 19:06:01'),(8,4,'APP','Configurações de Apps','teste','2.3.1','https://img.odcdn.com.br/wp-content/uploads/2017/01/20170127024951.png',NULL,NULL,NULL,'Configurações de aplicativos (APK)','teste','2025-02-17 19:11:28','2025-03-10 19:06:01'),(9,4,'UPDATE','Configurações de Updates','','','',NULL,NULL,NULL,'Configurações de aplicativos (Updates)','','2025-02-17 19:11:28','2025-03-10 19:06:01');
/*!40000 ALTER TABLE `configuracoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contas`
--

DROP TABLE IF EXISTS `contas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contas` (
  `id_conta` int unsigned NOT NULL AUTO_INCREMENT,
  `id_owner` int unsigned NOT NULL,
  `token` varchar(2000) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_conta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contas`
--

LOCK TABLES `contas` WRITE;
/*!40000 ALTER TABLE `contas` DISABLE KEYS */;
/*!40000 ALTER TABLE `contas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id_game` int unsigned NOT NULL AUTO_INCREMENT,
  `id_cat` int unsigned NOT NULL,
  `titulo` varchar(2000) NOT NULL,
  `descricao` varchar(2000) DEFAULT NULL,
  `urlRoom` varchar(2000) DEFAULT NULL,
  `videoIntoDir` varchar(2000) DEFAULT NULL,
  `urlBanner` varchar(2000) DEFAULT NULL,
  `urlStreamIcon` varchar(2000) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_game`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,1,'Super Mario Bross','As aventuras continuam.','/uploads/games/1/79c12c57a4522499220deb405.sfc','/uploads/games/1/75ee49bbe426206fd77ba4600.mp4','/uploads/games/1/75ee49bbe426206fd77ba4601.jpg','/uploads/games/1/75ee49bbe426206fd77ba4602.png','2025-03-02 17:07:47','2025-03-05 18:59:47'),(2,1,'Mortal Kombat Ultimate','jogo de luta muito realista para sua época.','/uploads/games/2/1be1f48a364ea99e21accfe00.smc','/uploads/games/2/1be1f48a364ea99e21accfe01.mp4',NULL,NULL,'2025-03-04 19:28:26','2025-03-04 19:32:15'),(3,2,'Sonic 1','Jogo do porco espinho mais corajoso do mundo.','/uploads/games/3/33c2d520863423b9f60ddad00.smc','/uploads/games/3/33c2d520863423b9f60ddad01.png','/uploads/games/3/33c2d520863423b9f60ddad03.png','/uploads/games/3/33c2d520863423b9f60ddad02.png','2025-03-05 18:54:49','2025-03-06 15:20:38'),(4,1,'Street Fighter Turbo','Muita ação em briga de rua nostalgia dos anos 90.','/uploads/games/4/b27b58de7af8f93403036fc01.smc',NULL,NULL,NULL,'2025-03-05 19:02:51','2025-03-05 19:03:54');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `installRegs`
--

DROP TABLE IF EXISTS `installRegs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `installRegs` (
  `id_inst` int unsigned NOT NULL AUTO_INCREMENT,
  `id_usr` int DEFAULT NULL,
  `nome` varchar(600) DEFAULT NULL,
  `endereco` varchar(2000) DEFAULT NULL,
  `email` varchar(600) DEFAULT NULL,
  `telefone` varchar(600) DEFAULT NULL,
  `mac` varchar(600) DEFAULT NULL,
  `ip` varchar(600) DEFAULT NULL,
  `observacoes` varchar(2000) DEFAULT NULL,
  `data_expiracao` datetime DEFAULT NULL,
  `data_instalacao` datetime DEFAULT NULL,
  `status` varchar(600) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_inst`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `installRegs`
--

LOCK TABLES `installRegs` WRITE;
/*!40000 ALTER TABLE `installRegs` DISABLE KEYS */;
INSERT INTO `installRegs` VALUES (1,3,'','','','','8894:4545dfd:454dfdfe:454545:4342323','192.44.33.233','Teste de desenvolvimento','2025-04-19 18:45:00','2025-02-20 22:11:28','ATIVO','2025-03-07 22:19:13','2025-03-11 17:30:00'),(2,3,NULL,'Av. 04, QI M3 Lote 05',NULL,'16997132223','sdiuuu:93843i4u4i3:50j44j4:eier8e89','192.168.1.1','teste de desenvolvimento.','2025-03-20 14:41:00','2025-03-07 14:40:00','ATIVO','2025-03-07 23:18:41','2025-03-08 20:23:28');
/*!40000 ALTER TABLE `installRegs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storeApps`
--

DROP TABLE IF EXISTS `storeApps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storeApps` (
  `id_store` int unsigned NOT NULL AUTO_INCREMENT,
  `id_usr` int DEFAULT NULL,
  `titulo` varchar(2000) NOT NULL,
  `url_img` varchar(2000) DEFAULT NULL,
  `url_apk` varchar(2000) DEFAULT NULL,
  `anotacoes` varchar(2000) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_store`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storeApps`
--

LOCK TABLES `storeApps` WRITE;
/*!40000 ALTER TABLE `storeApps` DISABLE KEYS */;
INSERT INTO `storeApps` VALUES (1,3,'App da Loja','https://www.pngplay.com/wp-content/uploads/6/Mobile-Application-Blue-Icon-Transparent-PNG.png','https://url-video-player.br.uptodown.com/android/download.apk','teste de desenvolvimento.','2025-03-12 00:40:24','2025-03-12 00:44:36'),(2,3,'App da Loja 2','https://upload.wikimedia.org/wikipedia/commons/9/9e/Itunes-music-app-icon.png','https://url-video-player.br.uptodown.com/android/download.apk','Teste de desenvolvimento 2','2025-03-12 00:47:32','2025-03-12 00:47:32');
/*!40000 ALTER TABLE `storeApps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usr` int unsigned NOT NULL AUTO_INCREMENT,
  `owner_id` int unsigned NOT NULL,
  `nome` varchar(255) NOT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type_usuario` varchar(255) NOT NULL,
  `data_expiracao` datetime DEFAULT NULL,
  `status` varchar(600) DEFAULT NULL,
  `token` varchar(1200) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_usr`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telefone` (`telefone`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,'Administrador','999999999','admin@admin.com','$2b$10$mAHkKaqrBzmKE2MgdULdCOm2qiF/niGJjIKgL8zeHIXxMrE.pLQv.','admin',NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNzQxNzg2NDk1fQ.4J4bm_1FbfbxIbX0ssOqjNanlyLdkeU54w-OkPZMGrk','2025-02-17 19:11:28','2025-03-12 13:34:55'),(3,1,'Miguel Pereira Silva Júnior','16 99135-8099','cliente@gmail.com','$2b$10$9mVzCMg4ZDEUCuclvR5leudmbCAKA9S3eVAdovf8B.1n1xkCvZxlC','Reseller','2025-03-20 14:41:00',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwiaWF0IjoxNzQxNjMwMTc5fQ.qNM33SWOWRQbH1exSp1mcSiE-4H3537R7nq3HMvB64I','2025-02-28 13:07:56','2025-03-10 18:09:39');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-12 12:09:55
