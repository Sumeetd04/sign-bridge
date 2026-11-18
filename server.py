"""SignBridge local app server: static UI + SQLite-backed accounts and progress.
Run: python3 server.py (or PORT=3000 python3 server.py).
"""
import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import time
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
DATA = ROOT / '.data'
DATA.mkdir(exist_ok=True)
DB = DATA / 'signbridge.sqlite3'
EMPTY = {'completed': [], 'saved': [], 'quizScores': [], 'activity': []}
ALLOWED = {'/', '/index.html', '/style.css', '/script.js'} | {
    '/' + str(p.relative_to(ROOT)) for p in (ROOT / 'assets').rglob('*') if p.is_file()
}


def connect():
    db = sqlite3.connect(DB, timeout=10)
    db.row_factory = sqlite3.Row
    return db


with connect() as db:
    db.executescript('''
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL, progress TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires REAL NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts (
      client TEXT NOT NULL, created REAL NOT NULL);
    ''')


def password_hash(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.scrypt(password.encode(), salt=salt.encode(), n=16384, r=8, p=1).hex()
    return salt + ':' + digest


def public(row):
    return {'id': row['id'], 'name': row['name'], 'email': row['email']}


def valid_progress(data):
    if not isinstance(data, dict):
        return False
    for key in EMPTY:
        if not isinstance(data.get(key), list) or len(data[key]) > (100 if key == 'quizScores' else 5000):
            return False
    if any(x not in ['alphabet', 'greetings', 'numbers', 'everyday'] for x in data['completed']):
        return False
    sign_ids = ['hello', 'thanks', 'please', 'sorry', 'yes', 'no', 'love', 'help', 'a', 'b', 'c', 'd', 'one', 'two', 'three', 'five']
    if any(x not in sign_ids for x in data['saved']):
        return False
    if any(not isinstance(x, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', x) for x in data['activity']):
        return False
    return all(isinstance(q, dict) and type(q.get('score')) is int and q.get('total') == 5
               and 0 <= q['score'] <= 5 and isinstance(q.get('date'), str)
               and re.fullmatch(r'\d{4}-\d{2}-\d{2}', q['date']) for q in data['quizScores'])


class Handler(BaseHTTPRequestHandler):
    def response(self, code, data, cookie=None):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        if cookie:
            self.send_header('Set-Cookie', cookie)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def current_user(self, db):
        try:
            jar = cookies.SimpleCookie(self.headers.get('Cookie', ''))
            token = jar['signbridge_session'].value
        except (KeyError, cookies.CookieError):
            return None
        return db.execute('SELECT users.* FROM users JOIN sessions ON users.id=sessions.user_id WHERE token=? AND expires>?',
                          (hashlib.sha256(token.encode()).hexdigest(), time.time())).fetchone()

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/api/me':
            with connect() as db:
                user = self.current_user(db)
                self.response(200, {'user': public(user) if user else None,
                                    'progress': json.loads(user['progress']) if user else EMPTY})
            return
        if path not in ALLOWED:
            self.response(404, {'error': 'Not found'})
            return
        file = ROOT / ('index.html' if path == '/' else path[1:])
        body = file.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', {'.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8'}.get(file.suffix, 'application/octet-stream'))
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        self.mutate()

    def do_PUT(self):
        self.mutate()

    def mutate(self):
        # JSON-only requests plus origin checks prevent cross-site form mutations.
        origin = self.headers.get('Origin')
        if origin and urlsplit(origin).netloc != self.headers.get('Host'):
            self.response(403, {'error': 'Cross-origin requests are not allowed.'})
            return
        if self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
            self.response(415, {'error': 'Expected JSON.'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length < 0 or length > 100000:
                raise ValueError()
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict):
                raise ValueError()
        except (ValueError, json.JSONDecodeError):
            self.response(400, {'error': 'Invalid request.'})
            return
        path = urlsplit(self.path).path
        with connect() as db:
            if path in ['/api/register', '/api/login'] and self.command == 'POST':
                client = self.client_address[0]
                db.execute('DELETE FROM attempts WHERE created<?', (time.time()-900,))
                if db.execute('SELECT COUNT(*) FROM attempts WHERE client=?', (client,)).fetchone()[0] >= 30:
                    self.response(429, {'error': 'Too many attempts. Please try again in 15 minutes.'})
                    return
                db.execute('INSERT INTO attempts VALUES (?,?)', (client, time.time()))
                db.commit()
                email = data.get('email', '')
                password = data.get('password', '')
                if not isinstance(email, str) or not isinstance(password, str) or not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email) or len(email) > 254 or not 8 <= len(password) <= 128:
                    self.response(400, {'error': 'Use a valid email and a password of 8–128 characters.'})
                    return
                email = email.strip().lower()
                if path == '/api/register':
                    name = data.get('name', '')
                    if not isinstance(name, str) or not 1 <= len(name.strip()) <= 70:
                        self.response(400, {'error': 'Please enter your name (up to 70 characters).'})
                        return
                    try:
                        db.execute('INSERT INTO users(name,email,password,progress) VALUES (?,?,?,?)',
                                   (name.strip(), email, password_hash(password), json.dumps(EMPTY)))
                    except sqlite3.IntegrityError:
                        self.response(409, {'error': 'An account with this email already exists. Please sign in.'})
                        return
                user = db.execute('SELECT * FROM users WHERE email=?', (email,)).fetchone()
                stored = user['password'] if user else password_hash('not-a-real-password')
                if not hmac.compare_digest(password_hash(password, stored.split(':')[0]), stored) or not user:
                    self.response(401, {'error': 'Email or password is incorrect.'})
                    return
                token = secrets.token_urlsafe(32)
                db.execute('DELETE FROM sessions WHERE expires<?', (time.time(),))
                db.execute('INSERT INTO sessions VALUES (?,?,?)', (hashlib.sha256(token.encode()).hexdigest(), user['id'], time.time()+604800))
                db.commit()
                secure = '; Secure' if self.headers.get('X-Forwarded-Proto') == 'https' else ''
                self.response(200, {'user': public(user), 'progress': json.loads(user['progress'])},
                              f'signbridge_session={token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800{secure}')
                return
            if path == '/api/logout' and self.command == 'POST':
                user = self.current_user(db)
                if user:
                    jar = cookies.SimpleCookie(self.headers.get('Cookie', ''))
                    db.execute('DELETE FROM sessions WHERE token=?', (hashlib.sha256(jar['signbridge_session'].value.encode()).hexdigest(),))
                self.response(200, {'ok': True}, 'signbridge_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0')
                return
            if path == '/api/progress' and self.command == 'PUT':
                user = self.current_user(db)
                if not user:
                    self.response(401, {'error': 'Please sign in to sync progress.'})
                elif not valid_progress(data):
                    self.response(400, {'error': 'Invalid progress data.'})
                else:
                    db.execute('UPDATE users SET progress=? WHERE id=?', (json.dumps({k: data[k] for k in EMPTY}), user['id']))
                    self.response(200, {'ok': True})
                return
            self.response(404, {'error': 'Not found'})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '3000'))
    print(f'SignBridge running on http://0.0.0.0:{port}', flush=True)
    ThreadingHTTPServer(('0.0.0.0', port), Handler).serve_forever()
