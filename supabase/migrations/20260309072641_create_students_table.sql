/*
  # Create Students Table for Verification System

  1. New Tables
    - `students`
      - `id` (uuid, primary key) - Internal unique identifier
      - `student_id` (text, unique) - Student ID number for verification
      - `first_name` (text) - Student's first name
      - `last_name` (text) - Student's last name
      - `email` (text, unique) - Student's email address
      - `program` (text) - Academic program/major
      - `enrollment_date` (date) - Date of enrollment
      - `status` (text) - Enrollment status (active/inactive)
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `students` table
    - Add policy for public read access (verification purposes)
    - No public write access to protect student data integrity

  3. Important Notes
    - Student IDs must be unique for verification
    - Email addresses must be unique
    - Default status is 'active'
    - Verification is read-only for public access
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  program text NOT NULL,
  enrollment_date date NOT NULL,
  status text DEFAULT 'active' NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for verification"
  ON students
  FOR SELECT
  TO anon
  USING (status = 'active');

-- Insert some sample student data for testing
INSERT INTO students (student_id, first_name, last_name, email, program, enrollment_date, status)
VALUES
  ('STU2024001', 'Alice', 'Johnson', 'alice.johnson@university.edu', 'Computer Science', '2024-09-01', 'active'),
  ('STU2024002', 'Bob', 'Smith', 'bob.smith@university.edu', 'Engineering', '2024-09-01', 'active'),
  ('STU2024003', 'Carol', 'Williams', 'carol.williams@university.edu', 'Business Administration', '2024-09-01', 'active'),
  ('STU2023015', 'David', 'Brown', 'david.brown@university.edu', 'Mathematics', '2023-09-01', 'active'),
  ('STU2023042', 'Emma', 'Davis', 'emma.davis@university.edu', 'Biology', '2023-09-01', 'active')
ON CONFLICT (student_id) DO NOTHING;