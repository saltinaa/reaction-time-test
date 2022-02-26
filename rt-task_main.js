
/* Change 1: Adding the image hosting site */
// define the site that hosts stimuli images
// usually https://<your-github-username>.github.io/<your-experiment-name>/
var repo_site = "https://saltinaa.github.io/reaction-time-test/"; 

/* create timeline */
var timeline = [];

/* define welcome message trial */
var welcome_block = {
    type: "html-keyboard-response",
    stimulus: "<p>Welcome to the experiment. Press any key to begin.</p>",
};
timeline.push(welcome_block);

/* define instructions trial */
var instructions = {
    type: "html-keyboard-response",
    stimulus: "<p>In this experiment, a blue circle like the one below will " +
        "appear in the center of the screen.</p><p>When you see the circle, " +
        "press the SPACE key as fast as you can.</p>" +
        "<img src='" + repo_site + "img/blue.png'></img>" +
        "<p>Press any key to begin.</p>",
    post_trial_gap: 2000
};
timeline.push(instructions);

/* test trials */

var test_stimuli = [{
        stimulus: repo_site + "img/blue.png", // Change 3: Adding `repo_site` in `test_stimuli`
        data: {
            test_part: 'test',
            correct_response: ' ',
            early_response: ' '
        }
    }
];

var fixation = {
    timeline: [toosoon],
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: ' ',
    trial_duration: function () {
        return jsPsych.randomization.sampleWithReplacement([500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500], 1)[0];
    },
    data: { test_part: fixation }
    conditional_function: function(){
        if (data.key_press) {
            return true;
        } else {
            return false;
        }
    }
}

var toosoon = {
    type: 'html-keyboard-response',
    stimulus: "<p>Too soon! Wait for the blue circle to appear before pressing SPACE." + 
          "<p>Press SPACE to try again.</p>",
    choices: ' '
}

var test = {
    type: "image-keyboard-response",
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ' ',
    data: jsPsych.timelineVariable('data'),
    on_finish: function (data) {
        data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
    },
}

var test_procedure = {
    timeline: [fixation, test],
    timeline_variables: test_stimuli,
    repetitions: 25,
    randomize_order: true
}
timeline.push(test_procedure);

/* define debrief */

var debrief_block = {
    type: "html-keyboard-response",
    stimulus: function () {

        var trials = jsPsych.data.get().filter({
            test_part: 'test'
        });
        var correct_trials = trials.filter({
            correct: true
        });
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        var rt = Math.round(correct_trials.select('rt').mean());

        return "<p>Your average response time was " + rt + "ms.</p>" +
            "<p>Press any key to complete the experiment. Thank you!</p>";

    }
};
timeline.push(debrief_block);
