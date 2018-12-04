#!/usr/bin/python
import json
import cgi
import sys

# Turn on debug mode.
import cgitb
cgitb.enable()

# Print necessary headers.
print 'Content-Type: application/json'
print 

# get client response and parse json  
user_obj = json.load(sys.stdin)
     
#get arguments
username = user_obj["uname"]
score = user_obj["score"]

#sanitize username with some basic ass sql injection protection
if " " in username or ";" in username :
	print "hey, bad actor"
else :
	#update database
	import mysql.connector as mariadb

	#import pymysql
	conn = mariadb.connect(
		db='fallout_mini_game',
		user='root',
		passwd='ec2Purdue',
		host='localhost')
	c = conn.cursor()

	# update database
	sqlInsert = "INSERT INTO leader_board VALUES ('"+username+"', "+str(score)+")"
	c.execute(sqlInsert)
	conn.commit()
