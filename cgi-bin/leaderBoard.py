#!/usr/bin/python

# Turn on debug mode.
import cgitb
cgitb.enable()

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

#old stuff
'''
# Print table 
print "<table style='width:100%'><tr><th>World Rank</th><th>Name</th><th>Score</th></tr>"

# Print the contents of the database.
c.execute("SELECT * FROM leader_board ORDER BY score DESC;")
i = 1
for row in c.fetchall():
	print "<tr>"
	print "<td>"+str(i)+"</td>"
	print "<td>"+row[0]+"</td>"
	print "<td>"+str(row[1])+"</td>"
	print "</tr>"
	i+=1

#print end of table
print "</table>"
'''
#new stuff
import json

dict = []
#leaderBoard_dict = {}
c.execute("SELECT * FROM leader_board ORDER BY score ASC;")
for row in c.fetchall():
	#uname = row[0]
	#score = str(row[1])
	#leaderBoard_dict[uname] = score
	dict.append(row)

#pack python dict into json file
jsonFile = json.dumps(dict)

#send jsonFile to client
print jsonFile
