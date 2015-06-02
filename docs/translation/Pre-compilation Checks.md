# Pre-compilation Checks

There are usually errors in the translated files we receive back. Because of this we need to run some checks before 
running the compilation back into the project. Please run each of the following checks:

## Line endings

If the file comes back from the translator with CRLF line endings then the grunt translation task will not process the 
file properly.
However, Git should automatically convert the line endings to LF anyways but you may need to delete and recheck the 
files in your working copy.

## Validate the File

Open the single translated file in [Poedit](http://poedit.net/). You can use the __Validate__ button in the top left 
to test for errors. Chances are you will run into one of two scenarios:

### All is OK

If no errors were found, please skip to __Removing Bad Translations__. You are not in the clear yet.

### Duplicate Message Definitions

Most commonly, you will run into this error. This simply means that there are two definitions with the same key. This 
can happen in one of the following ways:

#### Singular and Plural definitions

Singular and Plural versions of strings are stored in different ways in the `po` files. In some cases we use the 
singular version in one place, and a plural in another, then at another place we switch based on count. This can cause 
problems because gettext sees we have duplicate "keys" for the singular version since the singular and plural versions 
use the same key but have different definitions. To prevent this, we need to convert singular items with plural
 translations to use the plural lookup instead. This would be done like so:

    <p translate translate-n="1" translate-plural="Account Fees">Account Fee</p>

You can see even though we want the text _"Account Fee"_, we force showing the singular version by passing 
`translate-n="1"`. If you want to force the plural version, you would use `translate-n="2"` instead.

Fixing this will require you to manually fix the HTML, and possibly even some of the translations. In the past, we 
have searched for the matching translation strings in the `po` files and modified them to become plurals.

#### Wrapping Definition Keys

When the translators send back the translations, sometimes it is broken into multiple lines, and sometimes it is not.
 This causes duplicate translations because the `grunt translate_missing` cannot properly match up 1:1. This is 
 currently a bug in the task itself that could be modified to fix this problem, but for the time being please be aware. 
 Here is an example of the two versions for same translation:

    #: Broken version
    #: app/views/modals/paymentOptionsBreakdown.html
    msgid ""
    "Payout Amount must be $0.01 to {{ maxAdditional | "
    "currency }}"
    msgstr ""
    "Le montant du paiement doit se situer entre 0,01 $ et {{ maxAdditional | "
    "currency }}"
    
    #: Fixed version
    #: app/views/modals/paymentOptionsBreakdown.html
    msgid "Payout Amount must be $0.01 to {{ maxAdditional | currency }}"
    msgstr ""
    "Le montant du paiement doit se situer entre 0,01 $ et {{ maxAdditional | "
    "currency }}"

You can notice the difference in the `msgid` string. The broken one starts on the second line and wraps at a weird 
point. The fixed one does not. You will notice this problem if the translated string is included in your translated 
files, but you keep getting it in your untranslated files. This is because of the wrapping or other unmatched key 
related issues. To fix it, we generally copy the untranslated `msgid` line from the untranslated file, and find the 
correct matching translation, and overwrite the `msgid`. Re-run the tasks and this should fix it.


## Removing Bad Translations

Sometimes the translators will convert HTML or Angular templating text where it shouldn't be translated. This could 
include HTML attributes, filter names, etc. We suggest a quick review of each of the translated strings while watching 
for theses errors. Here's the scenarios we've run into so far:

### Angular Filter Name Changes

We've seen cases where the translators changed the angular filter name thinking it was a normal word. This would cause 
functionality errors you would see in the console. An example of this would be:

    // Incorrect translation
    {{ totalAmount | divas }}
    
    // Corrected translation
    {{ totalAmount | currency }}

You can look at the untranslated key to determine the correct code.

### Quotes Change to Ticks

Some translations have come back with ticks (`\``) instead of single quotes. This is usually inside of angular code 
with JS:

    // Incorrect translation
    {{ {true:`Enable`, false:`Disable`}[isEnabled] }} Plan
    
    // Corrected translation
    {{ {true:'Enable', false:'Disable'}[isEnabled] }} Plan

### Spaces in Attribute Names

For some reason, attributes can come back with spaces in their names. This is usually after dashed attributes:

    // Incorrect translation
    <a ng- bind="something" ng- click="doThis()"></a>
    
    // Corrected translation
    <a ng-bind="something" ng-click="doThis()"></a>

This will break your functionality and cause console errors if not corrected.

### Double Single Quotes Converted to Single Double Quote

This may be caused by some auto correct in their tools, but some double single quotes (`''`) will be changed to a 
single double quote, escaped (`\"`). This will cause console errors because of bad syntax. Simply convert back to the 
normal state and all is well again:

    // Incorrect translation
    See Plan{{ {true:'s', false: \"}[!!plans.length] }}
    
    // Corrected translation
    See Plan{{ {true:'s', false: ''}[!!plans.length] }}

### Translated Newlines

We've seen some newlines being translated as `\a` instead of `\n`:

    // Incorrect translation
    No Habla\a Espanol
    
    // Corrected translation
    No Habla\n Espanol


### Converting Ampersands

In the HTML, any text that is using an ampersand (`&`) as "and" text needs to be converted to using `&amp;` or the 
translation will not work. We are not sure why this is the case, but we fix for it anyway. This does not apply to 
URLs with parameters. Please refer to this example:

    // Incorrect translation
    Stale & Aging Units
    
    // Corrected translation
    Stale &amp; Aging Units

If you don't make the change, it will simply not convert the string. If you missed this before sending off to 
translators, simply update the HTML and the returned translation file and it will pick it up fine.
