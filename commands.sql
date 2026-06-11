CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes INT DEFAULT 0);
insert into blogs (author, url, title) values ('Testi', 'testiblogi.fi', 'Testiblogi');
insert into blogs (author, url, title, likes) values ('Testi2', 'koodarinmietteitä.fi', 'Koodarin mietteitä', 3);