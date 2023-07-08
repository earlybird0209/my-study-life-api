-- CREATE SCHEMA mystudylife;

-- CREATE TABLE Users
-- (
--     id SERIAL,
--     firstName text,
--     lastName text,
--     email text,
--     password text,
--     salt text,
--     createdAt timestamp without time zone DEFAULT now(),
--     updatedAt timestamp without time zone,
--     CONSTRAINT Users_pkey PRIMARY KEY (id)
-- );

-- INSERT INTO Users(firstName, lastName, email, password, salt, createdAt, updatedAt) VALUES
--     ('Admin', 'User', 'admin@admin.com', '797f4287b61d286b1408e4244f069dbad6eb1bb5fb22cf54e0281be58b19923d', '5e09fc922ed243415c8ef79e4ad52303'), // password: 123123
--     ('Basic', 'User', 'user1@admin.com', '797f4287b61d286b1408e4244f069dbad6eb1bb5fb22cf54e0281be58b19923d', '5e09fc922ed243415c8ef79e4ad52303'),
--     ('Standard', 'User', 'user2@admin.com', '797f4287b61d286b1408e4244f069dbad6eb1bb5fb22cf54e0281be58b19923d', '5e09fc922ed243415c8ef79e4ad52303');