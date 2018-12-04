#!/usr/bin/python

import cgi

# Turn on debug mode.
import cgitb
cgitb.enable()

# Print necessary headers.
#send response
print "Content-Type: text/html"
print

arguments = cgi.FieldStorage()
#get arguments
args = []
for i in arguments.keys():
	args.append(arguments[i].value)

username = args[0]
rawscore = args[1]

#parse arguments
score = int(rawscore)

#sanitize username

#if user is already in database, check if there score is high score, if it is update hgih score
import mysql.connector as mariadb

#import pymysql
conn = mariadb.connect(
    db='fallout_mini_game',
    user='root',
    passwd='ec2Purdue',
    host='localhost')
c = conn.cursor()

#for testing
#username = "wolf"
#score = 69

# Print the contents of the database.
sqlQuery="SELECT * FROM leader_board WHERE uname='" + username +"'"
c.execute(sqlQuery)
dbRes = c.fetchall()

#print "hello"
if len(dbRes) > 0:
	#update score if higher
	res = dbRes[0]
	high_score = res[1]
	
	if high_score < score:
		sqlUpdate = "UPDATE leader_board SET score="+str(score)+" WHERE uname='"+username+"'"
		c.execute(sqlUpdate)
		conn.commit()
else :
	#insert uname and score into table
	sqlInsert = "INSERT INTO leader_board VALUES ('"+username+"', "+str(score)+")"
	c.execute(sqlInsert)
	conn.commit()
