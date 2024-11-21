const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const { waitBrowserLoadEvent } = require("../test-utils/waitBrowserEvent");
const { readTextFile } = require("../test-utils/readTextFile");

// validateEmailForm
let validateEmailForm = null;
let validateEmailFormModule = null;
try {
    validateEmailFormModule = require("./validateEmailForm");
    validateEmailForm = validateEmailFormModule.validateEmailForm;
} catch (error) {}

describe("Browser Events Basics", () => {
    let htmlString;

    let dom;
    let document;

    let virtualConsole;
    let consoleLogListener;

    let url;

    beforeEach(async () => {
        jest.resetAllMocks();

        url = "https://1.1.1.1/";
        consoleLogListener = jest.fn();
        virtualConsole = new VirtualConsole();
        // You can listen for other console methods as well https://github.com/jsdom/jsdom#virtual-consoles
        virtualConsole.on("log", consoleLogListener);

        const filePath = path.join(__dirname, "index.html");
        htmlString = await readTextFile(filePath);

        // Create fake DOM
        dom = new JSDOM(htmlString, {
            runScripts: "dangerously",
            resources: "usable",
            url,
            virtualConsole,
        });

        document = dom.window.document;
    });

    describe("validateEmailForm.js", () => {
        let hiddenClassName;

        beforeEach(() => {
            hiddenClassName = "hidden";
            global.document = document;
            global.CustomEvent = dom.window.CustomEvent;
        });

        it("should create validateEmailForm.js file", () => {
            expect(validateEmailFormModule).not.toBeNull();
        });

        describe('"To" Field Validation', () => {
            it("should be valid when @ char is in the middle of a string", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = "ggg@lll";
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector(
                    ".email-form #to-field-wrapper"
                );
                const toField = toFieldWrapper.querySelector("#to-field");
                const validMark = toFieldWrapper.querySelector(
                    ".email-form__valid-mark"
                );
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName)).toBe(
                    false
                );
            });

            it("should be invalid when @ char is in the middle of a string but string is to short", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = "g@l";
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector(
                    ".email-form #to-field-wrapper"
                );
                const toField = toFieldWrapper.querySelector("#to-field");
                const validMark = toFieldWrapper.querySelector(
                    ".email-form__valid-mark"
                );
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName)).toBe(
                    true
                );
            });

            it("should be invalid when @ char is the first one in a string", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = "@lgggg";
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector(
                    ".email-form #to-field-wrapper"
                );
                const toField = toFieldWrapper.querySelector("#to-field");
                const validMark = toFieldWrapper.querySelector(
                    ".email-form__valid-mark"
                );
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName)).toBe(
                    true
                );
            });

            it("should be invalid when @ char is the last one in a string", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = "lgggg@";
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector(
                    ".email-form #to-field-wrapper"
                );
                const toField = toFieldWrapper.querySelector("#to-field");
                const validMark = toFieldWrapper.querySelector(
                    ".email-form__valid-mark"
                );
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName)).toBe(
                    true
                );
            });

            it("should be invalid when @ char in the middle but only with spaces", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = "   k@h   ";
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector(
                    ".email-form #to-field-wrapper"
                );
                const toField = toFieldWrapper.querySelector("#to-field");
                const validMark = toFieldWrapper.querySelector(
                    ".email-form__valid-mark"
                );
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName)).toBe(
                    true
                );
            });

            it("should be invalid when there spaces inside", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = "kk k@hh";
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector(
                    ".email-form #to-field-wrapper"
                );
                const toField = toFieldWrapper.querySelector("#to-field");
                const validMark = toFieldWrapper.querySelector(
                    ".email-form__valid-mark"
                );
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName)).toBe(
                    true
                );
            });

            function createInputEvent(value) {
                return new dom.window.InputEvent("input", {
                    data: value,
                    cancelable: true,
                    bubbles: true,
                });
            }
        });

        describe('"Topic" Field Validation', () => {
            let warningClassName;
            let topicFieldSelector;

            beforeEach(() => {
                topicFieldSelector =
                    ".email-form #topic-field-wrapper #topic-field";
                warningClassName = "email-form__input_warning";
            });

            it("should get warning class after focus and blur", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const topicField = document.querySelector(topicFieldSelector);

                const focusEvent = createFocusEvent("focus");
                const blurEvent = createFocusEvent("blur");

                topicField.dispatchEvent(focusEvent);
                topicField.dispatchEvent(blurEvent);

                expect(topicField.classList.contains(warningClassName)).toBe(
                    true
                );
            });

            it("should get warning class after focus and blur if only spaces", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const topicField = document.querySelector(topicFieldSelector);

                const focusEvent = createFocusEvent("focus");
                const blurEvent = createFocusEvent("blur");

                topicField.dispatchEvent(focusEvent);
                topicField.value = "      ";
                topicField.dispatchEvent(blurEvent);

                expect(topicField.classList.contains(warningClassName)).toBe(
                    true
                );
            });

            it("should remove warning class name on focus", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const topicField = document.querySelector(topicFieldSelector);

                const focusEvent1 = createFocusEvent("focus");
                const focusEvent2 = createFocusEvent("focus");
                const blurEvent = createFocusEvent("blur");

                topicField.dispatchEvent(focusEvent1);
                topicField.dispatchEvent(blurEvent);
                topicField.dispatchEvent(focusEvent2);

                expect(topicField.classList.contains(warningClassName)).toBe(
                    false
                );
            });

            it("should not add warning class name if topic was typed", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const topicField = document.querySelector(topicFieldSelector);

                const focusEvent = createFocusEvent("focus");
                const blurEvent = createFocusEvent("blur");

                topicField.dispatchEvent(focusEvent);
                topicField.value = " Some New Topic";
                topicField.dispatchEvent(blurEvent);

                expect(topicField.classList.contains(warningClassName)).toBe(
                    false
                );
            });

            function createFocusEvent(eventType) {
                return new dom.window.FocusEvent(eventType, {
                    cancelable: true,
                    bubbles: true,
                });
            }
        });

        describe("Form submit button", () => {
            let emailFormSelector;
            let acceptCheckboxSelector;
            let submitButtonSelector;

            beforeEach(() => {
                emailFormSelector = ".email-form";
                acceptCheckboxSelector = `${emailFormSelector} .email-form__accept-terms`;
                submitButtonSelector = `${emailFormSelector} .email-form__button`;
            });

            it("should enable submit button when accepted terms", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();
                const isButtonDisabled = true;
                const { submitButton, acceptCheckbox } =
                    getSubmitControls(isButtonDisabled);
                initiateCheckboxEvents(acceptCheckbox);

                expect(submitButton.disabled).toBe(false);
            });

            it("should disable submit button when not accepted terms", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();
                const isButtonDisabled = true;
                const { submitButton, acceptCheckbox } =
                    getSubmitControls(isButtonDisabled);
                initiateCheckboxEvents(acceptCheckbox);
                initiateCheckboxEvents(acceptCheckbox);

                expect(submitButton.disabled).toBe(true);
            });

            it("should prevent default when submit", async () => {
                await waitBrowserLoadEvent(document);
                validateEmailForm();
                const isButtonDisabled = true;
                const { acceptCheckbox } = getSubmitControls(isButtonDisabled);
                initiateCheckboxEvents(acceptCheckbox);

                const emailForm = document.querySelector(emailFormSelector);
                const submitEvent = createSubmitEvent();
                submitEvent.preventDefault = jest.fn();

                emailForm.dispatchEvent(submitEvent);

                expect(submitEvent.preventDefault).toHaveBeenCalled();
            });

            it("should initiate custom event", async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();
                const isButtonDisabled = true;
                const { acceptCheckbox } = getSubmitControls(isButtonDisabled);
                initiateCheckboxEvents(acceptCheckbox);

                const emailForm = document.querySelector(emailFormSelector);
                const submitEvent = createSubmitEvent();
                submitEvent.preventDefault = jest.fn();
                const eventPromise = eventListenerPromise(
                    "email-form-submit",
                    document.body
                );

                emailForm.dispatchEvent(submitEvent);
                const isInitiated = await eventPromise;

                expect(isInitiated).toBe(true);
            });

            function getSubmitControls(isButtonDisabled) {
                const submitButton =
                    document.querySelector(submitButtonSelector);
                const acceptCheckbox = document.querySelector(
                    acceptCheckboxSelector
                );

                submitButton.disabled = isButtonDisabled;
                acceptCheckbox.checked = false;

                return { submitButton, acceptCheckbox };
            }

            function initiateCheckboxEvents(acceptCheckbox) {
                const options = {
                    cancelable: true,
                    bubbles: true,
                };

                const clickEvent = new dom.window.MouseEvent("click", options);
                const changeEvent = new dom.window.Event("change", options);
                const inputEvent = new dom.window.Event("input", options);

                acceptCheckbox.dispatchEvent(inputEvent);
                acceptCheckbox.dispatchEvent(clickEvent);
                acceptCheckbox.dispatchEvent(changeEvent);
            }

            function createSubmitEvent() {
                return new dom.window.Event("submit", {
                    cancelable: true,
                    bubbles: true,
                });
            }

            function eventListenerPromise(eventType, element) {
                return new Promise((resolve) => {
                    element.addEventListener(eventType, () => {
                        resolve(true);
                    });
                });
            }
        });
    });
});
