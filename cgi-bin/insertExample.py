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

# Insert some example data.
c.execute("INSERT INTO leader_board VALUES ('One!', 1)")
c.execute("INSERT INTO leader_board VALUES ('Two!', 2)")
c.execute("INSERT INTO leader_board VALUES ('Three!', 3)")
conn.commit()

# Print the contents of the database.
c.execute("SELECT * FROM leader_board")
print [(r[0], r[1]) for r in c.fetchall()]

