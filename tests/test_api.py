"""Integration tests run against a temporary database and ephemeral local server."""
import http.cookiejar
import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path
import server


class APITest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.original = server.DB
        server.DB = Path(cls.temp.name) / 'test.sqlite3'
        with server.connect() as db:
            db.executescript('CREATE TABLE users(id INTEGER PRIMARY KEY,name TEXT,email TEXT UNIQUE,password TEXT,progress TEXT);'
                             'CREATE TABLE sessions(token TEXT PRIMARY KEY,user_id INTEGER,expires REAL);'
                             'CREATE TABLE attempts(client TEXT,created REAL);')
        cls.http = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        cls.thread = threading.Thread(target=cls.http.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = 'http://127.0.0.1:' + str(cls.http.server_port)

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown()
        cls.http.server_close()
        server.DB = cls.original
        cls.temp.cleanup()

    def setUp(self):
        self.client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))

    def request(self, path, data=None, method=None, origin=None):
        headers = {'Content-Type': 'application/json'}
        if origin:
            headers['Origin'] = origin
        req = urllib.request.Request(self.base+path, data=json.dumps(data).encode() if data is not None else None,
                                     headers=headers, method=method)
        try:
            result = self.client.open(req)
        except urllib.error.HTTPError as err:
            result = err
        return result.status, json.loads(result.read())

    def test_account_lifecycle_and_progress(self):
        code, data = self.request('/api/register', {'name': 'Learner', 'email': 'learner@example.com', 'password': 'password123'})
        self.assertEqual(code, 200)
        self.assertEqual(data['user']['name'], 'Learner')
        self.assertNotIn('password', data['user'])
        self.assertEqual(self.request('/api/me')[1]['user']['email'], 'learner@example.com')
        progress = {'completed': ['alphabet'], 'saved': ['hello'], 'quizScores': [{'score': 4, 'total': 5, 'date': '2026-11-18'}], 'activity': ['2026-11-18']}
        self.assertEqual(self.request('/api/progress', progress, 'PUT')[0], 200)
        self.assertEqual(self.request('/api/me')[1]['progress'], progress)
        self.assertEqual(self.request('/api/logout', {})[0], 200)
        self.assertIsNone(self.request('/api/me')[1]['user'])
        self.assertEqual(self.request('/api/login', {'email': 'learner@example.com', 'password': 'wrong123'})[0], 401)
        self.assertEqual(self.request('/api/login', {'email': 'learner@example.com', 'password': 'password123'})[0], 200)
        self.assertEqual(self.request('/api/me')[1]['progress'], progress)
        self.assertEqual(self.request('/api/progress', {'bad': 'value'}, 'PUT')[0], 400)
        self.assertEqual(self.request('/api/register', {'name': 'Other', 'email': 'learner@example.com', 'password': 'password123'})[0], 409)

    def test_validation_and_protection(self):
        self.assertEqual(self.request('/api/register', {'name': 'A', 'email': 'invalid', 'password': 'short'})[0], 400)
        self.assertEqual(self.request('/api/progress', server.EMPTY, 'PUT')[0], 401)
        self.assertEqual(self.request('/api/logout', {}, origin='https://untrusted.example')[0], 403)
        for path in ['/server.py', '/config.php', '/.data/signbridge.sqlite3', '/.git/config', '/../server.py']:
            self.assertEqual(self.request(path)[0], 404)

    def test_password_hash(self):
        encoded = server.password_hash('test-secret')
        self.assertNotIn('test-secret', encoded)
        self.assertEqual(server.password_hash('test-secret', encoded.split(':')[0]), encoded)
        self.assertNotEqual(server.password_hash('test-secret'), encoded)


if __name__ == '__main__':
    unittest.main()
