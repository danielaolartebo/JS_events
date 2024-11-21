export function validateEmailForm() {
    const form = document.querySelector('.email-form');
    const toField = document.querySelector('#to-field');
    const topicField = document.querySelector('#topic-field');
    const acceptTermsCheckbox = document.querySelector('#accept-terms');
    const submitButton = document.querySelector('.email-form__button');
    const validMark = document.querySelector('.email-form__valid-mark');
  
    // Helper function to check if email is valid
    const isValidEmail = (email) => {
      const trimmedEmail = email.trim();
      return (
        trimmedEmail.length >= 4 &&
        trimmedEmail.indexOf('@') > 0 &&
        trimmedEmail.indexOf('@') < trimmedEmail.length - 1 &&
        !/\s/.test(trimmedEmail)
      );
    };
  
    // Helper function to validate topic field
    const isValidTopic = (topic) => {
      return topic.trim().length > 0;
    };
  
    // Validate email on input change
    toField.addEventListener('input', () => {
      const email = toField.value;
      if (isValidEmail(email)) {
        validMark.classList.remove('hidden');
      } else {
        validMark.classList.add('hidden');
      }
    });
  
    // Validation for topic field with focus and blur
    topicField.addEventListener('focus', () => {
      // Always remove the warning class on focus
      topicField.classList.remove('email-form__input_warning');
    });
  
    topicField.addEventListener('blur', () => {
      if (topicField.value.trim() === '') {
        topicField.classList.add('email-form__input_warning');
      }
    });
  
    // Enable/Disable submit button based on "Accept Terms" checkbox
    acceptTermsCheckbox.addEventListener('change', () => {
      submitButton.disabled = !acceptTermsCheckbox.checked;
    });
  
    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent default form submission
  
      // Dispatch custom event on form submission
      const submitEvent = new CustomEvent('email-form-submit', {
        bubbles: true,
      });
      form.dispatchEvent(submitEvent);
    });
  }
  
  
  
  