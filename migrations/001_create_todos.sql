-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster sorting
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);

-- Insert sample data for testing
INSERT INTO todos (title, completed) VALUES
    ('Nastavit vývojové prostředí', true),
    ('Vytvořit TODO aplikaci', false),
    ('Napsat dokumentaci', false);
