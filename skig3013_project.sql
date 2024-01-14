-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 15, 2024 at 12:23 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skig3013_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `avatar`
--

CREATE TABLE `avatar` (
  `id` int(11) NOT NULL,
  `seed` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `avatar`
--

INSERT INTO `avatar` (`id`, `seed`) VALUES
(1, 'https://api.dicebear.com/7.x/bottts/svg?seed=Bear&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(2, 'https://api.dicebear.com/7.x/bottts/svg?seed=Fluffy&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(3, 'https://api.dicebear.com/7.x/bottts/svg?seed=Jasmine&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(4, 'https://api.dicebear.com/7.x/bottts/svg?seed=Sassy&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(5, 'https://api.dicebear.com/7.x/bottts/svg?seed=Angel&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(6, 'https://api.dicebear.com/7.x/bottts/svg?seed=Boots&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(7, 'https://api.dicebear.com/7.x/bottts/svg?seed=Cookie&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(8, 'https://api.dicebear.com/7.x/bottts/svg?seed=Gizmo&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(9, 'https://api.dicebear.com/7.x/bottts/svg?seed=Leo&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(10, 'https://api.dicebear.com/7.x/bottts/svg?seed=Whiskers&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(11, 'https://api.dicebear.com/7.x/bottts/svg?seed=Midnight&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(12, 'https://api.dicebear.com/7.x/bottts/svg?seed=Willow&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(13, 'https://api.dicebear.com/7.x/bottts/svg?seed=Maggie&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(14, 'https://api.dicebear.com/7.x/bottts/svg?seed=Misty&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(15, 'https://api.dicebear.com/7.x/bottts/svg?seed=Gracie&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(16, 'https://api.dicebear.com/7.x/bottts/svg?seed=Pumpkin&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(17, 'https://api.dicebear.com/7.x/bottts/svg?seed=Pepper&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(18, 'https://api.dicebear.com/7.x/bottts/svg?seed=Toby&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(19, 'https://api.dicebear.com/7.x/bottts/svg?seed=Boo&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'),
(20, 'https://api.dicebear.com/7.x/bottts/svg?seed=Cali&scale=90&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf');

-- --------------------------------------------------------

--
-- Table structure for table `experience`
--

CREATE TABLE `experience` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `description` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `experience_tag`
--

CREATE TABLE `experience_tag` (
  `id` int(11) NOT NULL,
  `tag` varchar(255) NOT NULL,
  `experience_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `chapter` int(11) NOT NULL,
  `uploaded_date` date NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `note_section`
--

CREATE TABLE `note_section` (
  `id` int(11) NOT NULL,
  `section` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `note_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `about` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `avatar_id` int(11) NOT NULL DEFAULT 1,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `id` int(11) NOT NULL,
  `chapter` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_question`
--

CREATE TABLE `quiz_question` (
  `id` int(11) NOT NULL,
  `image_path` varchar(500) DEFAULT NULL,
  `question` varchar(255) NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`options`)),
  `answer` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `section_file`
--

CREATE TABLE `section_file` (
  `id` int(11) NOT NULL,
  `uuid_filename` varchar(255) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `section_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `avatar`
--
ALTER TABLE `avatar`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `experience`
--
ALTER TABLE `experience`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `experience_tag`
--
ALTER TABLE `experience_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experience_id` (`experience_id`);

--
-- Indexes for table `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `note_section`
--
ALTER TABLE `note_section`
  ADD PRIMARY KEY (`id`),
  ADD KEY `note_id` (`note_id`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `avatar_id` (`avatar_id`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_ibfk_1` (`user_id`);

--
-- Indexes for table `quiz_question`
--
ALTER TABLE `quiz_question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `section_file`
--
ALTER TABLE `section_file`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `avatar`
--
ALTER TABLE `avatar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `experience`
--
ALTER TABLE `experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `experience_tag`
--
ALTER TABLE `experience_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `note_section`
--
ALTER TABLE `note_section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `quiz_question`
--
ALTER TABLE `quiz_question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `section_file`
--
ALTER TABLE `section_file`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `experience`
--
ALTER TABLE `experience`
  ADD CONSTRAINT `experience_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `experience_tag`
--
ALTER TABLE `experience_tag`
  ADD CONSTRAINT `experience_tag_ibfk_1` FOREIGN KEY (`experience_id`) REFERENCES `experience` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `note`
--
ALTER TABLE `note`
  ADD CONSTRAINT `note_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `note_section`
--
ALTER TABLE `note_section`
  ADD CONSTRAINT `note_section_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `note` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`avatar_id`) REFERENCES `avatar` (`id`),
  ADD CONSTRAINT `profile_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz_question`
--
ALTER TABLE `quiz_question`
  ADD CONSTRAINT `quiz_question_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `section_file`
--
ALTER TABLE `section_file`
  ADD CONSTRAINT `section_file_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `note_section` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
