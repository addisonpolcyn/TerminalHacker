var word_bank = [
    "ACIDS",
    "BARGE",
    "DONNA",
    "ENDER",
    "FLUKE",
    "HASTE",
    "AMOKS",
    "BADGE",
    "PARKA",
    "SUPER",
    "SUITS",
    "FLAGS"
];

var garbage = [
    "/",
	"\"",
	"$",
	"^",
	"|",
    "'",
	"#",
	"_",
	".",
	"*",
	"&",
	"@",
	"+",
	"-",
	"?",
	",",
	":",
	"=",
	";",
	"%",
	"!"
]

var introduction = "VALUT-TEC CORPORATION (TM) TERMALINK PROTOCOL";
var username_prompt = "ENTER YOUR USERNAME BELOW";

var num_cols = 12;
var num_rows = 17;

var username, password;

var max_attempts = 4;
var attempts_remaining = max_attempts;

var start_time, end_time, score;

window.onload = function() {
    word_bank = shuffle_array(word_bank);
    password = word_bank[Math.round(Math.random() * 9)];
    console.log(password);
    
    write_hex();
    write_puzzle();
    setup_click_handlers();
	
    write_introduction();
	$("#name-input").attr("maxlength", 20)
    $("#name-input").focus();
    $("#name-input").keypress(function (ev) {
        var keycode = (ev.keyCode ? ev.keyCode : ev.which);
        if (keycode == '13') {
            username_entered();
        }
    });
}

shuffle_array = function(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

clear_array = function(array) {
    while (array.length) {
        array.pop();
    }

    return array;
}

username_entered = function() {
    $("#columns").css("display", "");

    username = $("#name-input").val();

	$("#name-output").css("display", "none");
    
	write_output("WELCOME USER " + username);
    write_output("ENTER PASSWORD NOW...");
    write_output("");

    start_time = new Date();
}

setup_click_handlers = function() {
    $("#column2").find(".word").click(guess);
    $("#column4").find(".word").click(guess);
}

guess = function() {
    if (attempts_remaining == 0) {
        return;
    }

    var guessed_word = $(this).attr("data-word");
    console.log(guessed_word == password);
	
	if (guessed_word == password) {
        end_time = new Date();

        score = Math.round((end_time - start_time + (max_attempts - attempts_remaining) * 2000) / 10);
		
		attempts_remaining = 0;

   		clear_history();
		
		write_output("ACCESS GRANTED. 04 08 15 16 23 42...");
	   	write_output("HELLO, " + username);
		write_output("SCORE: " + score);

		//post and get leaderboard	
		update_and_post_leader_board(username, score, function(rank) {
		    // code that depends on `rank`
			write_output("RANK: " + rank);
		});
    } else {
        var count = match_count(guessed_word, password);

        clear_history();
        write_output("WELCOME USER " + username);
        write_output("ENTER PASSWORD NOW...");
        write_output("");
 
        write_output("Entered: " + guessed_word);
        write_output("Access denied. " + count + " letter" + (count == 1 ? "" : "s") + " matched.");
        write_output(--attempts_remaining + " attempts remaining.");
        write_output("");

        if (attempts_remaining == 0) {
            clear_history();
            write_output("ACCESS DENIED. LOCKOUT SEQUENCE INITIATED...");

            $("#curtain").height('100%');
            $("#curtain").width('100%');
        }
    }
}

write_hex = function() {
    var start = 43690 + Math.round(Math.random() * (65000 - 43690));
    var i = 0;

    var inner_html = "";
    for (; i < num_rows; i++) {
        inner_html += "0x" + (start + i * num_cols).toString(16).toUpperCase() + "<br>";
    }

    $("#column1").html(inner_html);
    
    inner_html = "";
    for (; i < num_rows * 2; i++) {
        inner_html += "0x" + (start + i * num_cols).toString(16).toUpperCase() + "<br>";
    }

    $("#column3").html(inner_html);
}

write_puzzle = function() {
    $("#column2").html(get_game_column_html());
    $("#column4").html(get_game_column_html());
}

wipe_game = function() {
    $("#column1").html("");
    $("#column2").html("");
    $("#column3").html("");
    $("#column4").html("");
}

update_and_post_leader_board = function(uname, score, callback) {
    var http = new XMLHttpRequest();
        var url = 'http://ec2-18-218-134-15.us-east-2.compute.amazonaws.com/cgi-bin/updateLeaderBoard.py';
        var params = 'uname=' + uname + '&' + 'score=' +score;
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

		//pack JSON object
		var user_object = {};
		user_object.uname = uname;
		user_object.score = score;
		var jsonData = JSON.stringify(user_object);

        http.onreadystatechange = function() { //Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
				//post leaderboard callback
				request_leader_board(function(rank) {
				    // code that depends on `result`
					callback(rank);
				});
            }
        }
		//update leaderboard
        http.send(jsonData);
}

request_leader_board = function(callback) {
    //ajax request
    var http = new XMLHttpRequest();
        var url = 'http://ec2-18-218-134-15.us-east-2.compute.amazonaws.com/cgi-bin/leaderBoard.py';
        http.open('POST', url, true);
        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() { //Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                var leader_table = JSON.parse(http.responseText);
                var rank = write_leader_board(leader_table);
				callback(rank);
			}
        }
        //if want to send parameters
        http.send("");
}

write_leader_board = function(leaderBoard) {
    //wipe game screen
    wipe_game();

    //write table header
    var html_col1 = "RANK</br>";
    var html_col2 = "&nbsp;&nbsp;USER</br>";
    var html_col3 = "SCORE</br>";

	var rank = update_rank(leaderBoard);
	var n = leaderBoard.length; 
    
	//fill table
    for (var i = 0; i < 20; i++) {
		html_col1 += i+1 + "</br>";
        if (i < n) {
			row = leaderBoard[i];
    	    user = row[0]
        	score = row[1]
            html_col2 += "&nbsp;&nbsp;" + append_dots(user) + "</br>";
            html_col3 += score + "</br>";
		} else {
			html_col2 += "&nbsp;&nbsp;" + append_dots("") + "</br>";
            html_col3 += "0" + "</br>";
		}
    }

    //update screen
    $("#column1").html(html_col1);
    $("#column2").html(html_col2);
    $("#column3").html(html_col3);
	return rank;
}

//yee
append_dots = function(string) {
    for(var i = 0; i < 20; i++){
        if(string.length < 20) {
            string += ".";
        }
    }
    return string;
}

var update_rank = function(table) {
	for (var i = 0; i <= table.length; i++) {
		 row = table[i];
		 user_score = row[1];
		 if(user_score == score) {
                //update rank
				return i+1;
        }
	}
}

var words_written = 0;
var word_distance = 45;
get_game_column_html = function() {
    inner_html = "";
    for (var i = 0; i < num_cols * num_rows; i++) {
        if (i % num_cols == 0 && i > 0) {
            inner_html += "<br>";
        }

        if (i % word_distance == 0) {
            var word = word_bank[words_written++];

            var j = i;
            for (; j < i + 5; j++) {
                if (j % num_cols == 0 && j != i) {
                    inner_html += "<br>";
                }

                if (j == i) {
                    inner_html += "<span class=\"character word\" data-word=\"" + word + "\">";
                }

                inner_html += word.charAt(j - i);

                if (j == i + 5 - 1) {
                    inner_html += "</span>"
                }
            }

            i = j - 1;
        } else {
            var garbage_character = garbage[Math.floor(Math.random() * garbage.length)];
            inner_html += "<span class=\"character\">" + garbage_character + "</span>"
        }
    }

    return inner_html;
}

match_count = function(guess, password) {
    var count = 0;
    for (var i = 0; i < guess.length; i++) {
        if (i == password.length) {
            break;
        }

        if (guess.charAt(i) == password.charAt(i)) {
            count++;
        }
    }

    return count;
}

var computer_number = 10 + Math.round(Math.random() * (99 - 10));
write_introduction = function() {
    var output_prefix = "vault-tec@" + computer_number + "> ";

    var inner_html = "";
    inner_html += output_prefix + introduction + "<br>";
    inner_html += output_prefix + username_prompt + "<br>";
    inner_html += output_prefix + "<input id=\"name-input\"></input>";

    document.getElementById("name-output").innerHTML = inner_html;
}

var output_history = [];
write_output = function(output) {
    output = "vault-tec@" + computer_number + "> " + output;
    output_history.push(output);

    if (output_history.length > 18) {
        output_history.shift();
    }

    var inner_html = "";
    for (var i = 0; i < output_history.length; i++) {
        if (i != 0) {
            inner_html += "<br>";
        }

        inner_html += output_history[i];
    }

    document.getElementById("terminal-output").innerHTML = inner_html;
}

clear_history = function() {
    output_history = clear_array(output_history);
}
