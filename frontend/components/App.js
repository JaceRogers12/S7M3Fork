// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, {useState, useEffect} from 'react';
import axios from "axios";
import * as yup from "yup"
const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

const formSchema = yup.object().shape({
  username: yup.string()
    .trim()
    .required('username is required')
    .min(3, 'username must be at least 3 characters')
    .max(20, 'username cannot exceed 20 characters'),
  favLanguage: yup.string()
    .required('favLanguage is required')
    .oneOf(["javascript", "rust"], 'favLanguage must be either javascript or rust'),
  favFood: yup.string()
    .required('favFood is required')
    .oneOf(["pizza", "spaghetti", "broccoli"], 'favFood must be either broccoli, spaghetti or pizza'),
  agreement: yup.boolean()
    .required('agreement must be accepted')
    .oneOf([true], 'agreement must be accepted')
})

const initialFormValues= {
  username: "",
  favLanguage: "",
  favFood: "",
  agreement: ""
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

export default function App() {
  let [formValues, setFormValues] = useState(initialFormValues);
  let [success, setSuccess] = useState("");
  let [failure, setFailure] = useState("");
  let [disable, setDisable] = useState(true);
  let [validErrors, setValidErrors] = useState(initialFormValues);

  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
useEffect(()=>{
  formSchema.isValid(formValues)
    .then(res => setDisable(!res))
}, [formValues])
  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    const {name, value, type, checked} = evt.target;
    const trimValue = value.trim()
     if (type === "checkbox") {
       setFormValues({...formValues, [name]: checked})
     } else {
       setFormValues({...formValues, [name]: trimValue})
     }
     yup.reach(formSchema, name)
      .validate(trimValue)
      .catch(res => setValidErrors({...validErrors, [name]: res.errors[0]}))
      .then(() => setValidErrors({...validErrors, [name]: ""})) //This always succeeds and I don't know why
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault();
    axios.post('https://webapis.bloomtechdev.com/registration', formValues)
      .catch(res => { console.log("nope", res)
         setFailure('username is not available')
         setSuccess("")
      })
      .then(res => { console.log("yep", res)
         //setSuccess(res.data.message)
         setFormValues(initialFormValues)
         setFailure("")
      })
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {success && <h4 className="success">{success}</h4>}
        {failure && <h4 className="error">{failure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Type Username"
            onChange={onChange}
            value={formValues.username}
          />
          {validErrors.username && <div className="validation">{validErrors.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input
                type="radio"
                name="favLanguage"
                value="javascript"
                onChange={onChange}
                checked={formValues.favLanguage === "javascript"}
              />
              JavaScript
            </label>
            <label>
              <input
                type="radio"
                name="favLanguage"
                value="rust"
                onChange={onChange}
                checked={formValues.favLanguage === "rust"}
              />
              Rust
            </label>
          </fieldset>
          {validErrors.favLanguage && <div className="validation">{validErrors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange={onChange} value={formValues.favFood}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {validErrors.favFood && <div className="validation">{validErrors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input
              id="agreement"
              type="checkbox"
              name="agreement"
              onChange={onChange}
              checked={formValues.agreement}/>
            Agree to our terms
          </label>
          {validErrors.agreement && <div className="validation">{validErrors.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={disable} />
        </div>
      </form>
    </div>
  )
}
