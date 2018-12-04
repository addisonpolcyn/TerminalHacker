#!/usr/bin/python

# Turn on debug mode.
import cgitb
cgitb.enable()

import json
# Print necessary headers.
print 'Content-Type: application/json'
print

# Connect to the database.
import mysql.connector as mariadb

#import pymysql
conn = mariadb.connect(
    db='fallout_mini_game',
    user='root',
    passwd='ec2Purdue',
    host='localhost')
c = conn.cursor()

dict = []
c.execute("SELECT * FROM leader_board ORDER BY score ASC;")
for row in c.fetchall():
	dict.append(row)

#pack python dict into json file
jsonFile = json.dumps(dict)

#send jsonFile to client
print jsonFile
