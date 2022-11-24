// Listen on Action click
/**
 * register a onclick Listener on all "symbol" classes
 * toggle opacity by adding or removing "symbolClick" class
 */
function registerClickListener() {
    var images = document.getElementsByClassName('symbol');
    for (let index = 0; index < images.length; index++) {
        const clickString = 'symbolClick';
        const element = images[index];
        element.addEventListener('click', event => {
            let target = event.target;
            if (target === undefined || target === null) {
                return;
            }
            if (target.className === undefined || target.className === null) {
                return;
            }
            if (target.className.includes(clickString)) {
                target.className = target.className.replace(clickString, '');
            }
            else {
                target.className = target.className.concat(' ', clickString);
            }
        });
    }
}
/**
 * Register a OnChange Listener onto an InputElement. Which then contextualizes a HAndlebar
 * @param {*} handlebar_template what handlebar to use
 * @param {HTMLElement} destination change this element
 * @param {HTMLInputElement} input_field Input being listened to
 */
function registerOnNumberChange(handlebar_template, destination, input_field) {
    input_field.addEventListener('change', event => {
        let value = parseInt(event.target.value);
        if (!isNaN(value)) {
            if (value >= 0) {
                let context = {
                    iteration: value,
                };
                let html = handlebar_template(context);
                // destination.innerHTML = destination.innerHTML.concat("",html);
                destination.innerHTML = html;
                registerClickListener();
            }
        }
    });
}
// Handlebar helpers
// times iterator --> for loop
Handlebars.registerHelper('times', function (n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i) {
        accum += block.fn(i);
    }
    return accum;
});
/**
 * Init Handlebar in the special case of the times iterator
 * @param {String} context_selector select the field for the iterator context
 * @param {String} handlebar_selector where to get the handlebars
 * @param {String} destination_selector destination to change
 */
function initIterationTemplate(context_selector, handlebar_selector, destination_selector) {
    // grab the source
    const source = document.querySelector(handlebar_selector).innerHTML;
    // compile it using Handlebars
    const template = Handlebars.compile(source);
    // context for Handlebar times iterator/ helper
    const input = document.getElementById(context_selector);
    const context = {
        iteration: parseInt(input.value),
    };
    // change destination
    document.querySelector(destination_selector).innerHTML = template(context);
    // register Listeners
    registerOnNumberChange(template, document.querySelector(destination_selector), input);
}
// execution
initIterationTemplate('count-action', '#handlebar-action', '.actions');
initIterationTemplate('count-reaction', '#handlebar-reaction', '.reactions');
registerClickListener();
