/**
 * Created by Jacob Strieb
 * May 2020
 */



/*******************************************************************************
 * Helper Functions
 ******************************************************************************/

// Highlight the text in an input with a given id
function highlight(id) {
    let output = document.querySelector("#" + id);
    output.focus();
    output.select()
    output.setSelectionRange(0, output.value.length + 1);
    return output;
}


// Validate all inputs, and display an error if necessary
function validateInputs() {
    var inputs = document.querySelectorAll(".form .labeled-input input");
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        input.reportValidity = input.reportValidity || (() => true);
        if (!input.reportValidity()) {
            return false;
        }
    }

    // Extra check for older browsers for URL input.
    const url = document.querySelector("#url");
    let urlObj;
    try {
        urlObj = new URL(url.value);
    } catch {
        // Use a more user-friendly alert message
        if (!("reportValidity" in url)) {
            // Note: alerts are blocked in the immersive.
            // This is for external use when deployed to GitHub Pages.
            alert("URL invalid. Make sure to include 'http://' or 'https://' at the "
                + "beginning.");
        }
        return false;
    }

    // Check for non-HTTP protocols; blocks them to prevent XSS attacks. Also
    // allow magnet links for password-protected torrents.
    if (!(urlObj.protocol == "http:" || urlObj.protocol == "https:" || urlObj.protocol == "magnet:")) {
        url.setCustomValidity("The link uses a non-hypertext protocol, which is "
            + "not allowed. The URL begins with " + urlObj.protocol + " and may be "
            + "malicious.");
        url.reportValidity();
        return false;
    }

    return true;
}


// Perform encryption based on parameters, and return a base64-encoded JSON
// object containing all of the relevant data for use in the URL fragment.
async function generateFragment(url, passwd, hint, useRandomSalt, useRandomIv) {
    const api = apiVersions[LATEST_API_VERSION];

    const salt = useRandomSalt ? await api.randomSalt() : null;
    const iv = useRandomIv ? await api.randomIv() : null;
    const encrypted = await api.encrypt(url, passwd, salt, iv);
    const output = {
        v: LATEST_API_VERSION,
        e: b64.binaryToBase64(new Uint8Array(encrypted))
    }

    // Add the hint if there is one
    if (hint != "") {
        output["h"] = hint;
    }

    // Add the salt and/or initialization vector if randomly generated
    if (useRandomSalt) {
        output["s"] = b64.binaryToBase64(salt);
    }
    if (useRandomIv) {
        output["i"] = b64.binaryToBase64(iv);
    }

    // Return the base64-encoded output
    return b64.encode(JSON.stringify(output));
}



/*******************************************************************************
 * Main UI Functions
 ******************************************************************************/

// Activated when the "Encrypt" button is pressed
async function onEncrypt() {
    if (!validateInputs()) {
        return;
    }

    // Check that password is successfully confirmed
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password")
    const confirmation = confirmPassword.value;
    if (password != confirmation) {
        confirmPassword.setCustomValidity("Passwords do not match");
        confirmPassword.reportValidity();
        return;
    }

    // Initialize values for encryption
    const url = document.querySelector("#url").value;
    const useRandomIv = document.querySelector("#iv").checked;
    const useRandomSalt = document.querySelector("#salt").checked;

    const hint = document.querySelector("#hint").value

    const encrypted = await generateFragment(url, password, hint, useRandomSalt,
        useRandomIv);
    // Corrected the output URL to include the '/decrypt' path
    const output = `https://animastertamil.github.io/link-lock/decrypt/#${encrypted}`;

    document.querySelector("#output").value = output;
    highlight("output");

    // Adjust "Hidden Bookmark" link to use your new domain
    document.querySelector("#bookmark").href = `https://animastertamil.github.io/link-lock/hidden/#${encrypted}`;

    // Adjust "Open in New Tab" link
    document.querySelector("#open").href = output;

    // Adjust "Get TinyURL" button
    // document.querySelector("#tinyurl").value = output;

    // Scroll to the bottom so the user sees where the bookmark was created
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });
}


// Activated when the "Copy" button is pressed
function onCopy(id) {
    // Select and copy
    const output = highlight(id);
    document.execCommand("copy");

    // Alert the user that the text was successfully copied
    const alertArea = document.querySelector(".alert");
    alertArea.innerText = `Copied ${output.value.length} characters`;
    alertArea.style.opacity = "1";
    setTimeout(() => { alertArea.style.opacity = 0; }, 3000);

    // Deselect
    output.selectionEnd = output.selectionStart;
    output.blur();
}


// Activated when a user tries to disable randomization of the IV
function onIvCheck(checkbox) {
    if (!checkbox.checked) {
        // Updated the confirm message to be more on-brand and less generic
        checkbox.checked = !confirm("⚠️ Security Warning ⚠️\nDisabling randomization is not recommended. It significantly weakens your link's security and only slightly reduces URL length. Are you sure you want to proceed?");
    }
}
