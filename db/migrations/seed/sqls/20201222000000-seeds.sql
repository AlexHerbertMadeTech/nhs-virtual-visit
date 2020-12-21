INSERT INTO trusts (name, admin_code, password, video_provider) VALUES ('Test Trust', 'admin', crypt('trustpassword', gen_salt('bf', 8)), 'whereby');
INSERT INTO trusts (name, admin_code, password, video_provider) VALUES ('Test 2 Trust', 'admin2', crypt('trustpassword', gen_salt('bf', 8)), 'whereby');
INSERT INTO hospitals (name, trust_id, support_url, survey_url) VALUES ('Test Hospital',(SELECT id FROM trusts WHERE name='Test Trust'), 'http://place-puppy.com/', 'https://placekitten.com/');
INSERT INTO hospitals (name, trust_id, support_url, survey_url) VALUES ('Test Hospital 2',(SELECT id FROM trusts WHERE name='Test Trust'), 'http://place-puppy.com/', 'https://placekitten.com/');
INSERT INTO hospitals (name, trust_id, support_url, survey_url) VALUES ('Test 2 Hospital',(SELECT id FROM trusts WHERE name='Test 2 Trust'), 'http://place-puppy.com/', 'https://placekitten.com/');
INSERT INTO wards (name, hospital_id, code, trust_id, pin) VALUES ('Test Ward One', (SELECT id FROM hospitals WHERE name='Test Hospital'), 'TEST1', (SELECT id FROM trusts WHERE name='Test Trust'), '1234' );
INSERT INTO wards (name, hospital_id, code, trust_id, pin) VALUES ('Test Ward Two', (SELECT id FROM hospitals WHERE name='Test Hospital 2'), 'TEST2', (SELECT id FROM trusts WHERE name='Test Trust'), '1234');
INSERT INTO wards (name, hospital_id, code, trust_id, pin) VALUES ('Test 2 Ward One', (SELECT id FROM hospitals WHERE name='Test 2 Hospital'), 'TEST22', (SELECT id FROM trusts WHERE name='Test 2 Trust'), '1234');
INSERT INTO wards (name, hospital_id, code, trust_id, archived_at, pin) VALUES ('Archived Ward',  (SELECT id FROM hospitals WHERE name='Test Hospital'), 'TESTARC', (SELECT id FROM trusts WHERE name='Test Trust'), CURRENT_TIMESTAMP);
INSERT INTO admins (email, password) VALUES ('super@email.com', crypt('adminpassword', gen_salt('bf', 8)));

