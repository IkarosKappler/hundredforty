-- phpMyAdmin SQL Dump
-- version 4.1.14.8
-- http://www.phpmyadmin.net
--
-- Host: db658737376.db.1and1.com
-- Generation Time: Dec 01, 2016 at 08:53 PM
-- Server version: 5.5.52-0+deb7u1-log
-- PHP Version: 5.4.45-0+deb7u5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `db658737376`
--

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE IF NOT EXISTS `notes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `data` varchar(140) COLLATE utf8_unicode_ci NOT NULL,
  `remote_address` varchar(40) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=19 ;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id`, `created_at`, `updated_at`, `data`, `remote_address`) VALUES
(1, '2016-11-30 22:12:25', '2016-11-30 22:12:25', 'test', ''),
(2, '2016-11-30 22:12:51', '2016-11-30 22:12:51', 'test', ''),
(3, '2016-11-30 22:14:34', '2016-11-30 22:14:34', 'test', ''),
(4, '2016-11-30 22:31:05', '2016-11-30 22:31:05', 'Test1234', ''),
(5, '2016-11-30 22:31:57', '2016-11-30 22:31:57', 'Test1234', ''),
(6, '2016-11-30 22:32:06', '2016-11-30 22:32:06', 'Test1234', ''),
(7, '2016-12-01 19:38:56', '2016-12-01 19:38:56', 'a', '85.179.148.115'),
(8, '2016-12-01 19:39:08', '2016-12-01 19:39:08', 'a', '85.179.148.115'),
(9, '2016-12-01 19:39:09', '2016-12-01 19:39:09', 'a', '85.179.148.115'),
(10, '2016-12-01 19:39:10', '2016-12-01 19:39:10', 'a', '85.179.148.115'),
(11, '2016-12-01 19:39:10', '2016-12-01 19:39:10', 'a', '85.179.148.115'),
(12, '2016-12-01 19:39:11', '2016-12-01 19:39:11', 'a', '85.179.148.115'),
(13, '2016-12-01 19:39:11', '2016-12-01 19:39:11', 'a', '85.179.148.115'),
(14, '2016-12-01 19:39:12', '2016-12-01 19:39:12', 'a', '85.179.148.115'),
(15, '2016-12-01 19:39:12', '2016-12-01 19:39:12', 'a', '85.179.148.115'),
(16, '2016-12-01 19:39:13', '2016-12-01 19:39:13', 'a', '85.179.148.115'),
(17, '2016-12-01 19:39:13', '2016-12-01 19:39:13', 'a', '85.179.148.115'),
(18, '2016-12-01 19:48:01', '2016-12-01 19:48:01', 'a', '85.179.148.115');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
