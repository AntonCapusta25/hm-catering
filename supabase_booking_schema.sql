-- Create booking_submissions table
CREATE TABLE IF NOT EXISTS booking_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  selected_menu TEXT,
  selected_chef TEXT,
  cuisine TEXT,
  event_date TEXT,
  guests TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_booking_submissions_created_at 
ON booking_submissions(created_at DESC);

-- Create index on email for searching
CREATE INDEX IF NOT EXISTS idx_booking_submissions_email 
ON booking_submissions(email);

-- Create index on event_date
CREATE INDEX IF NOT EXISTS idx_booking_submissions_event_date 
ON booking_submissions(event_date);

-- Enable Row Level Security (RLS)
ALTER TABLE booking_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from all users
CREATE POLICY "Allow insert for all users" 
ON booking_submissions 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create policy to allow admins to read all submissions
CREATE POLICY "Allow read for authenticated users" 
ON booking_submissions 
FOR SELECT 
TO authenticated
USING (true);

-- Optional: Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_booking_submissions_updated_at 
BEFORE UPDATE ON booking_submissions 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
