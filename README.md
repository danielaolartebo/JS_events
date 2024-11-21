# Browser Events

## Task Requirements

**Function "validateEmailForm"**

Write a function `validateEmailForm` which adds validation to an email form.

In the `src` folder create the `validateEmailForm.js` file. This file should export function `validateEmailForm`:

```js
export function validateEmailForm() {
  // Your code
}
```

All the `HTML`and `CSS` required for this task are already created and added to the `index.html` file. You can find it in an element with a class name: `email-form`. It looks like this:

```html
<form action="POST" class="email-form">
  <legend class="email-form__legend">Please, email us you thoughts.</legend>

  <div class="email-form__row" id="to-field-wrapper">
    <label for="to-field" class="email-form__label">To</label>
    <input type="text" name="to" id="to-field" class="email-form__input" />
    <div class="email-form__valid-mark hidden" aria-lable="To field is valid">
      ✅
    </div>
  </div>

  <div class="email-form__row" id="topic-field-wrapper">
    <label for="topic-field" class="email-form__label">Topic</label>
    <input
      type="text"
      name="topic"
      id="topic-field"
      class="email-form__input"
    />
  </div>

  <div class="email-form__row">
    <label for="text-field" class="email-form__label">Text</label>
    <textarea
      class="email-form__text"
      name="text"
      id="text-field"
      cols="30"
      rows="10"
    ></textarea>
  </div>

  <div class="email-form__row">
    <input
      class="email-form__accept-terms"
      type="checkbox"
      name="accept-terms"
      id="accept-terms"
    />
    <label for="accept-terms" class="email-for__label">Accept Terms</label>
  </div>

  <button disabled class="email-form__button" type="submit">Send</button>
</form>
```

As you can see, it is a form for writing an email with 4 fields and a button to submit it.

### Validation of `<input>` inside an element with if `to-field-wrapper`

This field is for a recipient email. So, we expect to get an email with `@` symbol inside.

So, please, add validation for input data. The string is counted valid if it meets these requirements:

1. `@` symbol is in typed string an it is **not the first** and **not the last** character. Please, note we should reject spaces in the beginning and at the end of the string. So, the string `"   @    "` is not valid.
2. String has at least 4 characters including `@` symbol.
3. String does not have spaces between characters.

```js
"test@gmail.com"; // valid
"@gmail.com"; // invalid: @ symbol is the first character
"test@"; // invalid: @ symbol is the last character
"t@g"; // invalid: string is too short
"    t@g    "; // invalid: string it too short
"test @gmail.com"; // invalid: spaces between characters
```

We should conduct validation on every change made by a user.

- If this field is valid, we should show an element with class `email-form__valid-mark` located just after the input. By default, it has `hidden` class.
- If this field is not valid, we should hide an element with the class name `email-form__valid-mark`.

### Validation of `<input>` inside an element with id `topic-field-wrapper`

This field is for a topic of an email. We will mark this field accordingly if a field is not valid.

**Validation Process:**

For running validation, we will use `focus` and `blur` events.

1. If the user focuses on the field, leaves it empty, and focuses on another field or focuses out, we notify the user we expect him to fill it. In this case, we need to add `email-form__input_warning` class to an `<input>` element.
2. If the user focuses field again, we need to remove `email-form__input_warning` class name. Such behavior is required. `<input>` should not have `email-form__input_warning` while it is in focus.
3. If the user focuses on another field, and the topic field is not empty, we don't need to add any additional classes.

Please, note if the topic field has only spaces inside, it is considered empty, and not valid.

### Disable/enable Submit button

At the bottom of the form we have a submit button with the class name `email-form__button`. By default it is disabled. Its disable/enable status relies on the `"Accept Terms"` checkbox. This checkbox has the class name `email-form__accept-terms`. The idea here if the user Accepts the Terms, we enable form submission.

1. If the user checks the checkbox, the button should become enabled.
2. If the user unchecks the checkbox, the button should become disabled.

### Submit the email form

For now, we will not send this form on submission.
If the user submits the form we should:

1. Prevent default action by calling `preventDefault` method of an event object inside the handler. You must prevent default action by calling the method, not by returning `false`, to pass the tests.
2. Dispatch a Custom Event on the `<form class="email-form">` element.
   - Event name `email-form-submit`
   - Event should bubble

Please, note users can submit the form not only by clicking button but also by pressing enter on the keyboard. So, please use `submit` event.

**Example of a function usage:**

```js
validateEmailForm(); // All the event handlers added

document.body.addEventListener("email-form-submit", () => {
  console.log("email-form-submit event");
}); // External event listener for a custom event
```
