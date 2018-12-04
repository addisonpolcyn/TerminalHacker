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

# some fake JSON for testing:
#arguments =  '{ "uname":"test_bot", "score":9997 }'

# get client response and parse json  
user_obj = json.load(sys.stdin)
     
result = {'success':'true','message':'The Command Completed Successfully'};
print json.dumps(result)    # or "json.dump(result, sys.stdout)"

#get arguments
username = user_obj["uname"]
score = user_obj["score"]

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

print "hello"
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
