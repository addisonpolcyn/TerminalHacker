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
        write_output("SCORE: " + score);

        $("#curtain").height('100%');
        $("#curtain").width('100%');
    } else {
        var count = match_count(guessed_word, password);

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