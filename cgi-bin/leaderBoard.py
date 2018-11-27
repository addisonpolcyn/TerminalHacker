#!/usr/bin/python

# Turn on debug mode.
import cgitb
cgitb.enable()

# Print necessary headers.
print "Content-Type: text/html"
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

# Print table 
print "<table style='width:100%'><tr><th>Name</th><th>Score</th></tr>"

# Print the contents of the database.
c.execute("SELECT * FROM leader_board")
for row in c.fetchall():
	print "<tr>"
	print "<td>"+row[0]+"</td>"
	print "<td>"+str(row[1])+"</td>"
	print "</tr>"

#print end of table
print "</table>"
