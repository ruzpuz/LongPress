#!/usr/bin/python

from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from os import curdir, sep

PORT = 8000

class demoAppHandler(BaseHTTPRequestHandler):
	
	def do_GET(self):
		if self.path=="/": self.path="/demo/index.html"
		sendReply = False
		if self.path.endswith(".html"):			
			mimetype='text/html'
			sendReply = True
		if self.path.endswith(".js"):                        
			if "demo" in self.path:
				self.path = "/demo" + self.path
			mimetype='application/javascript'
			sendReply = True
		if self.path.endswith(".css"):                        
			if "demo" in self.path:
				self.path = "/demo" + self.path
			mimetype='text/css'
			sendReply = True

		if sendReply == True:
			f = open(curdir + sep + self.path) 
			self.send_response(200)
			self.send_header('Content-type',mimetype)
			self.end_headers()
			self.wfile.write(f.read())
			f.close()
		return


try:

	httpd = HTTPServer(('', PORT), demoAppHandler)

	print 'Serving at port:', PORT
	httpd.serve_forever()

except KeyboardInterrupt:
	print '\nThanks for trying long-press, hope you like it!\nIf you have any problem visit https://github.com/ruzpuz/long-press'
