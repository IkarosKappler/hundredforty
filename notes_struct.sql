-- phpMyAdmin SQL Dump


CREATE TABLE IF NOT EXISTS `notes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `author` varchar(32) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT 'The note''s author.',
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
  KEY `referrer` (`referrer`(255)),
  KEY `author` (`author`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=393 ;
