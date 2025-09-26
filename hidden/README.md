Bookmark Knocking: Hidden Bookmarks Without a Browser Extension
Click special bookmarks in the right order to open a hidden link.

Try the demo

Introduction
Imagine that you want to share a private link to your favorite Tamil-dubbed anime with your friends, but you don't want it to be easily accessible on a public computer. How can you make it a bit more difficult to find?

Alternatively, imagine you want to store a secret link to a new episode on a public device. If someone goes through your browsing history or bookmarks, they might discover it. This is a common concern for sharing private or exclusive content.

Almost a year ago, the original creator of this tool developed Link Lock -- a tool to enable anyone to securely password-protect URLs. But adding a password to links isn't always enough.

Link Lock relies on strong cryptography for security, but sometimes a layer of obscurity is a practical necessity. In other words, there are some situations where a bookmark that asks for a password is too suspicious to be useful, even if the password protection is secure.

Bookmark knocking is a novel technique to address this problem. It enables users to hide bookmarks using features already built into every web browser. There are two versions available:

A stable, simplified version integrated directly into Link Lock

An experimental version, designed to test the limits of the idea

How It Works
Bookmark knocking is similar to port knocking, for which it was named. A user who wants access to a hidden link must know to click the right bookmarks in the right "knock sequence." If they do this, they will be redirected to the hidden page.

The concept relies on storing encrypted data about the hidden link in the https://www.google.com/search?q=http://fragment.com/premium(https://en.wikipedia.org/wiki/URI_fragment) or "hash." This is the part of the URL that comes after a #, and typically takes a user to some spot in the middle of the page.

In this case, the hash contains a
base64-encoded
JSON object. The object consists of the
AES-encrypted
secret URL and the currently-attempted knock sequence. The knock sequence
attempt is stored as a string of characters, and is used as a passphrase to
try decrypting the secret link after each knock.

When one of the special knock sequence bookmarks is clicked, it runs JavaScript
to check if the current URL fragment is base64-encoded JSON with the required
information. If not, it redirects to the user-specified decoy bookmark link. If
so, it adds some static characters to the current passphrase attempt string and
tries to decrypt the hidden link using the newly-modified passphrase.

If decryption succeeds, it redirects to the now-decrypted, no-longer-hidden
link. On the other hand, if this attempt fails, it redirects to the bookmark
link that it normally would, but with a URL fragment containing updated
information about the latest attempt. Then the user can perform the next knock
in the sequence, and the process repeats.

Since it is perfectly valid to have an arbitrary hash at the end of a typical
URL, the bookmark behaves normally if the knock sequence is incorrect or
incomplete. The only distinguishing feature of the decoy bookmark URLs is the
presence of a long, nonsensical fragment, which wouldn't alarm most people.

Link Lock Version
The simplified version of bookmark knocking built into Link Lock only supports
two knocks. There is one universal second knock for any valid first knock. Then
the hidden link prompts for a password. This two-knock version provides a
practical level of privacy, without compromising on usability or security.

Who It Is For
Software security claims are only valid relative to a well-defined threat
model. In this case, the software aims to be secure against casual observers,
not state-level actors.

In other words, links protected with bookmark knocking (as implemented here)
will be difficult to notice for most people, let alone crack. But the
protection can be noticed by an astute observer, and can be broken by a
determined adversary. (The keyspace is extremely small. Assume any attacker
with all of the bookmarks in the knock sequence and the ability to brute force
AES-GCM-encrypted data will successfully uncover your hidden link. On the other
hand, if you hide a Link Lock URL, the hidden link will be securely
password-protected.)

Despite shortcomings, bookmark knocking is still a useful part of
defense-in-depth. For more serious security, use the version built into Link
Lock.

Don't forget to use private browsing or incognito mode when accessing hidden
links, otherwise the secret links are stored in your browser history, and the
protection is worthless!

Example use cases:

Hide private links from other users of a shared computer

Prevent embarrassing bookmarks from being accidentally opened during a
live-stream, video call, or demonstration

Access a secret link without typing in a password (if there is concern about
keyloggers or other stalkerware)

Create a fun riddle or prank for the owner of a computer you gain access to

Discreetly save personal bookmarks to a work computer

Known Issues
If you have ideas for how to address the following problems, or want to discuss
others, please open an issue on GitHub or use the contact form.

Generated bookmarks are prefixed with javascript: and therefore cannot have
favicons. As such, they're not perfectly identical to a regular bookmark for
the same site.

Websites that modify the URL fragment will screw up the bookmark knocking.
These sites should not be used for steps in the knock sequence. Some examples
include Gmail and Telegram.

Only tested with desktop Firefox and Chrome. Not tested with Safari, Edge, or
on mobile devices.

Making this idea easy to use and understand is very difficult.

For Abuse Victims
This technology is designed to be helpful for anyone who needs more privacy
than they feel they have, but it cannot guarantee anything. You are the expert
in your own situation, and you need to judge if it is appropriate to use this
software. If you are in a dangerous situation, please seek help.

From a New York Times
Article
on technology and domestic abuse:

If you are in immediate danger, call 911.

If your calls are being tracked, call your local services hotline, like 211
or 311, and ask to be transferred to a local resource center.

If you or someone you know is in an abusive relationship or has been sexually
assaulted, call the National Sexual Assault
Hotline at
800-656-HOPE or the National Domestic Violence
Hotline at 800-799-SAFE (you can also chat
live with an advocate at
NDVH, or text LOVEIS to
22522).
