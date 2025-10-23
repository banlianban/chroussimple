#!/usr/bin/env python3
import http.server
import socketserver
import os
import urllib.parse

class SPAHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Check if the file exists
        if os.path.exists(path[1:]) and not os.path.isdir(path[1:]):
            # File exists, serve it normally
            super().do_GET()
        else:
            # File doesn't exist, serve index.html for SPA routing
            self.path = '/index.html'
            super().do_GET()

if __name__ == "__main__":
    PORT = 3000
    
    with socketserver.TCPServer(("", PORT), SPAHTTPRequestHandler) as httpd:
        print(f"Serving HTTP on port {PORT} (http://localhost:{PORT}/) ...")
        print("SPA routing enabled - all routes will serve index.html")
        httpd.serve_forever()

