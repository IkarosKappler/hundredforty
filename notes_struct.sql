-- phpMyAdmin SQL Dump
-- version 4.1.14.8
-- http://www.phpmyadmin.net
--
-- Host: db658737376.db.1and1.com
-- Erstellungszeit: 16. Jan 2017 um 12:49
-- Server Version: 5.5.53-0+deb7u1-log
-- PHP-Version: 5.4.45-0+deb7u6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `db658737376`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `notes`
--

CREATE TABLE IF NOT EXISTS `notes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `data` varchar(140) COLLATE utf8_unicode_ci NOT NULL,
  `category` varchar(256) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT 'A category.',
  `sha256` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT 'A hash.',
  `remote_address` varchar(40) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL DEFAULT '',
  `referrer` varchar(256) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT 'The HTTP referrer website.',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `image_refs` varchar(4096) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `deleted_at` (`deleted_at`),
  KEY `category` (`category`(255),`sha256`),
  KEY `referrer` (`referrer`(255))
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=243 ;

--
-- Daten für Tabelle `notes`
--
